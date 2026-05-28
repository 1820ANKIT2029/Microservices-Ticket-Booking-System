package com.ankit.event_service.mapper;

import com.ankit.event_service.dto.SeatDTO;
import com.ankit.event_service.entity.Seat;
import com.ankit.event_service.entity.Venue;
import com.ankit.event_service.entity.VenueSection;
import org.springframework.stereotype.Component;

@Component
public class SeatMapper {

    public SeatDTO toDto(Seat entity) {
        if (entity == null) return null;

        return SeatDTO.builder()
                .id(entity.getId())
                .venueSectionId(entity.getVenueSection() != null ? entity.getVenueSection().getId() : null)
                .venueId(entity.getVenue() != null ? entity.getVenue().getId() : null)
                .seatNumber(entity.getSeatNumber())
                .rowLabel(entity.getRowLabel())
                .seatType(entity.getSeatType())
                .isAccessible(entity.getIsAccessible())
                .isActive(entity.getIsActive())
                .build();
    }

    public Seat toEntity(SeatDTO dto) {
        if (dto == null) return null;

        Seat seat = Seat.builder()
                .id(dto.getId())
                .seatNumber(dto.getSeatNumber())
                .rowLabel(dto.getRowLabel())
                .seatType(dto.getSeatType())
                .isAccessible(dto.getIsAccessible())
                .isActive(dto.getIsActive())
                .build();

        if (dto.getVenueSectionId() != null) {
            VenueSection section = new VenueSection();
            section.setId(dto.getVenueSectionId());
            seat.setVenueSection(section);
        }
        if (dto.getVenueId() != null) {
            Venue venue = new Venue();
            venue.setId(dto.getVenueId());
            seat.setVenue(venue);
        }

        return seat;
    }
}