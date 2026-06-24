package com.ankit.booking_service.dto;

public record ApiResponse<T>(
        T data,
        String message
) {
}