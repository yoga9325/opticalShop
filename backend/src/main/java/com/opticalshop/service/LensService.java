package com.opticalshop.service;

import com.opticalshop.model.Lens;
import com.opticalshop.model.LensCoating;
import com.opticalshop.repository.LensRepository;
import com.opticalshop.repository.LensCoatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LensService {

    @Autowired
    private LensRepository lensRepository;

    @Autowired
    private LensCoatingRepository lensCoatingRepository;

    public List<Lens> getAllLenses() {
        return lensRepository.findAll();
    }

    public List<LensCoating> getAllCoatings() {
        return lensCoatingRepository.findAll();
    }

    public Lens getLensById(Long id) {
        return lensRepository.findById(id).orElseThrow(() -> new RuntimeException("Lens not found"));
    }

    public LensCoating getCoatingById(Long id) {
        return lensCoatingRepository.findById(id).orElseThrow(() -> new RuntimeException("Coating not found"));
    }
}
