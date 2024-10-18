package org.example.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.example.dto.HistoryDTO;
import org.example.dto.PageHistory;
import org.example.dto.ResultDTO;
import org.example.entity.History;
import org.example.exception.BadRequestException;
import org.example.repository.HistoryRepository;
import org.example.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.commons.lang3.StringEscapeUtils;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final String UPLOAD_DIR_IMAGE = "/data/FindSuspect/backend/src/main/frontend/public/image";
    private final String UPLOAD_DIR_VIDEO = "/data/FindSuspect/backend/src/main/frontend/public/video";
    private final String DB_DIR = "/data/FindSuspect/backend/src/main/frontend/public/db";
    private final ObjectMapper objectMapper;
    private final List<String> IMAGE_EXTENSIONS = Arrays.asList(".jpg", ".jpeg", ".png");
    private final String dataPath = "/data/FindSuspect/backend/src/main/resources/data";
    private List<Map.Entry<String, ResultDTO>> result;
    private final HistoryRepository historyRepository;
    private final Util util;

    private String finalImage;

    private void saveImage(MultipartFile file) {
        String fileName = file.getOriginalFilename();

        File dirPath = new File(UPLOAD_DIR_IMAGE);
        if (dirPath.exists()) {
            util.deleteFolder(dirPath);  // 폴더와 그 안의 모든 내용을 삭제
        }

        if (!dirPath.mkdirs())
            throw new BadRequestException("folder make fail");

        Path targetPath = Paths.get(UPLOAD_DIR_IMAGE, fileName);

        // 해당 path 에 파일의 스트림 데이터를 저장
        try (OutputStream os = Files.newOutputStream(targetPath)) {
            os.write(file.getBytes());
        } catch (IOException e) {
            throw new BadRequestException("image save fail");
        }
    }

    public void uploadImage(MultipartFile imageFile) {
        File dataFolder = new File(dataPath);
        util.deleteFolder(dataFolder);
        
        if (!dataFolder.mkdirs())
            throw new BadRequestException("folder make fail");
        saveImage(imageFile);
        imagePython(imageFile.getOriginalFilename());
    }

    public List<Map.Entry<String, ResultDTO>> getResult(){
        util.checkCuda();
        return this.result;
    }

    private void imagePython(String fileName){
        util.checkCuda();
        String command = "python algorithm/image_upload.py " + fileName;

        int exitCode = util.newProcess(command);
        if(exitCode != 0)
            throw new BadRequestException("image feature error");
        finalImage = fileName;
        readResultJson(fileName);
    }

     private void readResultJson(String fileName) {
        //result.json읽어 파싱 후 List로
        File dir = new File(dataPath);
        File[] jsonFiles = dir.listFiles((d, name) -> name.endsWith(".json"));

        Map<String, ResultDTO> resultMap = new HashMap<>();

        assert jsonFiles != null;
        for (File jsonFile : jsonFiles) {
            // JSON 파일을 Map<String, Object>로 파싱
            Map<String, Object> fileData ;
            try {
                fileData = objectMapper.readValue(jsonFile, new TypeReference<Map<String, Object>>() {});
            } catch (IOException e) {
                throw new BadRequestException("result json read fail");
            }

            // 파싱된 데이터를 SaveDataDto 객체로 변환
            for (Map.Entry<String, Object> entry : fileData.entrySet()) {
                ResultDTO dto = objectMapper.convertValue(entry.getValue(), ResultDTO.class);
                resultMap.put(entry.getKey(), dto);
            }
        }

        // frame 번호를 추출하여 time 설정
        Pattern pattern = Pattern.compile("frame(\\d+)");
        for (Map.Entry<String, ResultDTO> entry : resultMap.entrySet()) {
            String key = entry.getKey();
            ResultDTO dto = entry.getValue();

            Matcher matcher = pattern.matcher(key);
            if (matcher.find()) {
                int time = Integer.parseInt(matcher.group(1));
                int minute = time / 60;
                int second = (time) % 60;
                String strTime = String.format("%d:%02d", minute, second);
                dto.setTime(strTime);
            }
        }

        result = new ArrayList<>(resultMap.entrySet());
        result.sort((e1, e2) -> Double.compare(e2.getValue().getSimilarity(), e1.getValue().getSimilarity()));

    }

    public String getPath(){
        return "image/" + finalImage ;
    }

    public List<Entry<String, ResultDTO>> getResultByVideoName() {
        return result.stream()
                // 두 개의 Comparator를 먼저 videoName 오름차순, 그다음 similarity 내림차순으로 연결
                .sorted(Comparator.comparing((Map.Entry<String, ResultDTO> entry) -> entry.getValue().getVideoName()) // videoName 오름차순
                        .thenComparing(Comparator.comparing((Map.Entry<String, ResultDTO> entry) -> entry.getValue().getSimilarity()).reversed())) // similarity 내림차순
                .collect(Collectors.toList());
    }

    public int saveHistory(String videoImage) {
        if(result == null)
            throw new BadRequestException("result is null");


        ResultDTO resultDTO = null;

        for(Map.Entry<String,ResultDTO> mp : result){
            if(mp.getKey().equals(videoImage)){
                resultDTO = mp.getValue();
            }
        }

        if(resultDTO == null) throw new BadRequestException("imageName not found");

        copyAllImages(UPLOAD_DIR_IMAGE, DB_DIR);
        copyAllImagesWithKeyword(UPLOAD_DIR_VIDEO+"/"+resultDTO.getVideoName(), DB_DIR, videoImage);
        History history = new History(finalImage, videoImage, resultDTO);
        history = historyRepository.save(history);
        return history.getId();
    }

    private void copyAllImages(String srcDir, String destDir) {
        try {
            Path sourceDirPath = Paths.get(srcDir);
            Path destinationDirPath = Paths.get(destDir);

            // 목적지 디렉토리가 없으면 생성
            if (Files.notExists(destinationDirPath)) {
                Files.createDirectories(destinationDirPath);
            }

            // srcDir 내의 모든 파일을 순회
            Files.walk(sourceDirPath)
                    .filter(Files::isRegularFile) // 파일만 선택
                    .filter(this::isImageFile)    // 이미지 파일만 선택
                    .forEach(sourcePath -> {
                        try {
                            // 목적지 경로를 생성
                            Path destinationPath = destinationDirPath.resolve(sourceDirPath.relativize(sourcePath));
                            // 파일이 이미 존재하는지 확인
                            if (!Files.exists(destinationPath)) {
                                // 파일 복사
                                Files.copy(sourcePath, destinationPath, StandardCopyOption.REPLACE_EXISTING);
                            }
                        } catch (IOException e) {
                            throw new BadRequestException("파일 복사 실패: " + sourcePath);
                        }
                    });
        } catch (IOException e) {
            e.printStackTrace();
            //throw new BadRequestException("파일 복사 실패");
        }
    }
    
    private void copyAllImagesWithKeyword(String srcDir, String destDir, String videoName) {
        int index = videoName.indexOf("_cropped.jpg");
        final String keyword = videoName.substring(0,index);
        System.out.println(keyword);
        try {
            Path sourceDirPath = Paths.get(srcDir);
            Path destinationDirPath = Paths.get(destDir);

            // 목적지 디렉토리가 없으면 생성
            if (Files.notExists(destinationDirPath)) {
                Files.createDirectories(destinationDirPath);
            }

            // srcDir 내의 모든 파일을 순회
            Files.walk(sourceDirPath)
                    .filter(Files::isRegularFile) // 파일만 선택
                    .filter(this::isImageFile)    // 이미지 파일만 선택
                    .filter(sourcePath -> sourcePath.toString().contains(keyword))
                    .forEach(sourcePath -> {
                        try {
                            // 목적지 경로를 생성
                            Path destinationPath = destinationDirPath.resolve(sourceDirPath.relativize(sourcePath));
                            // 파일이 이미 존재하는지 확인
                            if (!Files.exists(destinationPath)) {
                                // 파일 복사
                                Files.copy(sourcePath, destinationPath, StandardCopyOption.REPLACE_EXISTING);
                            }
                        } catch (IOException e) {
                            throw new BadRequestException("파일 복사 실패: " + sourcePath);
                        }
                    });
        } catch (IOException e) {
            //e.printStackTrace();
            throw new BadRequestException("파일 복사 실패");
        }
    }

    // 이미지 파일인지 확인하는 메서드
    private boolean isImageFile(Path filePath) {
        String fileName = filePath.getFileName().toString().toLowerCase();
        return IMAGE_EXTENSIONS.stream().anyMatch(fileName::endsWith);
    }
}
