package org.example.dto;

import java.util.List;
import lombok.Getter;

@Getter
public class PageHistory {
    List<HistoryDTO> histories;
    long totalElements;
    int totalPages;

    public PageHistory(List<HistoryDTO> histories, long totalElements, int totalPages) {
        this.histories = histories;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }
}
