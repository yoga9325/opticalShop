package com.opticalshop.repository;

import com.opticalshop.model.Filter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FilterRepository extends JpaRepository<Filter, Long> {

    List<Filter> findByTypeAndActiveTrue(String type);

    List<Filter> findByType(String type);

    @Query("SELECT DISTINCT f.type FROM Filter f WHERE f.active = true")
    List<String> findDistinctTypes();

    @Query("SELECT f FROM Filter f WHERE f.type = :type AND f.active = true ORDER BY f.title")
    List<Filter> findActiveFiltersByType(@Param("type") String type);
}
