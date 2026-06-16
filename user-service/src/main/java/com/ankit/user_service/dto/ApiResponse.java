package com.ankit.user_service.dto;

public record ApiResponse<T>(
        T data,
        String message
) {
}