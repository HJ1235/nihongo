package com.nihongo.backend.domain.progress;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_lesson_progress")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserLessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private KanaLesson lesson;

    @Column(nullable = false)
    private boolean completed;

    @Column(nullable = false)
    private int wrongCount;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        if (completedAt == null) {
            this.completedAt = LocalDateTime.now();
        }
    }
}
