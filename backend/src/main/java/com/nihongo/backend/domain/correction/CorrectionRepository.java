package com.nihongo.backend.domain.correction;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CorrectionRepository extends JpaRepository<Correction, Long> {

    List<Correction> findAllByUserIdOrderByCreatedAtDesc(Long userId);
}
