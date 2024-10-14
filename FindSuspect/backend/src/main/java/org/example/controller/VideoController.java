package org.example.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.example.service.VideoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class VideoController {
    private final VideoService videoService;

    @PostMapping("/api/upload/video")
    public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile videoFile) {
        videoService.uploadVideo(videoFile);
        return ResponseEntity.ok("정상 업로드");
    }

    @GetMapping("/api/get/video")
    public ResponseEntity<List<String>> getVideoPath(){
        List<String> videos = videoService.getPath();
        return new ResponseEntity<>(videos, HttpStatus.OK);
    }

    @DeleteMapping("/api/video")
    public ResponseEntity<String> deleteVideo(@RequestParam("video_name")String name){
        videoService.deleteVideo(name);
        return new ResponseEntity<>("",HttpStatus.OK);
    }

}
