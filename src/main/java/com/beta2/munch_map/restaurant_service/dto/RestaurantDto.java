package com.beta2.munch_map.restaurant_service.dto;

import com.beta2.munch_map.restaurant_service.model.enums.CuisineType;
import com.beta2.munch_map.restaurant_service.model.enums.FoodType;
import jakarta.validation.constraints.NotBlank; // For validating non-empty fields like name and address
import jakarta.validation.constraints.NotNull; // For ensuring non-null fields like cuisineType
import jakarta.validation.constraints.Size; // For limiting the length of strings like operatingHours and description
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List; // For handling the list of photo URLs

public class RestaurantDto {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Cuisine type is required")
    private CuisineType cuisineType;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private String priceLevel;

    @Size(max = 500, message = "Operating hours cannot exceed 500 characters")
    private String operatingHours;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private List<String> photos;

    private String contactInfo;

    private List<String> imagesToRemove; // List of URLs to delete
    private List<MultipartFile> newImages; // List of new images to upload

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private FoodType foodType; // New field

    // Getters and Setters
    public FoodType getFoodType() {
        return foodType;
    }

    public void setFoodType(FoodType foodType) {
        this.foodType = foodType;
    }

    // Getters and Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public CuisineType getCuisineType() {
        return cuisineType;
    }

    public void setCuisineType(CuisineType cuisineType) {
        this.cuisineType = cuisineType;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getPriceLevel() {
        return priceLevel;
    }

    public void setPriceLevel(String priceLevel) {
        this.priceLevel = priceLevel;
    }

    public String getOperatingHours() {
        return operatingHours;
    }

    public void setOperatingHours(String operatingHours) {
        this.operatingHours = operatingHours;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getPhotos() {
        return photos;
    }

    public void setPhotos(List<String> photos) {
        this.photos = photos;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
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
