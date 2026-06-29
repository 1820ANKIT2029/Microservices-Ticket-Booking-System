package com.ankit.inventory_service.dto;

public record ApiResponse<T>(
        T data,
        String message
) {
}