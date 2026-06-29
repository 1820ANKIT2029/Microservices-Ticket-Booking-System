package com.ankit.inventory_service.controller;

import com.ankit.inventory_service.dto.ApiResponse;
import com.ankit.inventory_service.dto.SeatDTO;
import com.ankit.inventory_service.service.ISeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues/{venueId}/venue-sections/{venueSectionsId}/seats")
@RequiredArgsConstructor
public class SeatController {
    private final ISeatService seatService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<SeatDTO>> createSeat(
            @RequestBody SeatDTO seatDTO,
            @PathVariable Long venueId,
            @PathVariable Long venueSectionsId
    ) {
        SeatDTO savedSeat = this.seatService.createSeat(venueSectionsId, venueId, seatDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(savedSeat, "seat created")
        );
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<SeatDTO>>> createSeats(
            @RequestBody List<SeatDTO> seatDTOS,
            @PathVariable Long venueId,
            @PathVariable Long venueSectionsId
    ) {
        List<SeatDTO> savedSeats = this.seatService.createSeats(venueSectionsId, venueId, seatDTOS);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(savedSeats, "seats created")
        );
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<SeatDTO>>> getSeats(
            @PathVariable Long venueId,
            @PathVariable Long venueSectionsId
    ) {
        List<SeatDTO> seatDTOS = this.seatService.getSeats(venueSectionsId, venueId);
        return ResponseEntity.ok(
                new ApiResponse<>(seatDTOS, "seats details")
        );
    }

    @PutMapping("/{seatId}")
    public ResponseEntity<ApiResponse<SeatDTO>> modifySeat(
            @PathVariable Long venueId,
            @PathVariable Long venueSectionsId,
            @PathVariable Long seatId,
            @RequestBody SeatDTO seatDTO
    ) {
        SeatDTO seatDTO1 = this.seatService.modifySeat(venueId, venueSectionsId, seatId, seatDTO);
        return ResponseEntity.ok(
                new ApiResponse<>(seatDTO1, "seat updated")
        );
    }

    @DeleteMapping("/{seatId}")
    public ResponseEntity<ApiResponse<SeatDTO>> deleteSeat(
            @PathVariable Long venueId,
            @PathVariable Long venueSectionsId,
            @PathVariable Long seatId
    ) {
        this.seatService.deleteSeat(venueId, venueSectionsId, seatId);
        return ResponseEntity.ok(
                new ApiResponse<>(null, "seat deleted")
        );
    }
}
