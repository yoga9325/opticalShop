package com.opticalshop.repository;

import com.opticalshop.model.PromoBannerSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromoBannerSettingsRepository extends JpaRepository<PromoBannerSettings, Long> {
    // Get the first (and should be only) banner settings record
    Optional<PromoBannerSettings> findFirstByOrderByIdAsc();
}
