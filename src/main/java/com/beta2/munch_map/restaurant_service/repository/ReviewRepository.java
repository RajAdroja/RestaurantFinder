package com.beta2.munch_map.restaurant_service.repository;

import java.util.List;
import java.util.Optional;

import com.beta2.munch_map.restaurant_service.model.Restaurant;
import com.beta2.munch_map.restaurant_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.beta2.munch_map.restaurant_service.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Find reviews by restaurant ID
    List<Review> findByRestaurant_IdAndIsActiveOrderByCreatedAtDesc(Long restaurantId, boolean isActive);

    // Count reviews for a restaurant
    Long countByRestaurant_IdAndIsActive(Long restaurantId, boolean isActive);

    // Find reviews by user
    List<Review> findByUserIdAndIsActiveOrderByCreatedAtDesc(Long userId, boolean isActive);

    // Check if user has already reviewed
    boolean existsByRestaurant_IdAndUserIdAndIsActive(Long restaurantId, Long userId, boolean isActive);

    // Calculate average rating - modified to handle null cases
    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.restaurant.id = :restaurantId AND r.isActive = true")
    Double getAverageRatingForRestaurant(@Param("restaurantId") Long restaurantId);

    Optional<Review> findByRestaurantAndUser(Restaurant restaurant, User user);

        // Add a custom query if needed
    @Query("SELECT r FROM Review r WHERE r.id = :id AND r.isActive = true")
    Optional<Review> findActiveById(@Param("id") Long id);

    @Query("SELECT r FROM Review r WHERE r.restaurant.id = :restaurantId AND r.isActive = true ORDER BY r.createdAt DESC")
    List<Review> findAllActiveByRestaurantId(@Param("restaurantId") Long restaurantId);

}
