package com.nihongo.backend.notice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NoticeUpdateRequest {

    @NotBlank(message = "title은 필수입니다.")
    private String title;

    @NotBlank(message = "content는 필수입니다.")
    private String content;

    private boolean pinned;
}
