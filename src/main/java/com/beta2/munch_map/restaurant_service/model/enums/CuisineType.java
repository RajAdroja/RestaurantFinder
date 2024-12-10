package com.beta2.munch_map.restaurant_service.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum CuisineType {
    ITALIAN,
    CHINESE,
    INDIAN,
    MEXICAN,
    AMERICAN;

    @JsonCreator
    public static CuisineType fromValue(String value) {
        try {
            return CuisineType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid CuisineType: " + value);
        }
    }
}