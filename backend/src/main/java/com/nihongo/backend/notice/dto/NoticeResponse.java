package com.nihongo.backend.notice.dto;

import com.nihongo.backend.domain.notice.Notice;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class NoticeResponse {

    private Long id;
    private String title;
    private String content;
    private boolean pinned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdById;
    private String createdByNickname;

    public static NoticeResponse from(Notice notice) {
        return new NoticeResponse(
                notice.getId(),
                notice.getTitle(),
                notice.getContent(),
                notice.isPinned(),
                notice.getCreatedAt(),
                notice.getUpdatedAt(),
                notice.getCreatedBy().getId(),
                notice.getCreatedBy().getNickname()
        );
    }
}
