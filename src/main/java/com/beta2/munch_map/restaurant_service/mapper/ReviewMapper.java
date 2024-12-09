package com.beta2.munch_map.restaurant_service.mapper;

import com.beta2.munch_map.restaurant_service.dto.ReviewDto;
import com.beta2.munch_map.restaurant_service.model.Review;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;
@Mapper(componentModel = "spring")
@Component
public interface ReviewMapper {

    // Converts Review entity to ReviewDto
    ReviewDto toDto(Review review);

    // Converts ReviewDto to Review entity
    Review toEntity(ReviewDto reviewDto);

    // Updates an existing Review entity from ReviewDto
    void updateEntityFromDto(ReviewDto reviewDto, @MappingTarget Review review);
}
