package org.example.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.exception.BadRequestException;
import org.example.util.Util;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;
import org.example.repository.HistoryRepository;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;


@Service
@AllArgsConstructor
public class VideoService {
    private final String UPLOAD_DIR_VIDEO = "/data/FindSuspect/backend/src/main/frontend/public/video/";
    private final HistoryRepository historyRepository;
    private ObjectMapper objectMapper = new ObjectMapper();
    private final Util util;

    private void saveVideo(String dir, MultipartFile file) {
        util.checkCuda();

        // 원본 파일 이름
        String fileName = file.getOriginalFilename();

        // 1. {영상이름}의 폴더 경로 설정
        Path folderPath = Paths.get(dir + "/" + fileName);
        File folder = new File(folderPath.toString());

        // 폴더가 존재하면 삭제
        if (folder.exists()) {
            util.deleteFolder(folder);  // 재귀적으로 폴더 삭제
        }

        // 폴더가 존재하지 않으면 생성
        if (!folder.exists()) {
            boolean isCreated = folder.mkdirs();
            if (!isCreated) {
                throw new BadRequestException("fail to make folder : " + folderPath);
            }
        }

        // 2. {영상이름} 폴더 안에 {영상이름} 파일 경로 설정
        Path targetPath = Paths.get(folderPath.toString() + "/" + fileName);

        // 해당 path 에 파일의 스트림 데이터를 저장
        try (OutputStream os = Files.newOutputStream(targetPath)) {
            os.write(file.getBytes());
        } catch (IOException e) {
            throw new BadRequestException("fail to save video");
        }
    }

    public void uploadVideo(MultipartFile videoFile){
        saveVideo(UPLOAD_DIR_VIDEO, videoFile);
        videoPython(videoFile.getOriginalFilename());
    }

    public void deleteVideo(String name) {
        Path path1 = (Paths.get(UPLOAD_DIR_VIDEO+name));
        Path path2 = (Paths.get("/data/FindSuspect/backend/algorithm/VTFPAR++/features/",name+".json"));
        //System.out.println(path2.toString());
        //historyRepository.deleteByVideo_name(name);

        try {
            //path1 폴더와 그 안의 파일/폴더 삭제
            File folder = path1.toFile();
            if (folder.exists() && folder.isDirectory()) {
                util.deleteFolder(folder);
            } else {
                throw new BadRequestException("not exist folder: " + path1.toString());
            }

            // path2에 해당하는 파일 삭제
            if (Files.exists(path2)) {
                Files.delete(path2);
            } else {
                throw new BadRequestException("not exist file: " + path2.toString());
            }
        } catch (Exception e) {
            //System.out.println(e.getMessage());
            throw new BadRequestException("fail to delete video");
        }
    }

    private void videoPython(String fileName) {
        try {
            // Python 스크립트 실행 명령어
            if (!util.checkCuda()) throw new BadRequestException("cuda not usable");
            String command = "python algorithm/video_upload.py " + fileName; // Windows 사용 시 "python script.py"로 변경
            int exitCode = util.newProcess(command);

            if (exitCode != 0) throw new BadRequestException("video feature error");
        } catch (Exception e) {
            //throw new BadRequestException("영상 저장 실패");
            e.printStackTrace();
        }
    }

    public List<String> getPath(){
        List<String> videos = new ArrayList<>();
        String folderPath = "/data/FindSuspect/backend/src/main/frontend/public/video";

        // 경로의 폴더를 File 객체로 생성
        File directory = new File(folderPath);

        // directory가 디렉토리인지 확인
        if (directory.exists() && directory.isDirectory()) {
            // directory 안에 있는 모든 파일과 폴더 목록 가져오기
            File[] files = directory.listFiles();

            if (files != null) {
                for (File file : files) {
                    videos.add(file.getName());
                }
            }
        }
        return videos;
    }

}
