package com.beta2.munch_map.restaurant_service.controller;

import java.util.HashMap;
import java.util.List;

import com.beta2.munch_map.restaurant_service.dto.RestaurantDto;
import com.beta2.munch_map.restaurant_service.model.enums.CuisineType;
import com.beta2.munch_map.restaurant_service.model.enums.FoodType;
import com.beta2.munch_map.restaurant_service.model.enums.PriceLevel;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.beta2.munch_map.restaurant_service.model.Restaurant;
import com.beta2.munch_map.restaurant_service.repository.RestaurantRepository;
import com.beta2.munch_map.restaurant_service.service.RestaurantService;
import com.beta2.munch_map.restaurant_service.service.ReviewService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

   private static final Logger logger = LoggerFactory.getLogger(RestaurantController.class);
   private final RestaurantService restaurantService;
   private final ReviewService reviewService;
   private final RestaurantRepository restaurantRepository;

   // Constructor-based injection
   public RestaurantController(
           RestaurantService restaurantService,
           ReviewService reviewService,
           RestaurantRepository restaurantRepository) {
       this.restaurantService = restaurantService;
       this.reviewService = reviewService;
       this.restaurantRepository = restaurantRepository;
   }

   // Get single restaurant by ID along with its reviews
   @GetMapping("/{id}")
   public ResponseEntity<Restaurant> getRestaurantWithReviews(@PathVariable Long id) {
       logger.info("Received request to fetch restaurant with ID: {}", id);
       Restaurant restaurant = restaurantService.getRestaurantWithReviews(id);
       return ResponseEntity.ok(restaurant);
   }

   @GetMapping("/{id}/verify-rating")
   public ResponseEntity<HashMap<String, Object>> verifyRating(@PathVariable Long id) {
       Double calculatedRating = reviewService.verifyRestaurantRating(id);
       Double storedRating = restaurantRepository.findById(id)
           .map(Restaurant::getAverageRating)
           .orElse(0.0);
       
       HashMap<String, Object> response = new HashMap<>();
       response.put("calculatedRating", calculatedRating);
       response.put("storedRating", storedRating);
       
       return ResponseEntity.ok(response);
   }

    @PostMapping(value = "/add", consumes = "multipart/form-data")
    @PreAuthorize("hasAuthority('BUSINESS_OWNER')")
    public ResponseEntity<?> addRestaurantWithImages(
            @RequestPart("restaurant") String restaurantJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal UserDetails userDetails, HttpServletRequest request) {
        ObjectMapper objectMapper = new ObjectMapper();
        RestaurantDto restaurantDto;
        try {
            restaurantDto = objectMapper.readValue(restaurantJson, RestaurantDto.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body("Invalid JSON for restaurant");
        }
        return ResponseEntity.ok(restaurantService.addRestaurantWithImages(restaurantDto, images, userDetails));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('BUSINESS_OWNER')")
    public ResponseEntity<?> updateRestaurant(
            @PathVariable Long id,
            @RequestPart("restaurant") String restaurantJson,
            @RequestPart(value = "newImages", required = false) List<MultipartFile> newImages,
            @AuthenticationPrincipal UserDetails userDetails) {

        ObjectMapper objectMapper = new ObjectMapper();
        RestaurantDto restaurantDto;
        try {
            // Parse the JSON string into RestaurantDto
            restaurantDto = objectMapper.readValue(restaurantJson, RestaurantDto.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body("Invalid JSON for restaurant");
        }
        // Set the new images into the DTO
        restaurantDto.setNewImages(newImages);

        // Call the service
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, restaurantDto, userDetails));
    }

    @GetMapping("/duplicates")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<RestaurantDto>> getDuplicateRestaurants(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(restaurantService.getDuplicateRestaurants(userDetails));
    }

    // Endpoint to delete the latest duplicate
    @DeleteMapping("/duplicates")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteLatestDuplicate(@RequestParam String name, @RequestParam String address, @AuthenticationPrincipal UserDetails userDetails) {
        restaurantService.deleteLatestDuplicate(name, address, userDetails);
        return ResponseEntity.ok("Latest duplicate restaurant has been deactivated.");
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants(@AuthenticationPrincipal UserDetails userDetails) {
        List<RestaurantDto> restaurants = restaurantService.getAllRestaurants(userDetails);
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/owner")
    @PreAuthorize("hasAuthority('BUSINESS_OWNER')")
    public ResponseEntity<List<RestaurantDto>> getRestaurantsForOwner(@AuthenticationPrincipal UserDetails userDetails) {
        List<RestaurantDto> restaurants = restaurantService.getRestaurantsForOwner(userDetails);
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/{restaurantId}")
    @PreAuthorize("hasAuthority('BUSINESS_OWNER') or hasAuthority('ADMIN')")
    public ResponseEntity<RestaurantDto> getRestaurantById(
            @PathVariable Long restaurantId,
            @AuthenticationPrincipal UserDetails userDetails) {
        RestaurantDto restaurantDto = restaurantService.getRestaurantById(restaurantId, userDetails);
        return ResponseEntity.ok(restaurantDto);
    }

    @DeleteMapping("/{restaurantId}")
    @PreAuthorize("hasAuthority('BUSINESS_OWNER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteRestaurant(
            @PathVariable Long restaurantId,
            @AuthenticationPrincipal UserDetails userDetails) {
        restaurantService.deleteRestaurant(restaurantId, userDetails);
        return ResponseEntity.ok("Restaurant has been deactivated.");
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<List<RestaurantDto>> searchRestaurants(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) CuisineType cuisineType,
            @RequestParam(required = false) FoodType foodType,
            @RequestParam(required = false) PriceLevel priceLevel,
            @RequestParam(required = false) Double averageRating) {

        List<RestaurantDto> restaurants = restaurantService.searchRestaurants(name, cuisineType, foodType, priceLevel, averageRating);
        return ResponseEntity.ok(restaurants);
    }
}