package com.ankit.gateway_server.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.ZonedDateTime;

@Component
public class ErrorResponseWriter {

    private final ObjectMapper objectMapper;

    public ErrorResponseWriter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public Mono<Void> write(
            ServerWebExchange exchange,
            HttpStatus status,
            String message
    ) {

        return Mono.defer(() -> {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(status);
            response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

            ErrorResponseWrapper<String> error =
                    ErrorResponseWrapper.<String>builder()
                            .status(status.value())
                            .error(status.getReasonPhrase())
                            .message(message)
                            .path(exchange.getRequest().getPath().value())
                            .timestamp(ZonedDateTime.now())
                            .build();

            try {
                byte[] bytes = objectMapper.writeValueAsBytes(error);
                DataBuffer buffer = response.bufferFactory().wrap(bytes);
                return response.writeWith(Mono.just(buffer));
            } catch (JsonProcessingException ex) {
                return Mono.error(ex);
            }
        });
    }
}