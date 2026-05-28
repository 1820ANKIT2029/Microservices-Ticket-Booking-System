package com.ankit.event_service.service.impl;

import com.ankit.event_service.dto.TicketTypeDTO;
import com.ankit.event_service.entity.TicketType;
import com.ankit.event_service.exception.ResourceNotFoundException;
import com.ankit.event_service.mapper.TicketTypeMapper;
import com.ankit.event_service.repository.TicketTypeRepository;
import com.ankit.event_service.service.ITicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements ITicketTypeService {
    private final TicketTypeRepository ticketTypeRespository;
    private final TicketTypeMapper ticketTypeMapper;


    @Override
    public TicketTypeDTO getTicketType(Long Id) {
        TicketType ticketType = ticketTypeRespository.findById(Id)
                .orElseThrow(
                        () ->
                        new ResourceNotFoundException(
                                "TicketType not found with id " + Id
                        )
                );
        return this.ticketTypeMapper.toDto(ticketType);
    }
}
