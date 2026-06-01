package com.nihongo.backend.global.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private String message;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static ApiResponse<Void> fail(String message) {
        return new ApiResponse<>(false, null, message);
    }
}
