package com.ankit.inventory_service.controller;

import com.ankit.inventory_service.dto.ApiResponse;
import com.ankit.inventory_service.dto.VenueDTO;
import com.ankit.inventory_service.dto.VenueSearchResponse;
import com.ankit.inventory_service.service.IVenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<VenueSearchResponse>>> searchVenues(
            @RequestParam(required = false) String keyword,
            @PageableDefault(page = 0, size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<VenueSearchResponse> venuePage = this.venueService
                .searchVenues(keyword, pageable);

        return ResponseEntity.ok(
                new ApiResponse<>(venuePage, "venues details fetched successfully")
        );
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
