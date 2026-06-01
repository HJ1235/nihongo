package com.nihongo.backend.domain.lesson;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "kana_lessons")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class KanaLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String kana;

    @Column(nullable = false, length = 20)
    private String romaji;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private KanaType type;
}