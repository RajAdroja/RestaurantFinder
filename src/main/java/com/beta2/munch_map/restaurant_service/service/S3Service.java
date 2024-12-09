package com.beta2.munch_map.restaurant_service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Client s3Client;
    private final String bucketName = "your-bucket-name";

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadImage(MultipartFile file) {
        try {
            // Generate a unique file name
            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

            // Upload to S3
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build(),
                    Paths.get(file.getOriginalFilename()) // Use a temporary file path for upload
            );

            // Return the S3 public URL
            return String.format("https://%s.s3.amazonaws.com/%s", bucketName, fileName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image to S3", e);
        }
    }

    // Deletes an image from S3
    public void deleteImage(String imageUrl) {
        // Extract the key (file name) from the URL
        String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete image from S3", e);
        }
    }
}
