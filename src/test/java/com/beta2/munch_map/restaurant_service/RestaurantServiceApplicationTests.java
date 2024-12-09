package com.beta2.munch_map.restaurant_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:postgresql://localhost:5432/reviews_rating_db",
    "spring.datasource.username=postgres",
    "spring.datasource.password=root"
})
class RestaurantServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
