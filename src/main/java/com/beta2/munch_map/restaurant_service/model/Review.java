package com.beta2.munch_map.restaurant_service.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_restaurant_id", columnList = "restaurant_id"),
        @Index(name = "idx_user_id", columnList = "user_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "unique_user_restaurant", columnNames = {"restaurant_id", "user_id"})
})
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Many reviews belong to one restaurant
    @JoinColumn(name = "restaurant_id", nullable = false)
    @JsonIgnoreProperties("reviews")
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY) // Link review to a user
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties("reviews")
    private User user;

    @Column(nullable = false)
    private Integer rating; // 1 to 5 stars

    @Column(length = 1000)
    private String comment;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private boolean isActive = true;

    @ElementCollection
    private List<String> images;

    public LocalDateTime getDeletionTimestamp() {
        return deletionTimestamp;
    }

    public void setDeletionTimestamp(LocalDateTime deletionTimestamp) {
        this.deletionTimestamp = deletionTimestamp;
    }

    @Column(nullable = true)
    private LocalDateTime deletionTimestamp;

    // Constructors
    public Review() {}

    public Review(Restaurant restaurant, User user, Integer rating, String comment) {
        this.restaurant = restaurant;
        this.user = user;
        this.rating = rating;
        this.comment = comment;
        this.isActive = true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public void setUpdatedAt(LocalDateTime now) {
    }

    public void setImages(List<String> newImageUrls) {
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<String> getImages() {
        return images;
    }

}
