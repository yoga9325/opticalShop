package com.opticalshop.repository;

import com.opticalshop.model.LensCoating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LensCoatingRepository extends JpaRepository<LensCoating, Long> {
}
