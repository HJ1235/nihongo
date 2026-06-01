package com.nihongo.backend.user;

import com.nihongo.backend.domain.user.User;
import com.nihongo.backend.domain.user.UserRepository;
import com.nihongo.backend.global.security.JwtTokenProvider;
import com.nihongo.backend.user.dto.UserLoginRequest;
import com.nihongo.backend.user.dto.UserLoginResponse;
import com.nihongo.backend.user.dto.UserMeResponse;
import com.nihongo.backend.user.dto.UserSignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public Long signup(UserSignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .build();

        User savedUser = userRepository.save(user);

        return savedUser.getId();
    }

    @Transactional(readOnly = true)
    public UserLoginResponse login(UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtTokenProvider.createAccessToken(user.getId());

        return new UserLoginResponse(accessToken);
    }

    @Transactional(readOnly = true)
    public UserMeResponse getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        return new UserMeResponse(user.getId(), user.getEmail(), user.getNickname());
    }
}
