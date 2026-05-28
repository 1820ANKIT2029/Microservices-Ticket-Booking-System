package com.ankit.event_service.service;

import com.ankit.event_service.dto.PerformerDTO;

public interface IPerformerService {
    public PerformerDTO getPerformerByID(Long performerID);
    public PerformerDTO createPerformer(PerformerDTO performerDto);
}
