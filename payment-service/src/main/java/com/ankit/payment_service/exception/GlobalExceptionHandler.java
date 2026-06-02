package com.ankit.payment_service.exception;

import com.razorpay.RazorpayException;
import jakarta.servlet.http.HttpServletRequest;
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
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // 1. Handle Domain Resource Missing Errors (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseWrapper<String>> handleResourceNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {

        ErrorResponseWrapper<String> error = ErrorResponseWrapper.<String>builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 2. Intercept and format validation constraint failures (400)
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
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

        return new ResponseEntity<>(errorWrapper, status);
    }

    @ExceptionHandler(RazorpayException.class)
    public ResponseEntity<ErrorResponseWrapper<String>> handleRazorpayException(
            RazorpayException ex,
            HttpServletRequest request
    ) {

        // Log the root cause internally for monitoring and debugging logs
        System.err.println("Razorpay API Exception: " + ex.getMessage());

        // Default fallback configurations
        HttpStatus status = HttpStatus.BAD_GATEWAY; // 502 Bad Gateway for external integration drops
        String errorLabel = "PAYMENT_GATEWAY_ERROR";
        String displayMessage = "An unexpected error occurred while communicating with Razorpay.";

        if (ex.getMessage() != null) {
            displayMessage = ex.getMessage();
        }

        // Parse Razorpay specific error indicators to dynamically shift HTTP statuses
        String lowercaseMsg = displayMessage.toLowerCase();
        if (lowercaseMsg.contains("bad request") || lowercaseMsg.contains("invalid")) {
            status = HttpStatus.BAD_REQUEST; // 400
            errorLabel = "INVALID_PAYMENT_PAYLOAD";
        } else if (lowercaseMsg.contains("authentication") || lowercaseMsg.contains("api key")) {
            status = HttpStatus.INTERNAL_SERVER_ERROR; // 500
            errorLabel = "GATEWAY_CONFIGURATION_ERROR";
        }

        // Build the generic payload wrapper binding T to String
        ErrorResponseWrapper<String> response = ErrorResponseWrapper.<String>builder()
                .status(status.value())
                .error(errorLabel)
                .message(displayMessage)
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(response, status);
    }

    // 3. Fallback Catch-All for true system bugs (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseWrapper<String>> handleGeneralException(
            Exception ex, HttpServletRequest request
    ) {
        // logger.error("Internal server error occurred: ", ex);
        // Check if the underlying failure was caused by Razorpay
        if (ex.getCause() instanceof RazorpayException) {
            return handleRazorpayException((RazorpayException) ex.getCause(), request);
        }

        ErrorResponseWrapper<String> error = ErrorResponseWrapper.<String>builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message("An unexpected error occurred on our side. Please try again later." + ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(ZonedDateTime.now())
                .build();

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}