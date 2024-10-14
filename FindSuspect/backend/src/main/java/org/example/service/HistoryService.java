package org.example.service;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.example.dto.HistoryDTO;
import org.example.dto.PageHistory;
import org.example.dto.ResultDTO;
import org.example.entity.History;
import org.example.exception.BadRequestException;
import org.example.repository.HistoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class HistoryService {
    private final HistoryRepository historyRepository;
    private final String DB_DIR = "/data/FindSuspect/backend/src/main/frontend/public/db";

    public PageHistory getHistory(Pageable pageable) {
        Page<History> histories = historyRepository.findAll(pageable);
        List<HistoryDTO> his = histories.getContent().stream().map(History::toDTO).toList();
        return new PageHistory(his,histories.getTotalElements(), histories.getTotalPages());
    }

    public void deleteHistory(int historyId) {
        History history = historyRepository.findById(historyId).orElseThrow(()-> new BadRequestException("history not found"));
        historyRepository.delete(history);
        String image = history.getImageName().substring(3);
        //System.out.println("image: " + image);
        String video = history.getVideoCrop().substring(3);
        //System.out.println("video: " + video);
        int index = video.indexOf("_cropped.jpg");
        video = video.substring(0,index);
        //System.out.println("video: " + video);

        List<History> list = historyRepository.findDuplicateName(image);
        if(list.isEmpty()){
            deleteAllImagesWithKeyword(DB_DIR, image);
        }
        list = historyRepository.findDuplicateName(video);
        if(list.isEmpty()){
            //이미지 삭제
            deleteAllImagesWithKeyword(DB_DIR, video);
        }

    }

    private void deleteAllImagesWithKeyword(String srcDir, String keyword) {
        try {
            Path sourceDirPath = Paths.get(srcDir);

            // srcDir 내의 모든 파일을 순회
            Files.walk(sourceDirPath)
                    .filter(Files::isRegularFile) // 파일만 선택
                    .filter(sourcePath -> sourcePath.toString().contains(keyword))
                    .forEach(sourcePath -> {
                        try {
                            // 파일 삭제
                            Files.delete(sourcePath);
                        } catch (IOException e) {
                            e.printStackTrace(); // 파일 삭제 실패 시 에러 처리
                        }
                    });
        } catch (IOException e) {
            throw new BadRequestException("history file delete fail");
        }
    }
}
