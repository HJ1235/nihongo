package com.nihongo.backend.domain.user;

import com.nihongo.backend.domain.user.type.UserRole;
import com.nihongo.backend.domain.user.type.UserStatus;
import com.nihongo.backend.domain.user.type.LearningMode;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20, columnDefinition = "varchar(20) default 'USER'")
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20, columnDefinition = "varchar(20) default 'ACTIVE'")
    private UserStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30, columnDefinition = "varchar(30) default 'GENERAL'")
    private LearningMode learningMode;

    @Column(length = 255)
    private String suspendReason;

    private LocalDateTime suspendUntil;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();

        if (this.role == null) {
            this.role = UserRole.USER;
        }

        if (this.status == null) {
            this.status = UserStatus.ACTIVE;
        }

        if (this.learningMode == null) {
            this.learningMode = LearningMode.GENERAL;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void suspend(String reason, LocalDateTime suspendUntil) {
        this.status = UserStatus.SUSPENDED;
        this.suspendReason = reason;
        this.suspendUntil = suspendUntil;
    }

    public void activate() {
        this.status = UserStatus.ACTIVE;
        this.suspendReason = null;
        this.suspendUntil = null;
    }

    public boolean isSuspended() {
        return this.status == UserStatus.SUSPENDED;
    }

    public boolean isAdmin() {
        return this.role == UserRole.ADMIN;
    }

    public void updateLearningMode(LearningMode learningMode) {
        this.learningMode = learningMode == null ? LearningMode.GENERAL : learningMode;
    }
}
