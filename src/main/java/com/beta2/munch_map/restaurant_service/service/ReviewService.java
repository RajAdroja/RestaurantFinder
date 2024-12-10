package com.beta2.munch_map.restaurant_service.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.beta2.munch_map.restaurant_service.dto.ReviewDto;
import com.beta2.munch_map.restaurant_service.mapper.ReviewMapper;
import com.beta2.munch_map.restaurant_service.model.User;
import com.beta2.munch_map.restaurant_service.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.beta2.munch_map.restaurant_service.exception.ResourceNotFoundException;
import com.beta2.munch_map.restaurant_service.model.Restaurant;
import com.beta2.munch_map.restaurant_service.model.Review;
import com.beta2.munch_map.restaurant_service.repository.RestaurantRepository;
import com.beta2.munch_map.restaurant_service.repository.ReviewRepository;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class ReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;

    @Autowired
    private S3Service s3Service;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ReviewMapper reviewMapper;

    // Constructor-based dependency injection
    public ReviewService(ReviewRepository reviewRepository, RestaurantRepository restaurantRepository) {
        this.reviewRepository = reviewRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public ReviewDto addOrUpdateReview(Long restaurantId, Long userId, ReviewDto reviewDto) {
        // Fetch restaurant and user
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if the review exists
        Optional<Review> existingReviewOpt = reviewRepository.findByRestaurantAndUser(restaurant, user);

        Review review;
        if (existingReviewOpt.isPresent()) {
            // Update existing review
            review = existingReviewOpt.get();
            review.setRating(reviewDto.getRating());
            review.setComment(reviewDto.getComment());
            handleReviewImageUpdates(review, reviewDto);
            review.setUpdatedAt(LocalDateTime.now());
        } else {
            // Create new review
            review = new Review(restaurant, user, reviewDto.getRating(), reviewDto.getComment());
            List<String> newImageUrls = uploadImages(reviewDto.getNewImages());
            review.setImages(newImageUrls);
        }

        // Save and return the review as DTO
        Review savedReview = reviewRepository.save(review);
        updateRestaurantAverageRating(restaurant);
        return reviewMapper.toDto(savedReview);
    }

    private void handleReviewImageUpdates(Review review, ReviewDto reviewDto) {
        // Remove specified images
        if (reviewDto.getImagesToRemove() != null) {
            reviewDto.getImagesToRemove().forEach(s3Service::deleteImage);
            review.getImages().removeAll(reviewDto.getImagesToRemove());
        }

        // Add new images
        if (reviewDto.getNewImages() != null && !reviewDto.getNewImages().isEmpty()) {
            List<String> newImageUrls = uploadImages(reviewDto.getNewImages());
            review.getImages().addAll(newImageUrls);
        }
    }

    private List<String> uploadImages(List<MultipartFile> newImages) {
        if (newImages == null || newImages.isEmpty()) {
            return Collections.emptyList();
        }

        return newImages.stream()
                .map(s3Service::uploadImage) // Upload to S3 and return URLs
                .toList();
    }


    public void deleteReview(Long reviewId, UserDetails userDetails) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        // Ensure the review belongs to the logged-in user or is deleted by an admin
        String loggedInEmail = userDetails.getUsername();
        if (!review.getUser().getEmail().equals(loggedInEmail) && !isAdmin(userDetails)) {
            throw new SecurityException("You are not authorized to delete this review.");
        }

        // Soft delete the review
        review.setActive(false);
        review.setDeletionTimestamp(LocalDateTime.now());
        reviewRepository.save(review);
    }


    public ReviewDto getReview(Long reviewId, UserDetails userDetails) {
        // Fetch the review by ID
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        // Check if the review is active or if the user is an admin
        if (!review.isActive() && !isAdmin(userDetails)) {
            throw new SecurityException("You are not authorized to view this review.");
        }

        // Map the review entity to a DTO
        return reviewMapper.toDto(review);
    }


    public List<Review> getRestaurantReviews(Long restaurantId) {
        return reviewRepository.findByRestaurant_IdAndIsActiveOrderByCreatedAtDesc(restaurantId, true);
    }

    public Double getRestaurantAverageRating(Long restaurantId) {
        Double avgRating = reviewRepository.getAverageRatingForRestaurant(restaurantId);
        return avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0;
    }

    public Long getRestaurantReviewCount(Long restaurantId) {
        return reviewRepository.countByRestaurant_IdAndIsActive(restaurantId, true);
    }

    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserIdAndIsActiveOrderByCreatedAtDesc(userId, true);
    }

    public boolean hasUserReviewedRestaurant(Long userId, Long restaurantId) {
        return reviewRepository.existsByRestaurant_IdAndUserIdAndIsActive(restaurantId, userId, true);
    }

    /**
     * Updates the average rating of a restaurant based on its reviews.
     */
    private void updateRestaurantAverageRating(Restaurant restaurant) {
        // Fetch all active reviews for the restaurant
        List<Review> activeReviews = reviewRepository.findByRestaurantAndIsActive(restaurant, true);

        // Calculate the average rating
        double averageRating = activeReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        // Update the restaurant's average rating
        restaurant.setAverageRating(averageRating);
        restaurantRepository.save(restaurant);
    }


    @Transactional(readOnly = true)
    public Double verifyRestaurantRating(Long restaurantId) {
        List<Review> activeReviews = reviewRepository
            .findByRestaurant_IdAndIsActiveOrderByCreatedAtDesc(restaurantId, true);
        
        if (activeReviews.isEmpty()) {
            return 0.0;
        }
        
        double sum = activeReviews.stream()
            .mapToInt(Review::getRating)
            .sum();
        
        return Math.round((sum / activeReviews.size()) * 10.0) / 10.0;
    }

//    private void validateReview(Review review) {
//		if (review.getRestaurant() == null || review.getRestaurant().getId() == null) {
//			throw new IllegalArgumentException("Invalid Restaurant");
//		}
//
//		if (review.getUserId() == null) {
//			throw new IllegalArgumentException("User ID cannot be null");
//		}
//
//		if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
//			throw new IllegalArgumentException("Rating must be between 1 and 5");
//		}
//
//		if (review.getComment() != null && review.getComment().length() > 1000) {
//			throw new IllegalArgumentException("Comment cannot exceed 1000 characters");
//		}
//	}

	private void updateReviewDetails(Review existing, Review updated) {
		if (updated.getRating() != null) {
			existing.setRating(updated.getRating());
		}
		
		if (updated.getComment() != null) {
			existing.setComment(updated.getComment());
		}
	}

    public List<ReviewDto> getAllReviewsByRestaurant(Long restaurantId) {
        // Fetch active reviews for the restaurant
        List<Review> reviews = reviewRepository.findAllActiveByRestaurantId(restaurantId);

        // Map entities to DTOs
        return reviews.stream()
                .map(reviewMapper::toDto)
                .toList();
    }

    private boolean isAdmin(UserDetails userDetails) {
        return userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ADMIN"));
    }

}