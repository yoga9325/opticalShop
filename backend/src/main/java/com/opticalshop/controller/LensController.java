package com.opticalshop.controller;

import com.opticalshop.model.Lens;
import com.opticalshop.model.LensCoating;
import com.opticalshop.service.LensService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lenses")
public class LensController {

    @Autowired
    private LensService lensService;

    @GetMapping
    public ResponseEntity<List<Lens>> getAllLenses() {
        return ResponseEntity.ok(lensService.getAllLenses());
    }

    @GetMapping("/coatings")
    public ResponseEntity<List<LensCoating>> getAllCoatings() {
        return ResponseEntity.ok(lensService.getAllCoatings());
    }
}
