package com.opticalshop.repository;

import com.opticalshop.model.ProductRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRatingRepository extends JpaRepository<ProductRating, Long> {

    Optional<ProductRating> findByProductIdAndUserId(Long productId, Long userId);

    List<ProductRating> findByProductId(Long productId);

    Long countByProductId(Long productId);

    @Query("SELECT AVG(pr.rating) FROM ProductRating pr WHERE pr.productId = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);
}
