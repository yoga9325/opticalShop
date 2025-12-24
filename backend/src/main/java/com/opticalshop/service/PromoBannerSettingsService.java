package com.opticalshop.service;

import com.opticalshop.model.PromoBannerSettings;
import com.opticalshop.repository.PromoBannerSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromoBannerSettingsService {
    
    @Autowired
    private PromoBannerSettingsRepository repository;
    
    /**
     * Get banner settings (creates default if doesn't exist)
     */
    public PromoBannerSettings getSettings() {
        return repository.findFirstByOrderByIdAsc()
                .orElseGet(this::createDefaultSettings);
    }
    
    /**
     * Update banner settings
     */
    public PromoBannerSettings updateSettings(PromoBannerSettings settings) {
        // Get existing settings or create new
        PromoBannerSettings existing = repository.findFirstByOrderByIdAsc()
                .orElse(new PromoBannerSettings());
        
        // Update fields
        existing.setEnabled(settings.getEnabled());
        existing.setTitle(settings.getTitle());
        existing.setSubtitle(settings.getSubtitle());
        existing.setFeatures(settings.getFeatures());
        existing.setCountdownDuration(settings.getCountdownDuration());
        existing.setIcon(settings.getIcon());
        
        return repository.save(existing);
    }
    
    /**
     * Create default settings
     */
    private PromoBannerSettings createDefaultSettings() {
        PromoBannerSettings defaultSettings = new PromoBannerSettings();
        defaultSettings.setEnabled(true);
        defaultSettings.setTitle("Optical Shop Mobile App");
        defaultSettings.setSubtitle("Get ready for a seamless shopping experience right at your fingertips!");
        defaultSettings.setFeatures("[\"Browse products on the go\",\"Book eye tests instantly\",\"Exclusive app-only deals\",\"Virtual try-on feature\"]");
        defaultSettings.setCountdownDuration(15);
        defaultSettings.setIcon("bi-phone-fill");
        
        return repository.save(defaultSettings);
    }
}
