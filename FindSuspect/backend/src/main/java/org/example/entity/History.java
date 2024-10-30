package org.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.example.dto.HistoryDTO;
import org.example.dto.ResultDTO;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Getter
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String imageName;
    String imageCrop;
    String imageRect;
    @CreatedDate
    LocalDateTime createdAt;

    String videoImage;
    String videoCrop;
    String videoRect;

    String videoName;
    double similarity;
    @ElementCollection
    List<Double> original_top5;
    @ElementCollection
    List<Double> file_top5;
    @ElementCollection
    List<String> attr_words;
    String time;

    public History(String imageName, String video_image, ResultDTO result) {
        this.imageName = "db/"+imageName;
        this.imageCrop = "db/"+imageName + "_cropped.jpg";
        this.imageRect = "db/"+imageName + "_rectangle.jpg";

        int index = video_image.indexOf("_cropped.jpg");
        this.videoImage = "db/"+video_image.substring(0,index) + ".jpg";
        this.videoCrop = "db/"+video_image;
        this.videoRect = "db/"+video_image.substring(0,index) + "_rectangle.jpg";

        this.videoName = result.getVideoName();
        this.similarity = result.getSimilarity();
        this.original_top5 = result.getOriginalTop5();
        this.file_top5=result.getFileTop5();
        this.attr_words = result.getAttrWords();
        this.time = result.getTime();
    }

    public History() {

    }

    public HistoryDTO toDTO(){
        return new HistoryDTO(id, imageName, imageCrop,imageRect,
                 /*videoImage,*/ videoCrop, videoRect, videoName, similarity,
                 original_top5, file_top5, attr_words, time);
    }
}
