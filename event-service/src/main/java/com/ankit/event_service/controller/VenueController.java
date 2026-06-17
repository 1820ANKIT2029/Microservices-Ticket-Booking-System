package com.ankit.event_service.controller;

import com.ankit.event_service.dto.ApiResponse;
import com.ankit.event_service.dto.SeatDTO;
import com.ankit.event_service.dto.VenueDTO;
import com.ankit.event_service.dto.VenueSectionDTO;
import com.ankit.event_service.service.IVenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {
    final private IVenueService venueService;

    @GetMapping("/{venueId}")
    public ResponseEntity<ApiResponse<VenueDTO>> getVenue(@PathVariable Long venueId) {
        VenueDTO venueDTO = this.venueService.getVenue(venueId);
        return ResponseEntity.ok(new ApiResponse<>(venueDTO, "venue details"));
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<VenueDTO>>> getAllVenues() {
        List<VenueDTO> venueDTOS = this.venueService.getAllVenues();
        return ResponseEntity.ok(new ApiResponse<>(venueDTOS, "venues details"));
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<VenueDTO>> createVenue(@Valid @RequestBody VenueDTO venueDTO) {
        VenueDTO venueDTO1 = this.venueService.createVenue(venueDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(venueDTO1, "venue created"));
    }

    @PutMapping("/{venueId}")
    public ResponseEntity<ApiResponse<VenueDTO>> modifyVenue(
            @PathVariable Long venueId,
            @Valid @RequestBody VenueDTO venueDTO
    ){
        VenueDTO savedVenueDTO = this.venueService.updateVenue(venueId, venueDTO);
        return ResponseEntity.ok(
                new ApiResponse<>(savedVenueDTO, "venue updated")
        );
    }

    @DeleteMapping("/{venueId}")
    public ResponseEntity<ApiResponse<VenueDTO>> deleteVenue(@PathVariable Long venueId) {
        this.venueService.deleteVenue(venueId);
        return ResponseEntity.ok(
                new ApiResponse<>(null, "venue deleted")
        );
    }
}
