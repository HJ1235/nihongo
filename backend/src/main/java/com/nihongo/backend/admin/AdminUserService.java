package com.nihongo.backend.admin;

import com.nihongo.backend.admin.dto.AdminUserResponse;
import com.nihongo.backend.admin.dto.UserSuspendRequest;
import com.nihongo.backend.domain.user.User;
import com.nihongo.backend.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getUsers(Long adminUserId) {
        findAdmin(adminUserId);

        return userRepository.findAll()
                .stream()
                .map(AdminUserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminUserResponse getUser(Long adminUserId, Long targetUserId) {
        findAdmin(adminUserId);

        return AdminUserResponse.from(findUser(targetUserId));
    }

    @Transactional
    public AdminUserResponse suspendUser(Long adminUserId, Long targetUserId, UserSuspendRequest request) {
        findAdmin(adminUserId);
        if (adminUserId.equals(targetUserId)) {
            throw new IllegalArgumentException("자기 자신은 정지할 수 없습니다.");
        }

        User targetUser = findUser(targetUserId);
        targetUser.suspend(request.getReason(), request.getSuspendUntil());

        return AdminUserResponse.from(targetUser);
    }

    @Transactional
    public AdminUserResponse activateUser(Long adminUserId, Long targetUserId) {
        findAdmin(adminUserId);

        User targetUser = findUser(targetUserId);
        targetUser.activate();

        return AdminUserResponse.from(targetUser);
    }

    private User findAdmin(Long userId) {
        User user = findUser(userId);
        if (!user.isAdmin()) {
            throw new IllegalArgumentException("관리자 권한이 필요합니다.");
        }

        return user;
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }
}
