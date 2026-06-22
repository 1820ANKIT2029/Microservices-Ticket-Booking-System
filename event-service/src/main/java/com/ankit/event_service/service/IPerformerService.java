package com.ankit.event_service.service;

import com.ankit.event_service.dto.PerformerDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IPerformerService {
    public PerformerDTO getPerformerByID(Long performerID);
    public PerformerDTO createPerformer(PerformerDTO performerDto);
    public void deletePerformer(Long performerID);
    public PerformerDTO updatePerformer(Long performerID, PerformerDTO performerDto);
    public Page<PerformerDTO> getPerformerByName(String name, Pageable pageable);
}
