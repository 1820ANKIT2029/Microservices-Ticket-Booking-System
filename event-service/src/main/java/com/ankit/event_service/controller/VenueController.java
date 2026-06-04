package com.ankit.event_service.controller;

import com.ankit.event_service.dto.VenueDTO;
import com.ankit.event_service.service.IVenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {
    final private IVenueService venueService;

    @GetMapping("/{venueId}")
    public ResponseEntity<VenueDTO> getVenue(@PathVariable Long venueId) {
        VenueDTO venueDTO = this.venueService.getVenue(venueId);
        return ResponseEntity.ok().body(venueDTO);
    }

    @PostMapping("")
    public ResponseEntity<VenueDTO> createVenue(@Valid @RequestBody VenueDTO venueDTO) {
        VenueDTO venueDTO1 = this.venueService.createVenue(venueDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(venueDTO1);
    }
}
