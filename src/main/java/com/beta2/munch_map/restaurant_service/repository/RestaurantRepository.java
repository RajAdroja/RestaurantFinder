package com.beta2.munch_map.restaurant_service.repository;

import com.beta2.munch_map.restaurant_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.beta2.munch_map.restaurant_service.model.Restaurant;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long>, JpaSpecificationExecutor<Restaurant> {
    List<Restaurant> findByNameContainingIgnoreCase(String name);
    List<Restaurant> findByLocationContainingIgnoreCase(String location);
    List<Restaurant> findByCuisineContainingIgnoreCase(String cuisine);
    List<Restaurant> findByRatingGreaterThanEqual(double rating);
    List<Restaurant> findByPriceRangeLessThanEqual(String priceRange);
    List<Restaurant> findByOwner(User owner);

    @Query("SELECT r FROM Restaurant r WHERE r.isActive = true AND " +
            "(SELECT COUNT(r2) FROM Restaurant r2 WHERE r2.name = r.name AND r2.address = r.address AND r2.isActive = true) > 1")
    List<Restaurant> findDuplicates();

    @Query("SELECT r FROM Restaurant r WHERE r.isActive = true AND r.name = :name AND r.address = :address ORDER BY r.createdAt DESC")
    List<Restaurant> findDuplicateGroup(@Param("name") String name, @Param("address") String address);

    @Query("SELECT r FROM Restaurant r WHERE r.owner.email = :email AND r.isActive = true")
    List<Restaurant> findByOwnerEmail(@Param("email") String email);
}