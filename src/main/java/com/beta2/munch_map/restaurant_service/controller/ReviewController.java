package com.beta2.munch_map.restaurant_service.controller;

import java.util.List;

import com.beta2.munch_map.restaurant_service.dto.ReviewDto;
import com.beta2.munch_map.restaurant_service.model.User;
import com.beta2.munch_map.restaurant_service.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.beta2.munch_map.restaurant_service.model.Review;
import com.beta2.munch_map.restaurant_service.service.ReviewService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final Logger logger = LoggerFactory.getLogger(ReviewController.class);
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    // Constructor-based injection of ReviewService
//    public ReviewController(ReviewService reviewService) {
//        this.reviewService = reviewService;
//    }


    // Delete (soft delete) a review
    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, @AuthenticationPrincipal UserDetails userDetails) {
        reviewService.deleteReview(reviewId, userDetails);
        return ResponseEntity.ok("Review has been deleted.");
    }

    // Get single review by ID
//    @GetMapping("/{id}")
//    public ResponseEntity<Review> getSingleReview(@PathVariable Long id) {
//        logger.info("Received request to get a single review with ID: " + id);
//        return ResponseEntity.ok(reviewService.getReview(id));
//    }

    // Get reviews for a specific restaurant
//    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Review>> getRestaurantReviews(@PathVariable Long restaurantId) {
        logger.info("Received request to get reviews for restaurant with ID: " + restaurantId);
        return ResponseEntity.ok(reviewService.getRestaurantReviews(restaurantId));
    }

    // Get reviews for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(@PathVariable Long userId) {
        logger.info("Received request to get reviews by user with ID: " + userId);
        return ResponseEntity.ok(reviewService.getUserReviews(userId));
    }

    @PostMapping("/{restaurantId}/reviews")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> addOrUpdateReview(
            @PathVariable Long restaurantId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("review") ReviewDto reviewDto,
            @RequestPart(value = "newImages", required = false) List<MultipartFile> newImages) {

        // Get the logged-in user
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        // Set the new images in the DTO
        reviewDto.setNewImages(newImages);

        ReviewDto savedReview = reviewService.addOrUpdateReview(restaurantId, user.getId(), reviewDto);
        return ResponseEntity.ok(savedReview);
    }

    @GetMapping("/{reviewId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<ReviewDto> getReview(@PathVariable Long reviewId, @AuthenticationPrincipal UserDetails userDetails) {
        ReviewDto reviewDto = reviewService.getReview(reviewId, userDetails);
        return ResponseEntity.ok(reviewDto);
    }

    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public ResponseEntity<List<ReviewDto>> getAllReviewsByRestaurant(@PathVariable Long restaurantId) {
        List<ReviewDto> reviews = reviewService.getAllReviewsByRestaurant(restaurantId);
        return ResponseEntity.ok(reviews);
    }

}
