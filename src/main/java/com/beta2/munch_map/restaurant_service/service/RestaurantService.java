package com.beta2.munch_map.restaurant_service.service;

import com.beta2.munch_map.restaurant_service.dto.RestaurantDto;
import com.beta2.munch_map.restaurant_service.mapper.RestaurantMapper;
import com.beta2.munch_map.restaurant_service.model.User;
import com.beta2.munch_map.restaurant_service.model.enums.CuisineType;
import com.beta2.munch_map.restaurant_service.model.enums.FoodType;
import com.beta2.munch_map.restaurant_service.model.enums.PriceLevel;
import com.beta2.munch_map.restaurant_service.model.enums.Role;
import com.beta2.munch_map.restaurant_service.repository.UserRepository;
import com.beta2.munch_map.restaurant_service.specification.RestaurantSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.List;
import com.beta2.munch_map.restaurant_service.util.GoogleMapsClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.beta2.munch_map.restaurant_service.model.Restaurant;
import com.beta2.munch_map.restaurant_service.repository.RestaurantRepository;
import com.beta2.munch_map.restaurant_service.repository.ReviewRepository;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class RestaurantService {

    private static final Logger logger = LoggerFactory.getLogger(RestaurantService.class);

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RestaurantMapper restaurantMapper;

    @Autowired
    private GoogleMapsClient googleMapsClient;

    @Autowired
    private S3Service s3Service;


    // public List<Restaurant> getByName(String name) {
    //     return restaurantRepository.findByNameContainingIgnoreCase(name);
    // }

    // public List<Restaurant> getByCuisine(String cuisineType) {
    //     return restaurantRepository.findByCuisineTypeContainingIgnoreCase(cuisineType);
    // }

    // public List<Restaurant> getByLocation(String location) {
    //     return restaurantRepository.findByLocationContainingIgnoreCase(location);
    // }

    // public List<Restaurant> getByRating(double rating) {
    //     return restaurantRepository.findByRatingGreaterThanEqual(rating);
    // }

    // public List<Restaurant> getByPriceRange(String priceRange) {
    //     return restaurantRepository.findByPriceRangeLessThanEqual(priceRange);
    // }

    public List<Map<String, String>> getByPincode(String pincode) {
        return googleMapsClient.getRestaurantsFromGoogle(pincode);
    }

    // Fetch a single restaurant by ID along with its reviews
    public Restaurant getRestaurantWithReviews(Long id) {
        logger.info("Fetching restaurant with ID: {}", id);

        return restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found with ID: " + id));
        // Reviews are lazily fetched when accessed in the controller.

        // If eager fetching is needed, use JOIN FETCH in a custom query.

        // Example:
        // @Query("SELECT r FROM Restaurant r JOIN FETCH r.reviews WHERE r.id = :id")
        // Optional<Restaurant> findByIdWithReviews(@Param("id") Long id);

        // Then call that method here.


    }


    public Restaurant getRestaurantWithAverageRating(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found with ID: " + id));

        Double averageRating = reviewRepository.getAverageRatingForRestaurant(id);
        restaurant.setAverageRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0);

        return restaurant;
    }

    public RestaurantDto addRestaurant(RestaurantDto restaurantDto, UserDetails userDetails) {
        // Extract email and role from the authenticated user's details
        String email = userDetails.getUsername(); // Usually the username in UserDetails is set as email.

        // Fetch the user from the database
        User owner = userRepository.findByEmail(email);
        if (owner == null || !owner.getRole().equals(Role.BUSINESS_OWNER)) {
            throw new IllegalArgumentException("Only business owners can add restaurants.");
        }

        // Map the DTO to an entity and set the owner
        Restaurant restaurant = restaurantMapper.toEntity(restaurantDto);
        restaurant.setOwner(owner);

        // Save the restaurant
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return restaurantMapper.toDto(savedRestaurant);
    }

    public RestaurantDto addRestaurantWithImages(RestaurantDto restaurantDto, List<MultipartFile> images, UserDetails userDetails) {
        String ownerEmail = userDetails.getUsername();

        // Fetch the user from the database
        User owner = userRepository.findByEmail(ownerEmail);
        if (owner == null || !owner.getRole().equals(Role.BUSINESS_OWNER)) {
            throw new IllegalArgumentException("Only business owners can add restaurants.");
        }

        // Upload each image to S3 and collect the URLs
        List<String> imageUrls = (images != null && !images.isEmpty()) ? images.stream()
                .map(s3Service::uploadImage)
                .toList() : List.of();

        // Map the DTO to an entity
        Restaurant restaurant = restaurantMapper.toEntity(restaurantDto);

        // Set the owner and photo URLs
        restaurant.setOwner(owner);
        restaurant.setPhotos(imageUrls);

        // Save the restaurant
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        // Map the saved entity back to a DTO
        return restaurantMapper.toDto(savedRestaurant);
    }


    public RestaurantDto updateRestaurant(Long id, RestaurantDto restaurantDto, UserDetails userDetails) {
        // Extract the email of the logged-in user from UserDetails
        String ownerEmail = userDetails.getUsername();

        // Find the restaurant by ID
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        // Ensure the logged-in user owns the restaurant
        if (!restaurant.getOwner().getEmail().equals(ownerEmail)) {
            throw new SecurityException("You are not authorized to update this restaurant.");
        }

        // Update restaurant fields from DTO
        restaurantMapper.updateEntityFromDto(restaurantDto, restaurant);

        // Handle image updates
        handleImageUpdates(restaurant, restaurantDto);

        // Save the updated restaurant
        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);

        // Return the updated restaurant as a DTO
        return restaurantMapper.toDto(updatedRestaurant);
    }

    private void handleImageUpdates(Restaurant restaurant, RestaurantDto restaurantDto) {
        // Remove specified images
        if (restaurantDto.getImagesToRemove() != null) {
            // Delete images from S3
            restaurantDto.getImagesToRemove().forEach(s3Service::deleteImage);
            restaurant.getPhotos().removeAll(restaurantDto.getImagesToRemove());
        }

        // Add new images
        if (restaurantDto.getNewImages() != null && !restaurantDto.getNewImages().isEmpty()) {
            List<String> newImageUrls = restaurantDto.getNewImages().stream()
                    .map(s3Service::uploadImage) // Upload each image to S3
                    .toList();
            restaurant.getPhotos().addAll(newImageUrls);
        }
    }

    // Get duplicate restaurants for admin dashboard
    public List<RestaurantDto> getDuplicateRestaurants(UserDetails userDetails) {

        if (!isAdmin(userDetails)) {
            throw new SecurityException("Only ADMIN can access duplicate restaurants.");
        }

        List<Restaurant> duplicates = restaurantRepository.findDuplicates();
        return duplicates.stream()
                .map(restaurantMapper::toDto)
                .toList();
    }

    // Soft delete the latest duplicate restaurant
    public void deleteLatestDuplicate(String name, String address, UserDetails userDetails) {
        // Check if the user is an admin
        if (!isAdmin(userDetails)) {
            throw new SecurityException("Only ADMIN can delete duplicate restaurants.");
        }

        List<Restaurant> duplicateGroup = restaurantRepository.findDuplicateGroup(name, address);

        if (duplicateGroup.size() <= 1) {
            throw new IllegalArgumentException("No duplicate restaurants found to delete.");
        }

        // The latest duplicate is the first entry in the ordered list
        if (!duplicateGroup.isEmpty()) {
            // Keep the latest one active and soft delete the rest
            Restaurant oldestDuplicate = duplicateGroup.get(0); // The latest duplicate
            for (int i = 1; i < duplicateGroup.size(); i++) { // Start from the second element
                Restaurant duplicate = duplicateGroup.get(i);
                duplicate.setActive(false); // Soft delete the duplicate
                restaurantRepository.save(duplicate); // Save the soft-deleted duplicate
            }
        }
    }

    private boolean isAdmin(UserDetails userDetails) {
        return userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ADMIN"));
    }

    public List<RestaurantDto> getAllRestaurants(UserDetails userDetails) {
        // Ensure the user is an admin
        if (!isAdmin(userDetails)) {
            throw new SecurityException("Only ADMIN can access all restaurants.");
        }

        // Fetch all restaurants
        List<Restaurant> restaurants = restaurantRepository.findAll();

        // Map entities to DTOs
        return restaurants.stream()
                .map(restaurantMapper::toDto)
                .toList();
    }

    public List<RestaurantDto> getRestaurantsForOwner(UserDetails userDetails) {
        // Fetch the logged-in user's email
        String email = userDetails.getUsername();

        // Fetch restaurants owned by the logged-in business owner
        List<Restaurant> restaurants = restaurantRepository.findByOwnerEmail(email);

        // Map entities to DTOs
        return restaurants.stream()
                .map(restaurantMapper::toDto)
                .toList();
    }

    public RestaurantDto getRestaurantById(Long restaurantId, UserDetails userDetails) {
        // Fetch the restaurant
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
    
        // Check if the user is an admin
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
    
        // Check if the user is the owner of the restaurant
        boolean isOwner = restaurant.getOwner().getEmail().equals(userDetails.getUsername());
    
        // Check if the user has the USER role
        boolean isUser = userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("USER"));
    
        // Authorization check: allow access only if the user is an admin, owner, or has the USER role
        if (!isAdmin && !isOwner && !isUser) {
            throw new SecurityException("You are not authorized to view this restaurant.");
        }
    
        // Map the restaurant entity to a DTO and return
        return restaurantMapper.toDto(restaurant);
    }

    public void deleteRestaurant(Long restaurantId, UserDetails userDetails) {
        // Fetch the restaurant
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        // If the user is not an admin, ensure they own the restaurant
        if (!isAdmin(userDetails) && !restaurant.getOwner().getEmail().equals(userDetails.getUsername())) {
            throw new SecurityException("You are not authorized to delete this restaurant.");
        }

        // Soft delete the restaurant
        restaurant.setActive(false);
        restaurantRepository.save(restaurant);
    }

    public List<RestaurantDto> searchRestaurants(String name, CuisineType cuisineType, FoodType foodType, PriceLevel priceLevel, Double averageRating) {
        // Combine all specifications
        Specification<Restaurant> spec = Specification.where(RestaurantSpecification.hasName(name))
                .and(RestaurantSpecification.hasCuisineType(cuisineType))
                .and(RestaurantSpecification.hasFoodType(foodType))
                .and(RestaurantSpecification.hasPriceLevel(priceLevel))
                .and(RestaurantSpecification.hasAverageRating(averageRating));

        // Fetch restaurants and map to DTOs
        return restaurantRepository.findAll(spec).stream()
                .map(restaurantMapper::toDto)
                .toList();
    }

}