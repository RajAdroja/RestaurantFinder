package com.beta2.munch_map.restaurant_service.dto;

import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class ReviewDto {

    private Integer rating;

    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String comment;

    private List<String> images; // Existing image URLs

    private List<String> imagesToRemove; // URLs of images to remove

    private List<MultipartFile> newImages; // New images to upload

    // Getters and Setters

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public List<String> getImagesToRemove() {
        return imagesToRemove;
    }

    public void setImagesToRemove(List<String> imagesToRemove) {
        this.imagesToRemove = imagesToRemove;
    }

    public List<MultipartFile> getNewImages() {
        return newImages;
    }

    public void setNewImages(List<MultipartFile> newImages) {
        this.newImages = newImages;
    }
}
