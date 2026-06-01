package com.nihongo.backend.domain.word;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "words")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private WordLevel level;

    @Column(nullable = false, length = 50)
    private String japanese;

    @Column(nullable = false, length = 50)
    private String reading;

    @Column(nullable = false, length = 100)
    private String meaning;

    @Column(nullable = false, length = 255)
    private String exampleSentence;

    @Column(nullable = false, length = 255)
    private String exampleMeaning;
}
