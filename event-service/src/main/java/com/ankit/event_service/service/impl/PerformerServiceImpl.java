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

import java.util.List;


@Service
@RequiredArgsConstructor
public class PerformerServiceImpl implements IPerformerService {
    private final PerformerRepository performerRepository;
    private final PerformerMapper performerMapper;

    @Override
    public PerformerDTO getPerformerByID(Long performerID) {
        Performer performer = this.performerRepository
                .findById(performerID)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Performer not found with ID: " + performerID.toString())
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

    @Override
    public void deletePerformer(Long performerID) {
        this.performerRepository.deleteById(performerID);
    }

    @Override
    @Transactional
    public PerformerDTO updatePerformer(Long performerID, PerformerDTO performerDto) {
        Performer performer = this.performerRepository
                .findById(performerID)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Performer not found with ID: " + performerID.toString())
                );

        if(performerDto.getName() != null) performer.setName(performerDto.getName());
        if(performerDto.getBio() != null) performer.setBio(performerDto.getBio());
        if(performerDto.getIsActive() != null) performer.setIsActive(performerDto.getIsActive());
        if(performerDto.getGenre() != null) performer.setGenre(performerDto.getGenre());
        if(performerDto.getNationality() != null) performer.setNationality(performerDto.getNationality());
        if(performerDto.getWebsiteUrl() != null) performer.setWebsiteUrl(performerDto.getWebsiteUrl());
        if(performerDto.getImageUrl() != null) performer.setImageUrl(performerDto.getImageUrl());
        if(performerDto.getSocialLink1() != null) performer.setSocialLink1(performerDto.getSocialLink1());
        if(performerDto.getSocialLink2() != null) performer.setSocialLink2(performerDto.getSocialLink2());

        Performer savedPerformer = this.performerRepository.save(performer);
        return this.performerMapper.toDto(savedPerformer);
    }

    @Override
    public List<PerformerDTO> getPerformerByName(String name) {
        List<Performer> performers = this.performerRepository.findAllByName(name);
        if(!performers.isEmpty()) return performers.stream().map(performerMapper::toDto).toList();
        return List.of();
    }
}
