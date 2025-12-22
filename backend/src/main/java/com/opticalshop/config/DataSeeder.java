package com.opticalshop.config;

import com.opticalshop.model.Lens;
import com.opticalshop.model.LensCoating;
import com.opticalshop.repository.LensRepository;
import com.opticalshop.repository.LensCoatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private LensRepository lensRepository;

    @Autowired
    private LensCoatingRepository lensCoatingRepository;

    @Override
    public void run(String... args) throws Exception {
        if (lensRepository.count() == 0) {
            lensRepository.save(new Lens("Single Vision", "Distance or Reading lenses", 0.0));
            lensRepository.save(new Lens("Bifocal", "Has a distinct line separating distance and reading areas", 50.0));
            lensRepository.save(new Lens("Progressive", "No-line multifocal lenses", 100.0));
        }

        if (lensCoatingRepository.count() == 0) {
            lensCoatingRepository.save(new LensCoating("Standard", "Basic anti-scratch coating", 0.0));
            lensCoatingRepository.save(new LensCoating("Anti-Glare", "Reduces reflections and eye strain", 20.0));
            lensCoatingRepository.save(new LensCoating("Blue-Cut", "Blocks harmful blue light from digital screens", 30.0));
            lensCoatingRepository.save(new LensCoating("Photochromic", "Darkens in sunlight", 50.0));
        }
    }
}
