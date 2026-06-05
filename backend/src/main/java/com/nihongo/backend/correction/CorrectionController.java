package com.nihongo.backend.correction;

import com.nihongo.backend.correction.dto.CorrectionCreateRequest;
import com.nihongo.backend.correction.dto.CorrectionResponse;
import com.nihongo.backend.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/corrections")
public class CorrectionController {

    private final CorrectionService correctionService;

    @PostMapping
    public ApiResponse<CorrectionResponse> createCorrection(
            Authentication authentication,
            @Valid @RequestBody CorrectionCreateRequest request
    ) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(correctionService.createCorrection(userId, request));
    }

    @GetMapping("/my")
    public ApiResponse<List<CorrectionResponse>> getMyCorrections(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(correctionService.getMyCorrections(userId));
    }

    @GetMapping("/{id}")
    public ApiResponse<CorrectionResponse> getCorrection(
            Authentication authentication,
            @PathVariable Long id
    ) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(correctionService.getCorrection(userId, id));
    }
}
