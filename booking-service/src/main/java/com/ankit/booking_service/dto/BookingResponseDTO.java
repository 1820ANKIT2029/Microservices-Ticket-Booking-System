package com.ankit.booking_service.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BookingResponseDTO extends BookingDTO {
    private String gatewayPublicApiKey;
    private String gatewayOrderId;
}
