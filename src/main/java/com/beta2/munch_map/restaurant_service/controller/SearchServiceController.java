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
