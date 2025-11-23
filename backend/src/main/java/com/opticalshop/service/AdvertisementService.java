package com.opticalshop.service;

import com.opticalshop.model.Advertisement;
import com.opticalshop.repository.AdvertisementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdvertisementService {

    @Autowired
    private AdvertisementRepository advertisementRepository;

    public List<Advertisement> getAllActiveAdvertisements() {
        return advertisementRepository.findByActiveTrue();
    }

    public List<Advertisement> getAllAdvertisements() {
        return advertisementRepository.findAll();
    }

    public Advertisement addAdvertisement(Advertisement advertisement) {
        return advertisementRepository.save(advertisement);
    }

    public void deleteAdvertisement(Long id) {
        advertisementRepository.deleteById(id);
    }
}
