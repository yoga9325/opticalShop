package com.opticalshop.service.impl;

import com.opticalshop.model.Filter;
import com.opticalshop.repository.FilterRepository;
import com.opticalshop.service.FilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class FilterServiceImpl implements FilterService {

    @Autowired
    private FilterRepository filterRepository;

    @Override
    public List<Filter> getFiltersByType(String type) {
        return filterRepository.findActiveFiltersByType(type);
    }

    @Override
    public List<Filter> getAllFilters() {
        return filterRepository.findAll();
    }

    @Override
    public List<String> getFilterTypes() {
        return filterRepository.findDistinctTypes();
    }

    @Override
    public Filter createFilter(Filter filter) {
        return filterRepository.save(filter);
    }

    @Override
    public void populateDefaultFilters() {
        // Check if filters already exist
        if (!filterRepository.findAll().isEmpty()) {
            return; // Already populated
        }

        // Gender filters
        Filter genderMen = new Filter();
        genderMen.setType("gender");
        genderMen.setName("Men");
        genderMen.setTitle("Men");
        genderMen.setActive(true);
        createFilter(genderMen);

        Filter genderWomen = new Filter();
        genderWomen.setType("gender");
        genderWomen.setName("Women");
        genderWomen.setTitle("Women");
        genderWomen.setActive(true);
        createFilter(genderWomen);

        // Product Type filters
        Filter eyeGlasses = new Filter();
        eyeGlasses.setType("productType");
        eyeGlasses.setName("Eye Glasses");
        eyeGlasses.setTitle("eyeglasses");
        eyeGlasses.setActive(true);
        createFilter(eyeGlasses);

        Filter sunGlasses = new Filter();
        sunGlasses.setType("productType");
        sunGlasses.setName("Sun Glasses");
        sunGlasses.setTitle("sunglasses");
        sunGlasses.setActive(true);
        createFilter(sunGlasses);

        // Frame Color filters
        List<String> colors = Arrays.asList("Black", "Blue", "white", "Gold", "Silver", "Green");
        for (String color : colors) {
            Filter colorFilter = new Filter();
            colorFilter.setType("frameColor");
            colorFilter.setName(color);
            colorFilter.setTitle(color);
            colorFilter.setActive(true);
            createFilter(colorFilter);
        }

        // Frame Type filters (Frame1)
        Filter fullRim = new Filter();
        fullRim.setType("frameType");
        fullRim.setName("Full Rim");
        fullRim.setTitle("Full Rim");
        fullRim.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/FullRim.png");
        fullRim.setActive(true);
        createFilter(fullRim);

        Filter halfRim = new Filter();
        halfRim.setType("frameType");
        halfRim.setName("Half Rim");
        halfRim.setTitle("Half Rim");
        halfRim.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/HalfRim.png");
        halfRim.setActive(true);
        createFilter(halfRim);

        Filter rimless = new Filter();
        rimless.setType("frameType");
        rimless.setName("Rimless");
        rimless.setTitle("Rimless");
        rimless.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/Rimless.png");
        rimless.setActive(true);
        createFilter(rimless);

        // Frame Shape filters (Frame2)
        Filter rectangle = new Filter();
        rectangle.setType("frameShape");
        rectangle.setName("Rectangle");
        rectangle.setTitle("Rectangle");
        rectangle.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/Rectangle.png");
        rectangle.setActive(true);
        createFilter(rectangle);

        Filter round = new Filter();
        round.setType("frameShape");
        round.setName("Round");
        round.setTitle("Round");
        round.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/Round.png");
        round.setActive(true);
        createFilter(round);

        Filter catEye = new Filter();
        catEye.setType("frameShape");
        catEye.setName("Cateye");
        catEye.setTitle("Cat Eye");
        catEye.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/CatEye.png");
        catEye.setActive(true);
        createFilter(catEye);

        Filter square = new Filter();
        square.setType("frameShape");
        square.setName("Square");
        square.setTitle("Square");
        square.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/Square.png");
        square.setActive(true);
        createFilter(square);

        Filter tinted = new Filter();
        tinted.setType("frameShape");
        tinted.setName("Tinted ");
        tinted.setTitle("Tinted ");
        tinted.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/Geometric.png");
        tinted.setActive(true);
        createFilter(tinted);

        Filter wayfarer = new Filter();
        wayfarer.setType("frameShape");
        wayfarer.setName("Wayfarer");
        wayfarer.setTitle("Wayfarer");
        wayfarer.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/Wayfarer.png");
        wayfarer.setActive(true);
        createFilter(wayfarer);

        Filter aviator = new Filter();
        aviator.setType("frameShape");
        aviator.setName("Aviator");
        aviator.setTitle("Aviator");
        aviator.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/Aviator.png");
        aviator.setActive(true);
        createFilter(aviator);

        Filter hexagon = new Filter();
        hexagon.setType("frameShape");
        hexagon.setName("Hexagon");
        hexagon.setTitle("Hexagon");
        hexagon.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/Hexagonal.png");
        hexagon.setActive(true);
        createFilter(hexagon);

        Filter butterfly = new Filter();
        butterfly.setType("frameShape");
        butterfly.setName("Butterfly");
        butterfly.setTitle("Butterfly");
        butterfly.setSrc("https://static.lenskart.com/images/cust_mailer/Eyeglass/Clubmaster.png");
        butterfly.setActive(true);
        createFilter(butterfly);
    }
}
