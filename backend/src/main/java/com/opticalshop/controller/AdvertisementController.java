package com.opticalshop.controller;

import com.opticalshop.model.Advertisement;
import com.opticalshop.service.AdvertisementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AdvertisementController {

    @Autowired
    private AdvertisementService advertisementService;

    @GetMapping("/advertisements")
    public ResponseEntity<List<Advertisement>> getAllActiveAdvertisements() {
        return ResponseEntity.ok(advertisementService.getAllActiveAdvertisements());
    }

    @GetMapping("/admin/advertisements")
    public ResponseEntity<List<Advertisement>> getAllAdvertisements() {
        return ResponseEntity.ok(advertisementService.getAllAdvertisements());
    }

    @PostMapping("/admin/advertisements")
    public ResponseEntity<Advertisement> addAdvertisement(@RequestBody Advertisement advertisement) {
        return ResponseEntity.ok(advertisementService.addAdvertisement(advertisement));
    }

    @DeleteMapping("/admin/advertisements/{id}")
    public ResponseEntity<Void> deleteAdvertisement(@PathVariable Long id) {
        advertisementService.deleteAdvertisement(id);
        return ResponseEntity.ok().build();
    }
}
