package com.opticalshop.service;

import com.opticalshop.model.Filter;

import java.util.List;

public interface FilterService {
    List<Filter> getFiltersByType(String type);
    List<Filter> getAllFilters();
    List<String> getFilterTypes();
    Filter createFilter(Filter filter);
    void populateDefaultFilters();
}
