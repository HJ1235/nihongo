package com.nihongo.backend.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class UserSuspendRequest {

    @NotBlank(message = "reason은 필수입니다.")
    private String reason;

    private LocalDateTime suspendUntil;
}
