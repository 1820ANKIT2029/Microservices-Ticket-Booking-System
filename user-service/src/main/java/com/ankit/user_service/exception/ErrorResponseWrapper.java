package com.ankit.user_service.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseWrapper<T> {
    private int status;
    private String error;
    private T message; // Can hold a single String or a Validation Error Map
    private String path;
    private ZonedDateTime timestamp;
}