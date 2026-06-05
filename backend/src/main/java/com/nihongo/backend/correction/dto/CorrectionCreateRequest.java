package com.nihongo.backend.correction.dto;

import com.nihongo.backend.domain.correction.CorrectionMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CorrectionCreateRequest {

    @NotBlank(message = "교정할 문장을 입력해 주세요.")
    @Size(max = 1000, message = "문장은 1000자 이하로 입력해 주세요.")
    private String originalText;

    private CorrectionMode mode = CorrectionMode.GENERAL;
}
