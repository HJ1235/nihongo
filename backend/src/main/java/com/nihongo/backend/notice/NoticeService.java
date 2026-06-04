package com.nihongo.backend.notice;

import com.nihongo.backend.domain.notice.Notice;
import com.nihongo.backend.domain.notice.NoticeRepository;
import com.nihongo.backend.domain.user.User;
import com.nihongo.backend.domain.user.UserRepository;
import com.nihongo.backend.notice.dto.NoticeCreateRequest;
import com.nihongo.backend.notice.dto.NoticeResponse;
import com.nihongo.backend.notice.dto.NoticeUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;

    @Transactional
    public NoticeResponse createNotice(Long userId, NoticeCreateRequest request) {
        User user = findAdmin(userId);
        Notice notice = Notice.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .pinned(request.isPinned())
                .createdBy(user)
                .build();

        return NoticeResponse.from(noticeRepository.save(notice));
    }

    @Transactional
    public NoticeResponse updateNotice(Long userId, Long noticeId, NoticeUpdateRequest request) {
        findAdmin(userId);
        Notice notice = findNotice(noticeId);
        notice.update(request.getTitle(), request.getContent(), request.isPinned());

        return NoticeResponse.from(notice);
    }

    @Transactional
    public void deleteNotice(Long userId, Long noticeId) {
        findAdmin(userId);
        Notice notice = findNotice(noticeId);
        noticeRepository.delete(notice);
    }

    @Transactional(readOnly = true)
    public NoticeResponse getNotice(Long noticeId) {
        return NoticeResponse.from(findNotice(noticeId));
    }

    @Transactional(readOnly = true)
    public List<NoticeResponse> getNotices() {
        return noticeRepository.findAllByOrderByPinnedDescCreatedAtDesc()
                .stream()
                .map(NoticeResponse::from)
                .toList();
    }

    private Notice findNotice(Long noticeId) {
        return noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    private User findAdmin(Long userId) {
        User user = findUser(userId);
        if (!user.isAdmin()) {
            throw new IllegalArgumentException("관리자 권한이 필요합니다.");
        }

        return user;
    }
}
