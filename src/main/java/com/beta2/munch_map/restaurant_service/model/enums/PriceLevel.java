package com.beta2.munch_map.restaurant_service.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PriceLevel {
    LOW, MEDIUM, HIGH;

    @JsonCreator
    public static PriceLevel fromValue(String value) {
        try {
            return PriceLevel.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid CuisineType: " + value);
        }
    }
}
