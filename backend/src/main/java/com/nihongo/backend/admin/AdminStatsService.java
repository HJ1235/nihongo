package com.nihongo.backend.admin;

import com.nihongo.backend.admin.dto.AdminStatsResponse;
import com.nihongo.backend.domain.correction.CorrectionRepository;
import com.nihongo.backend.domain.notice.NoticeRepository;
import com.nihongo.backend.domain.user.User;
import com.nihongo.backend.domain.user.UserRepository;
import com.nihongo.backend.domain.user.type.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;
    private final NoticeRepository noticeRepository;
    private final CorrectionRepository correctionRepository;

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats(Long adminUserId) {
        findAdmin(adminUserId);

        return new AdminStatsResponse(
                userRepository.count(),
                userRepository.countByStatus(UserStatus.ACTIVE),
                userRepository.countByStatus(UserStatus.SUSPENDED),
                noticeRepository.count(),
                noticeRepository.countByPinned(true),
                correctionRepository.count(),
                correctionRepository.countByCreatedAtGreaterThanEqual(LocalDate.now().atStartOfDay())
        );
    }

    private User findAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (!user.isAdmin()) {
            throw new IllegalArgumentException("관리자 권한이 필요합니다.");
        }

        return user;
    }
}
