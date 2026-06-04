package com.nihongo.backend.admin.dto;

import com.nihongo.backend.domain.user.User;
import com.nihongo.backend.domain.user.type.UserRole;
import com.nihongo.backend.domain.user.type.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AdminUserResponse {

    private Long id;
    private String email;
    private String nickname;
    private UserRole role;
    private UserStatus status;
    private String suspendReason;
    private LocalDateTime suspendUntil;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getRole(),
                user.getStatus(),
                user.getSuspendReason(),
                user.getSuspendUntil(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
