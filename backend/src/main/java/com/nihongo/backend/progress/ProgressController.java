package com.nihongo.backend.progress;

import com.nihongo.backend.global.response.ApiResponse;
import com.nihongo.backend.progress.dto.ProgressCompleteRequest;
import com.nihongo.backend.progress.dto.ProgressResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/complete")
    public ApiResponse<ProgressResponse> complete(
            Authentication authentication,
            @Valid @RequestBody ProgressCompleteRequest request
    ) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(progressService.complete(userId, request));
    }

    @GetMapping
    public ApiResponse<List<ProgressResponse>> getProgress(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(progressService.getProgress(userId));
    }
}
