package com.beta2.munch_map.restaurant_service.controller;

import com.beta2.munch_map.restaurant_service.model.User;
import com.beta2.munch_map.restaurant_service.model.enums.Role;
import com.beta2.munch_map.restaurant_service.repository.UserRepository;
import com.beta2.munch_map.restaurant_service.service.EmailService;
import com.beta2.munch_map.restaurant_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            return ResponseEntity.status(400).body("Email and password are required.");
        }

        try {
            User user = userRepository.findByEmail(email);

            if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getRole().name());
            response.put("expiresIn", "86400"); // 1 day in seconds
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        String name = registerRequest.get("name");
        String email = registerRequest.get("email");
        String password = registerRequest.get("password");
        String role = registerRequest.get("role"); // Should be either USER or BUSINESS_OWNER

        if (name == null || email == null || password == null || role == null) {
            return ResponseEntity.status(400).body("Name, email, password, and role are required.");
        }

        // Check if the user already exists
        if (userRepository.findByEmail(email) != null) {
            return ResponseEntity.status(400).body("Email is already registered.");
        }

        try {
            // Create a new User entity
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password)); // Encrypt the password
            user.setRole(Role.valueOf(role.toUpperCase())); // Convert string role to enum
            user.setVerified(false); // Initially not verified

            // Generate and set OTP
            String otp = generateOtp();
            user.setOtp(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(5)); // OTP valid for 5 minutes

            // Save the user to the database
            userRepository.save(user);

            // Send OTP email
            emailService.sendOtpEmail(email, otp);

            return ResponseEntity.status(201).body("User registered successfully. Please verify your email using the OTP sent.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("Invalid role. Allowed roles: USER, BUSINESS_OWNER.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found.");
        }

        if (user.getOtp() == null || !user.getOtp().equals(otp) || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body("Invalid or expired OTP.");
        }

        // Mark user as verified
        user.setVerified(true);
        user.setOtp(null); // Clear OTP
        user.setOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("Email verified successfully.");
    }

    private String generateOtp() {
        int otp = (int) (Math.random() * 900000) + 100000; // Generate 6-digit OTP
        return String.valueOf(otp);
    }
}

