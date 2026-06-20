package com.ankit.event_service.controller;

import com.ankit.event_service.dto.ApiResponse;
import com.ankit.event_service.dto.PerformerDTO;
import com.ankit.event_service.service.IPerformerService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/performers")
@RequiredArgsConstructor
public class PerformerController {
    private final IPerformerService performerService;

    @GetMapping("/{performerId}")
    public ResponseEntity<ApiResponse<PerformerDTO>> getPerformer(
            @PathVariable Long performerId
    ) {
        PerformerDTO performerDto = this.performerService
                .getPerformerByID(performerId);
        return ResponseEntity.ok(
                new ApiResponse<>(performerDto, "performer details")
        );
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<Iterable<PerformerDTO>>> getAllPerformers(
            @NotBlank @RequestParam String name
    ) {
        Iterable<PerformerDTO> performerDTOS = this.performerService
                .getPerformerByName(name);
        return ResponseEntity.ok(
                new ApiResponse<>(performerDTOS, "performers details")
        );
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<PerformerDTO>> createPerformer(
            @Valid @RequestBody PerformerDTO performerDto
    ) {
        PerformerDTO savedPerformerDto = this.performerService
                .createPerformer(performerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(savedPerformerDto, "performer created")
        );
    }

    @PutMapping("/{performerId}")
    public ResponseEntity<ApiResponse<PerformerDTO>> createPerformer(
            @PathVariable Long performerId,
            @Valid @RequestBody PerformerDTO performerDto
    ) {
        PerformerDTO savedPerformer = this.performerService
                .updatePerformer(performerId, performerDto);
        return ResponseEntity.ok(
                new ApiResponse<>(savedPerformer, "performer updated")
        );
    }

    @DeleteMapping("/{performerId}")
    public ResponseEntity<ApiResponse<PerformerDTO>> deletePerformer(
            @PathVariable Long performerId
    ) {
        this.performerService.deletePerformer(performerId);
        return ResponseEntity.ok(
                new ApiResponse<>(null, "performer deleted")
        );
    }
}
