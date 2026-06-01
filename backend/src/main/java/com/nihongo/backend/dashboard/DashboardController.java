package com.nihongo.backend.dashboard;

import com.nihongo.backend.dashboard.dto.DashboardResponse;
import com.nihongo.backend.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<DashboardResponse> getDashboard(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(dashboardService.getDashboard(userId));
    }
}
