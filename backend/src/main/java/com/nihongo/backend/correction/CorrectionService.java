package com.nihongo.backend.correction;

import com.nihongo.backend.correction.dto.CorrectionCreateRequest;
import com.nihongo.backend.correction.dto.CorrectionResponse;
import com.nihongo.backend.correction.dto.CorrectionStatsResponse;
import com.nihongo.backend.correction.generator.CorrectionGenerator;
import com.nihongo.backend.correction.generator.CorrectionResult;
import com.nihongo.backend.domain.correction.Correction;
import com.nihongo.backend.domain.correction.CorrectionMode;
import com.nihongo.backend.domain.correction.CorrectionRepository;
import com.nihongo.backend.domain.user.User;
import com.nihongo.backend.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CorrectionService {

    private final CorrectionRepository correctionRepository;
    private final UserRepository userRepository;
    private final CorrectionGenerator correctionGenerator;

    @Transactional
    public CorrectionResponse createCorrection(Long userId, CorrectionCreateRequest request) {
        User user = findUser(userId);
        CorrectionMode mode = request.getMode() == null ? CorrectionMode.GENERAL : request.getMode();
        CorrectionResult result = correctionGenerator.generate(request.getOriginalText(), mode);

        Correction correction = Correction.builder()
                .user(user)
                .originalText(request.getOriginalText())
                .correctedText(result.correctedText())
                .explanation(result.explanation())
                .mode(mode)
                .build();

        return CorrectionResponse.from(correctionRepository.save(correction));
    }

    @Transactional(readOnly = true)
    public List<CorrectionResponse> getMyCorrections(Long userId) {
        return correctionRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(CorrectionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CorrectionResponse getCorrection(Long userId, Long correctionId) {
        Correction correction = correctionRepository.findById(correctionId)
                .orElseThrow(() -> new IllegalArgumentException("Correction not found."));

        if (!correction.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Correction is not accessible.");
        }

        return CorrectionResponse.from(correction);
    }

    @Transactional(readOnly = true)
    public CorrectionStatsResponse getMyCorrectionStats(Long userId) {
        long totalCount = correctionRepository.countByUserId(userId);
        long generalCount = correctionRepository.countByUserIdAndMode(userId, CorrectionMode.GENERAL);
        long jobInterviewCount = correctionRepository.countByUserIdAndMode(userId, CorrectionMode.JOB_INTERVIEW);
        long workingHolidayCount = correctionRepository.countByUserIdAndMode(userId, CorrectionMode.WORKING_HOLIDAY);
        long dailyLifeCount = correctionRepository.countByUserIdAndMode(userId, CorrectionMode.DAILY_LIFE);
        CorrectionMode mostUsedMode = totalCount == 0
                ? null
                : findMostUsedMode(Map.of(
                        CorrectionMode.GENERAL, generalCount,
                        CorrectionMode.JOB_INTERVIEW, jobInterviewCount,
                        CorrectionMode.WORKING_HOLIDAY, workingHolidayCount,
                        CorrectionMode.DAILY_LIFE, dailyLifeCount
                ));

        return new CorrectionStatsResponse(
                totalCount,
                generalCount,
                jobInterviewCount,
                workingHolidayCount,
                dailyLifeCount,
                correctionRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                        .map(Correction::getCreatedAt)
                        .orElse(null),
                mostUsedMode
        );
    }

    private CorrectionMode findMostUsedMode(Map<CorrectionMode, Long> counts) {
        return counts.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }
}
