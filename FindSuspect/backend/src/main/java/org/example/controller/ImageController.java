package org.example.controller;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import lombok.RequiredArgsConstructor;
import org.example.dto.ResultDTO;
import org.example.service.ImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @PostMapping("/api/upload/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile imageFile) {
        imageService.uploadImage(imageFile);

        return ResponseEntity.ok("정상 업로드");
    }

    @GetMapping("/api/get/image")
    public ResponseEntity<String> getImagePath(){
        String path = imageService.getPath();
        return new ResponseEntity<>(path, HttpStatus.OK);
    }

    @GetMapping("/api/result")
    public ResponseEntity<List<Entry<String, ResultDTO>>> getResult(){
        List<Map.Entry<String, ResultDTO>> data = imageService.getResult();
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/api/result/videoName")
    public ResponseEntity<List<Map.Entry<String, ResultDTO>>> getResultByVideoName(){
        List<Map.Entry<String, ResultDTO>> data = imageService.getResultByVideoName();
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
