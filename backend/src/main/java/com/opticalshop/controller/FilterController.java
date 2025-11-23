package com.opticalshop.controller;

import com.opticalshop.model.Filter;
import com.opticalshop.service.FilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filters")
public class FilterController {

    @Autowired
    private FilterService filterService;

    @GetMapping("/{type}")
    public ResponseEntity<List<Filter>> getFiltersByType(@PathVariable String type) {
        List<Filter> filters = filterService.getFiltersByType(type);
        return ResponseEntity.ok(filters);
    }

    @GetMapping
    public ResponseEntity<List<Filter>> getAllFilters() {
        List<Filter> filters = filterService.getAllFilters();
        return ResponseEntity.ok(filters);
    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getFilterTypes() {
        List<String> types = filterService.getFilterTypes();
        return ResponseEntity.ok(types);
    }

    @PostMapping("/populate")
    public ResponseEntity<String> populateFilters() {
        filterService.populateDefaultFilters();
        return ResponseEntity.ok("Filters populated successfully");
    }

    @PostMapping
    public ResponseEntity<Filter> createFilter(@RequestBody Filter filter) {
        Filter createdFilter = filterService.createFilter(filter);
        return ResponseEntity.ok(createdFilter);
    }
}
