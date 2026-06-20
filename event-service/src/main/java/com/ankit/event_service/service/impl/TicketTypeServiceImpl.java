package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.TicketTypeDTO;
import com.ankit.event_service.entity.TicketType;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.mapper.TicketTypeMapper;
import com.ankit.event_service.repository.TicketTypeRepository;
import com.ankit.event_service.service.ITicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements ITicketTypeService {
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketTypeMapper ticketTypeMapper;


    @Override
    public TicketTypeDTO getTicketType(Long Id, Long eventSessionId) {
        TicketType ticketType = ticketTypeRepository.findByIdAndEventSessionId(Id, eventSessionId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("TicketType not found with id " + Id)
                );
        return this.ticketTypeMapper.toDto(ticketType);
    }

    @Override
    public List<TicketTypeDTO> getAllTicketTypesOfEventSession(Long eventSessionId) {
        List<TicketType> ticketTypes = ticketTypeRepository.findAllByEventSessionId(eventSessionId);
        if(!ticketTypes.isEmpty()) return ticketTypes.stream().map(ticketTypeMapper::toDto).toList();
        return List.of();
    }

    @Override
    @Transactional
    public TicketTypeDTO createTicketType(TicketTypeDTO ticketTypeDTO, Long eventSessionId) {
        ticketTypeDTO.setEventSessionId(eventSessionId);
        TicketType ticketType = this.ticketTypeMapper.toEntity(ticketTypeDTO);
        TicketType savedTicketType = this.ticketTypeRepository.save(ticketType);
        return this.ticketTypeMapper.toDto(savedTicketType);
    }

    @Override
    @Transactional
    public void deleteTicketType(Long ticketTypeId, Long eventId) {
        this.ticketTypeRepository.deleteByIdAndEventSessionId(ticketTypeId, eventId);
    }

    @Override
    public TicketTypeDTO updateTicketType(Long ticketTypeId, TicketTypeDTO ticketTypeDTO, Long eventSessionId) {
        TicketType ticketType = this.ticketTypeRepository
                .findByIdAndEventSessionId(ticketTypeId, eventSessionId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("TicketType not found with id " + ticketTypeId)
                );

        if(ticketTypeDTO.getName() != null) ticketType.setName(ticketTypeDTO.getName());
        if(ticketTypeDTO.getDescription() != null) ticketType.setDescription(ticketTypeDTO.getDescription());
        if(ticketTypeDTO.getIsActive() != null) ticketType.setIsActive(ticketTypeDTO.getIsActive());
        if(ticketTypeDTO.getTotalQuantity() != null) ticketType.setTotalQuantity(ticketTypeDTO.getTotalQuantity());
        if(ticketTypeDTO.getBasePrice() != null) ticketType.setBasePrice(ticketTypeDTO.getBasePrice());
        if(ticketTypeDTO.getMaxPerBooking() != null) ticketType.setMaxPerBooking(ticketTypeDTO.getMaxPerBooking());
        if(ticketTypeDTO.getSaleStartAt() != null) ticketType.setSaleStartAt(ticketTypeDTO.getSaleStartAt());
        if(ticketTypeDTO.getSaleEndAt() != null) ticketType.setSaleEndAt(ticketTypeDTO.getSaleEndAt());

        TicketType savedTicketType = this.ticketTypeRepository.save(ticketType);
        return this.ticketTypeMapper.toDto(savedTicketType);
    }
}
