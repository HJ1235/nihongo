package com.nihongo.backend.wrongnote;

import com.nihongo.backend.global.response.ApiResponse;
import com.nihongo.backend.wrongnote.dto.WrongNoteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wrong-notes")
public class WrongNoteController {

    private final WrongNoteService wrongNoteService;

    @GetMapping
    public ApiResponse<List<WrongNoteResponse>> getWrongNotes(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(wrongNoteService.getWrongNotes(userId));
    }

    @DeleteMapping("/{lessonId}")
    public ApiResponse<Void> deleteWrongNote(Authentication authentication, @PathVariable Long lessonId) {
        Long userId = (Long) authentication.getPrincipal();
        wrongNoteService.deleteWrongNote(userId, lessonId);
        return ApiResponse.success(null);
    }
}
