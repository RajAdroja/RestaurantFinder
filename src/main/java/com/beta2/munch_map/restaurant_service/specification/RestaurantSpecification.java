package com.beta2.munch_map.restaurant_service.specification;

import com.beta2.munch_map.restaurant_service.model.Restaurant;
import com.beta2.munch_map.restaurant_service.model.enums.CuisineType;
import com.beta2.munch_map.restaurant_service.model.enums.FoodType;
import com.beta2.munch_map.restaurant_service.model.enums.PriceLevel;
import org.springframework.data.jpa.domain.Specification;

public class RestaurantSpecification {

    public static Specification<Restaurant> hasName(String name) {
        return (root, query, criteriaBuilder) ->
                name == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Restaurant> hasCuisineType(CuisineType cuisineType) {
        return (root, query, criteriaBuilder) ->
                cuisineType == null ? null : criteriaBuilder.equal(root.get("cuisineType"), cuisineType);
    }

    public static Specification<Restaurant> hasFoodType(FoodType foodType) {
        return (root, query, criteriaBuilder) ->
                foodType == null ? null : criteriaBuilder.equal(root.get("foodType"), foodType);
    }

    public static Specification<Restaurant> hasPriceLevel(PriceLevel priceLevel) {
        return (root, query, criteriaBuilder) ->
                priceLevel == null ? null : criteriaBuilder.equal(root.get("priceLevel"), priceLevel);
    }

    public static Specification<Restaurant> hasAverageRating(Double averageRating) {
        return (root, query, criteriaBuilder) ->
                averageRating == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("averageRating"), averageRating);
    }
}
