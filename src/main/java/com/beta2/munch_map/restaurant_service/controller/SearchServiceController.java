package com.beta2.munch_map.restaurant_service.controller;

import java.util.Map;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.beta2.munch_map.restaurant_service.model.Restaurant;
import com.beta2.munch_map.restaurant_service.service.RestaurantService;

@RestController
@RequestMapping("/api/search") // Base path for all endpoints in this controller
public class SearchServiceController {

    @Autowired
    private RestaurantService restaurantService;

    // get by Name
    @GetMapping("/name/{name}")
    public ResponseEntity<List<Restaurant>> getByName(@PathVariable String name) {
        List<Restaurant> restaurants = restaurantService.getByName(name);
        return ResponseEntity.ok(restaurants);
    }

    // get by Cuisine
    @GetMapping("/cuisine/{cuisine}")
    public ResponseEntity<List<Restaurant>> getByCuisine(@PathVariable String cuisine) {
        List<Restaurant> restaurants = restaurantService.getByCuisine(cuisine);
        return ResponseEntity.ok(restaurants);
    }

    // get by Location
    @GetMapping("/location/{location}")
    public ResponseEntity<List<Restaurant>> getByLocation(@PathVariable String location) {
        List<Restaurant> restaurants = restaurantService.getByLocation(location);
        return ResponseEntity.ok(restaurants);
    }

    // get by Rating
    @GetMapping("/rating/{rating}")
    public ResponseEntity<?> getByRating(@PathVariable double rating) {
        if (rating < 0 || rating > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 0 and 5.");
        }
        List<Restaurant> restaurants = restaurantService.getByRating(rating);
        return ResponseEntity.ok(restaurants);
    }

    // get by Price Range
    @GetMapping("/price/{priceRange}")
    public ResponseEntity<List<Restaurant>> getByPriceRange(@PathVariable String priceRange) {
        List<Restaurant> restaurants = restaurantService.getByPriceRange(priceRange);
        return ResponseEntity.ok(restaurants);
    }

    // get by Pincode
    @GetMapping("/pincode/{pincode}")
    public ResponseEntity<List<Map<String, String>>> getByPincode(@PathVariable String pincode) {
        List<Map<String, String>> restaurants = restaurantService.getByPincode(pincode);

        if (restaurants.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 if no results are found
        }

        return ResponseEntity.ok(restaurants);
    }
}
