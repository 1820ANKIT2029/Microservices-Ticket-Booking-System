package com.ankit.payment_service.dto;

public record ApiResponse<T>(
        T data,
        String message
) {
}