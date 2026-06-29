package com.ankit.inventory_service.controller;

import com.ankit.inventory_service.dto.ApiResponse;
import com.ankit.inventory_service.dto.VenueSectionDTO;
import com.ankit.inventory_service.service.IVenueSectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues/{venueId}/venue-sections")
@RequiredArgsConstructor
public class VenueSectionController {
    private final IVenueSectionService venueSectionService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<VenueSectionDTO>> createVenueSection(
            @RequestBody VenueSectionDTO venueSectionDTO,
            @PathVariable Long venueId
    ) {
        VenueSectionDTO venueSectionDTO1 = this.venueSectionService.createVenueSection(
                venueSectionDTO, venueId
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(venueSectionDTO1, "venue section created")
        );
    }

    @GetMapping("{venueSectionId}")
    public ResponseEntity<ApiResponse<VenueSectionDTO>> getVenueSection(
            @PathVariable Long venueSectionId,
            @PathVariable Long venueId
    ) {
        VenueSectionDTO venueSectionDTO = this.venueSectionService.getVenueSection(
                venueSectionId, venueId
        );
        return ResponseEntity.ok(
                new ApiResponse<>(venueSectionDTO, "venue section detail")
        );
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<VenueSectionDTO>>> getVenueSections(
            @PathVariable Long venueId
    ) {
        List<VenueSectionDTO> venueSectionDTO = this.venueSectionService.getVenueSections(venueId);
        return ResponseEntity.ok(
                new ApiResponse<>(venueSectionDTO, "venue section detail")
        );
    }

    @PutMapping("{venueSectionId}")
    public ResponseEntity<ApiResponse<VenueSectionDTO>> modifyVenueSection(
            @PathVariable Long venueSectionId,
            @PathVariable Long venueId,
            @RequestBody VenueSectionDTO venueSectionDTO
    ) {
        VenueSectionDTO venueSectionDTO1 = this.venueSectionService.updateVenueSection(venueSectionDTO, venueSectionId, venueId);
        return ResponseEntity.ok(
                new ApiResponse<>(venueSectionDTO1, "venue section updated")
        );
    }

    @DeleteMapping("{venueSectionId}")
    public ResponseEntity<ApiResponse<VenueSectionDTO>> deleteVenueSection(
            @PathVariable Long venueSectionId,
            @PathVariable Long venueId
    ) {
        this.venueSectionService.deleteVenueSection(venueSectionId, venueId);
        return ResponseEntity.ok(
                new ApiResponse<>(null, "venue section deleted")
        );
    }
}
