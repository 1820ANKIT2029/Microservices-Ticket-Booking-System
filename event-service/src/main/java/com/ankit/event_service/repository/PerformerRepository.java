package com.ankit.event_service.respository;

import com.ankit.event_service.entity.Performer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PerformerRepository extends JpaRepository<Performer,Long> {
}
