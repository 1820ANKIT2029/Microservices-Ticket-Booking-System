package com.ankit.event_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueDTO {

    private Long id;

    @NotBlank(message = "Physical venue location naming identifier is required")
    @Size(max = 255, message = "Venue name length limit ceiling is 255 characters")
    private String name;

    private String description;

    @Size(max = 255, message = "Address line 1 text cannot exceed 255 characters")
    private String addressLine1;

    @Size(max = 100, message = "City specification must not exceed 100 characters")
    private String city;

    @Size(max = 100, message = "State/Region specification must not exceed 100 characters")
    private String state;

    @Size(max = 100, message = "Country code name text field must not exceed 100 characters")
    private String country;

    @Size(max = 20, message = "Postal tracking validation field code length must not exceed 20 characters")
    private String postalCode;

    @DecimalMin(value = "-180.000000", message = "Longitude values cannot drift lower than -180.0 degrees")
    @DecimalMax(value = "180.000000", message = "Longitude values cannot drift past 180.0 degrees")
    @Digits(integer = 3, fraction = 6, message = "Longitude coordinate format structure mismatch")
    private BigDecimal longitude;

    @DecimalMin(value = "-90.000000", message = "Latitude coordinate points cannot fall below -90.0 degrees")
    @DecimalMax(value = "90.000000", message = "Latitude coordinate points cannot climb above 90.0 degrees")
    @Digits(integer = 2, fraction = 6, message = "Latitude coordinate format structure mismatch")
    private BigDecimal latitude;

    @Size(max = 100, message = "IANA zone location string cannot span past 100 characters")
    private String timezone;

    @Positive(message = "Structural mass occupancy load evaluation values must be positive integers")
    private Integer totalCapacity;

    @Size(max = 2048, message = "Web destination URL field configuration text cap is 2048 characters")
    @Pattern(regexp = "^(https?://.*)?$", message = "Web property link requires full destination target verification formatting rules")
    private String websiteUrl;

    private Double mapWidth;
    private Double mapHeight;

    private String amenities;
    private Boolean isActive;

    private ZonedDateTime createdAt;

    @Valid
    private List<VenueSectionDTO> sections;
}