package com.opticalshop.repository;

import com.opticalshop.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByUserId(Long userId);
    List<Prescription> findByUserUsername(String username);
}
