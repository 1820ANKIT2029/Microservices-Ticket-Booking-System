package com.ankit.event_service.service;

import com.ankit.event_service.dto.PerformerDTO;

import java.util.List;

public interface IPerformerService {
    public PerformerDTO getPerformerByID(Long performerID);
    public PerformerDTO createPerformer(PerformerDTO performerDto);
    public void deletePerformer(Long performerID);
    public PerformerDTO updatePerformer(Long performerID, PerformerDTO performerDto);
    public List<PerformerDTO> getPerformerByName(String name);
}
