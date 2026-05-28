package com.ankit.event_service.mapper;

import com.ankit.event_service.dto.PerformerDTO;
import com.ankit.event_service.entity.Performer;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class PerformerMapper {

    public PerformerDTO toDto(Performer entity) {
        if (entity == null) return null;

        return PerformerDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .bio(entity.getBio())
                .genre(entity.getGenre())
                .nationality(entity.getNationality())
                .websiteUrl(entity.getWebsiteUrl())
                .imageUrl(entity.getImageUrl())
                .socialLink1(entity.getSocialLink1())
                .socialLink2(entity.getSocialLink2())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .modifiedAt(entity.getModifiedAt())
                .build();
    }

    public Performer toEntity(PerformerDTO dto) {
        if (dto == null) return null;

        return Performer.builder()
                .id(dto.getId())
                .name(dto.getName())
                .bio(dto.getBio())
                .genre(dto.getGenre())
                .nationality(dto.getNationality())
                .websiteUrl(dto.getWebsiteUrl())
                .imageUrl(dto.getImageUrl())
                .socialLink1(dto.getSocialLink1())
                .socialLink2(dto.getSocialLink2())
                .isActive(dto.getIsActive())
                .createdAt(dto.getCreatedAt())
                .modifiedAt(dto.getModifiedAt())
                .events(new ArrayList<>())
                .build();
    }
}