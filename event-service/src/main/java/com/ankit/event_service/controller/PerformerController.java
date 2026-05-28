package com.ankit.event_service.controller;

import com.ankit.event_service.dto.PerformerDTO;
import com.ankit.event_service.service.IPerformerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/performers")
@RequiredArgsConstructor
public class PerformerController {
    private final IPerformerService performerService;

    @GetMapping("/{performerId}")
    public ResponseEntity<PerformerDTO> getPerformer(@PathVariable Long performerId) {
        PerformerDTO performerDto = this.performerService.getPerformerByID(performerId);
        return ResponseEntity.ok(performerDto);
    }

    @PostMapping("")
    public ResponseEntity<PerformerDTO> createPerformer(@Valid @RequestBody PerformerDTO performerDto) {
        PerformerDTO savedPerformerDto = this.performerService.createPerformer(performerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPerformerDto);
    }
}
