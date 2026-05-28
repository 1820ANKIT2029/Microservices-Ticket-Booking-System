package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.PerformerDTO;
import com.ankit.event_service.entity.Performer;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.mapper.PerformerMapper;
import com.ankit.event_service.repository.PerformerRepository;
import com.ankit.event_service.service.IPerformerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class PerformerServiceImpl implements IPerformerService {
    private final PerformerRepository performerRepository;
    private final PerformerMapper performerMapper;

    @Override
    @Transactional(readOnly = true)
    public PerformerDTO getPerformerByID(Long performerID) {
        Performer performer = this.performerRepository.findById(performerID)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Performer not found with ID: " + performerID.toString()
                        )
                );

        return this.performerMapper.toDto(performer);
    }

    @Override
    @Transactional
    public PerformerDTO createPerformer(PerformerDTO performerDto) {
        Performer entityToSave = this.performerMapper.toEntity(performerDto);
        Performer savedPerformer = this.performerRepository.save(entityToSave);

        return this.performerMapper.toDto(savedPerformer);
    }
}
