package com.beta2.munch_map.restaurant_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:postgresql://localhost:5432/restaurantfinder_db",
    "spring.datasource.username=postgres",
    "spring.datasource.password=postgres"
})
class RestaurantServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
