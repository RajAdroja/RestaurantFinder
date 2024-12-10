package com.beta2.munch_map.restaurant_service.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum FoodType {
    VEGETARIAN,
    NON_VEGETARIAN,
    VEGAN;

    @JsonCreator
    public static FoodType fromValue(String value) {
        try {
            return FoodType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid CuisineType: " + value);
        }
    }
}
