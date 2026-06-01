package com.nihongo.backend.domain.wrongnote;

import com.nihongo.backend.domain.lesson.KanaLesson;
import com.nihongo.backend.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "wrong_notes",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class WrongNote {

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
    private int wrongCount;

    @Column(nullable = false)
    private LocalDateTime lastWrongAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            this.createdAt = now;
        }
        if (lastWrongAt == null) {
            this.lastWrongAt = now;
        }
    }

    public void increaseWrongCount() {
        this.wrongCount++;
        this.lastWrongAt = LocalDateTime.now();
    }
}
