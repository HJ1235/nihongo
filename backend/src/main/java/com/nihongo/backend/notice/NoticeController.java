package com.nihongo.backend.notice;

import com.nihongo.backend.global.response.ApiResponse;
import com.nihongo.backend.notice.dto.NoticeCreateRequest;
import com.nihongo.backend.notice.dto.NoticeResponse;
import com.nihongo.backend.notice.dto.NoticeUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping("/api/notices")
    public ApiResponse<List<NoticeResponse>> getNotices() {
        return ApiResponse.success(noticeService.getNotices());
    }

    @GetMapping("/api/notices/{id}")
    public ApiResponse<NoticeResponse> getNotice(@PathVariable Long id) {
        return ApiResponse.success(noticeService.getNotice(id));
    }

    @PostMapping("/api/admin/notices")
    public ApiResponse<NoticeResponse> createNotice(
            Authentication authentication,
            @Valid @RequestBody NoticeCreateRequest request
    ) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(noticeService.createNotice(userId, request));
    }

    @PutMapping("/api/admin/notices/{id}")
    public ApiResponse<NoticeResponse> updateNotice(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody NoticeUpdateRequest request
    ) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(noticeService.updateNotice(userId, id, request));
    }

    @DeleteMapping("/api/admin/notices/{id}")
    public ApiResponse<Void> deleteNotice(Authentication authentication, @PathVariable Long id) {
        Long userId = (Long) authentication.getPrincipal();
        noticeService.deleteNotice(userId, id);
        return ApiResponse.success(null);
    }
}
