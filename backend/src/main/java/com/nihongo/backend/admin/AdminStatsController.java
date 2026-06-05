package com.nihongo.backend.admin;

import com.nihongo.backend.admin.dto.AdminStatsResponse;
import com.nihongo.backend.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping
    public ApiResponse<AdminStatsResponse> getStats(Authentication authentication) {
        Long adminUserId = (Long) authentication.getPrincipal();
        return ApiResponse.success(adminStatsService.getStats(adminUserId));
    }
}
