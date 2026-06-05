package com.nihongo.backend.correction;

import com.nihongo.backend.correction.dto.CorrectionCreateRequest;
import com.nihongo.backend.correction.dto.CorrectionResponse;
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
                .orElseThrow(() -> new IllegalArgumentException("교정 기록을 찾을 수 없습니다."));

        if (!correction.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("교정 기록을 조회할 수 없습니다.");
        }

        return CorrectionResponse.from(correction);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }
}
