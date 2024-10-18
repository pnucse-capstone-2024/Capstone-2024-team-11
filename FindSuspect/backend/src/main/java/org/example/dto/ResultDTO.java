package org.example.dto;

import java.util.List;

public class ResultDTO {

    public String video_name;
    public double similarity;
    public List<Double> original_top5;
    public List<Double> file_top5;
    public List<String> attr_words;
    public String time;

    public void setTime(String time) {
        this.time = time;
    }

    public double getSimilarity() {
        return this.similarity;
    }
    public String getVideoName(){
        return this.video_name;
    }
    public List<Double> getOriginalTop5(){
        return this.original_top5;
    }
    public List<Double> getFileTop5(){
        return this.file_top5;
    }
    public List<String> getAttrWords(){
        return this.attr_words;
    }
    public String getTime(){
        return this.time;
    }
}
