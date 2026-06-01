package com.nihongo.backend.domain.word;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {

    List<Word> findByLevelOrderByIdAsc(WordLevel level);
}
