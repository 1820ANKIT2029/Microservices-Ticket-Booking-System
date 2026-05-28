package com.ankit.event_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformerDTO {

    private Long id;

    @NotBlank(message = "Performer profile name is required")
    @Size(max = 255, message = "Performer name must not exceed 255 characters")
    private String name;

    private String bio;

    @Size(max = 100, message = "Genre specification must not exceed 100 characters")
    private String genre;

    @Size(max = 100, message = "Nationality designation must not exceed 100 characters")
    private String nationality;

    @Size(max = 2048, message = "Website reference URL must not exceed 2048 characters")
    @Pattern(regexp = "^(https?://.*)?$", message = "Website URL must be valid HTTP/HTTPS scheme")
    private String websiteUrl;

    @Size(max = 2048, message = "Profile image destination URL must not exceed 2048 characters")
    @Pattern(regexp = "^(https?://.*)?$", message = "Image URL must be valid HTTP/HTTPS scheme")
    private String imageUrl;

    @Size(max = 2048, message = "Social channel link 1 must not exceed 2048 characters")
    private String socialLink1;

    @Size(max = 2048, message = "Social channel link 2 must not exceed 2048 characters")
    private String socialLink2;

    private Boolean isActive;

    private ZonedDateTime createdAt;
    private ZonedDateTime modifiedAt;
}