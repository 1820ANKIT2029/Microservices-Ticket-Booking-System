package com.ankit.event_service.repository;

import com.ankit.event_service.entity.Performer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerformerRepository extends JpaRepository<Performer,Long> {
    List<Performer> findAllByName(String name);
}
