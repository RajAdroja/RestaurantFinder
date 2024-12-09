package com.beta2.munch_map.restaurant_service.mapper;

import com.beta2.munch_map.restaurant_service.dto.RestaurantDto;
import com.beta2.munch_map.restaurant_service.model.Restaurant;
import com.beta2.munch_map.restaurant_service.model.User;
import com.beta2.munch_map.restaurant_service.model.enums.PriceLevel;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

//public class RestaurantMapper {
//
//    public static Restaurant toEntity(RestaurantDto dto, User owner) {
//        Restaurant restaurant = new Restaurant();
//        restaurant.setName(dto.getName());
//        restaurant.setAddress(dto.getAddress());
//        restaurant.setCuisineType(dto.getCuisineType());
//        restaurant.setPincode(dto.getPincode());
//        restaurant.setDescription(dto.getDescription());
//        restaurant.setPhotos(dto.getPhotos());
//        restaurant.setContactInfo(dto.getContactInfo());
//        restaurant.setPriceLevel(PriceLevel.valueOf(dto.getPriceLevel()));
//        restaurant.setOperatingHours(dto.getOperatingHours());
//        restaurant.setOwner(owner);
//        return restaurant;
//    }
//
//    public static RestaurantDto toDto(Restaurant entity) {
//        RestaurantDto dto = new RestaurantDto();
//        dto.setName(entity.getName());
//        dto.setAddress(entity.getAddress());
//        dto.setCuisineType(entity.getCuisineType());
//        dto.setPincode(entity.getPincode());
//        dto.setDescription(entity.getDescription());
//        dto.setPhotos(entity.getPhotos());
//        dto.setContactInfo(entity.getContactInfo());
//        dto.setOperatingHours(entity.getOperatingHours());
//        return dto;
//    }
//}

@Mapper(componentModel = "spring")
@Component
public interface RestaurantMapper {

    // Converts RestaurantDto to Restaurant
    Restaurant toEntity(RestaurantDto dto);

    // Converts Restaurant to RestaurantDto
    RestaurantDto toDto(Restaurant entity);

    // Updates an existing Restaurant entity from RestaurantDto
    void updateEntityFromDto(RestaurantDto dto, @MappingTarget Restaurant entity);
}
