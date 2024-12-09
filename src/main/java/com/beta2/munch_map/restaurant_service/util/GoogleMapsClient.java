package com.beta2.munch_map.restaurant_service.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class GoogleMapsClient {

    @Value("${google.maps.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String, String>> getRestaurantsFromGoogle(String pincode) {
        String url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+" + pincode + "&key=" + apiKey;

        // Make API request
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        // Extract results from the response
        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");

        // Map results to only include name and address
        List<Map<String, String>> restaurantDetails = new ArrayList<>();
        for (Map<String, Object> result : results) {
            String name = (String) result.get("name");
            String address = (String) result.get("formatted_address");
            restaurantDetails.add(Map.of("name", name, "address", address));
        }

        return restaurantDetails;
    }
}
