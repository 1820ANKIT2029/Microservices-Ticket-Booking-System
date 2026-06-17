package com.ankit.event_service.dto;

public record ApiResponse<T>(
        T data,
        String message
) {
}