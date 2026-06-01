package com.nihongo.backend.user;

import com.nihongo.backend.global.response.ApiResponse;
import com.nihongo.backend.user.dto.UserLoginRequest;
import com.nihongo.backend.user.dto.UserLoginResponse;
import com.nihongo.backend.user.dto.UserMeResponse;
import com.nihongo.backend.user.dto.UserSignupRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Long> signup(@Valid @RequestBody UserSignupRequest request) {
        return ApiResponse.success(userService.signup(request));
    }

    @PostMapping("/login")
    public ApiResponse<UserLoginResponse> login(@Valid @RequestBody UserLoginRequest request) {
        return ApiResponse.success(userService.login(request));
    }

    @GetMapping("/me")
    public ApiResponse<UserMeResponse> getMyInfo(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(userService.getMyInfo(userId));
    }
}
