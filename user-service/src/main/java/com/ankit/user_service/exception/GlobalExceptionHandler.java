package com.ankit.user_service.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // 1. Handle Domain Resource Missing Errors (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseWrapper<String>> handleResourceNotFound(
            ResourceNotFoundException ex, HttpServletRequest request
    ) {

        ErrorResponseWrapper<String> error = ErrorResponseWrapper.<String>builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        log.error("Resource not found: {}", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 2. Intercept and format validation constraint failures (400)
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers,
            HttpStatusCode status, WebRequest request
    ) {

        Map<String, String> validationErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            validationErrors.put(fieldName, errorMessage);
        });

        ErrorResponseWrapper<Map<String, String>> errorWrapper = ErrorResponseWrapper.<Map<String, String>>builder()
                .status(status.value())
                .error("Validation Failed")
                .message(validationErrors)
                .path(((ServletWebRequest) request).getRequest().getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        log.error("Validation failed: {}", validationErrors);
        return new ResponseEntity<>(errorWrapper, status);
    }

    @ExceptionHandler(InvalidCredentialException.class)
    public ResponseEntity<ErrorResponseWrapper<String>> handleInvalidCredential(
            InvalidCredentialException ex, HttpServletRequest request
    ) {
        ErrorResponseWrapper<String> error = ErrorResponseWrapper.<String>builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        log.error("Invalid credentials: {}", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    // 3. Fallback Catch-All for true system bugs (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseWrapper<String>> handleGeneralException(
            Exception ex, HttpServletRequest request
    ) {
        // logger.error("Internal server error occurred: ", ex);

        ErrorResponseWrapper<String> error = ErrorResponseWrapper.<String>builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message("An unexpected error occurred on our side. Please try again later." + ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        log.error("Internal server error: {}", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}