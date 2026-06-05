package com.nihongo.backend.domain.correction;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CorrectionRepository extends JpaRepository<Correction, Long> {

    List<Correction> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndMode(Long userId, CorrectionMode mode);

    Optional<Correction> findFirstByUserIdOrderByCreatedAtDesc(Long userId);

    long countByCreatedAtGreaterThanEqual(LocalDateTime createdAt);
}
