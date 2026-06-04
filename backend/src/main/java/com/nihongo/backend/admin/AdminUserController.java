package com.nihongo.backend.admin;

import com.nihongo.backend.admin.dto.AdminUserResponse;
import com.nihongo.backend.admin.dto.UserSuspendRequest;
import com.nihongo.backend.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ApiResponse<List<AdminUserResponse>> getUsers(Authentication authentication) {
        Long adminUserId = (Long) authentication.getPrincipal();
        return ApiResponse.success(adminUserService.getUsers(adminUserId));
    }

    @GetMapping("/{id}")
    public ApiResponse<AdminUserResponse> getUser(Authentication authentication, @PathVariable Long id) {
        Long adminUserId = (Long) authentication.getPrincipal();
        return ApiResponse.success(adminUserService.getUser(adminUserId, id));
    }

    @PatchMapping("/{id}/suspend")
    public ApiResponse<AdminUserResponse> suspendUser(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UserSuspendRequest request
    ) {
        Long adminUserId = (Long) authentication.getPrincipal();
        return ApiResponse.success(adminUserService.suspendUser(adminUserId, id, request));
    }

    @PatchMapping("/{id}/activate")
    public ApiResponse<AdminUserResponse> activateUser(Authentication authentication, @PathVariable Long id) {
        Long adminUserId = (Long) authentication.getPrincipal();
        return ApiResponse.success(adminUserService.activateUser(adminUserId, id));
    }
}
