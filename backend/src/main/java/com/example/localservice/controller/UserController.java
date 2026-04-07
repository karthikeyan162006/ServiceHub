package com.example.localservice.controller;

import com.example.localservice.dto.OtpRequestDTO;
import com.example.localservice.dto.OtpVerificationDTO;
import com.example.localservice.model.User;
import com.example.localservice.service.UserService;
import com.example.localservice.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody OtpRequestDTO otpRequest) {
        String email = otpRequest.getEmail();
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email address is required");
        }
        try {
            otpService.generateAndSendEmailOtp(email);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully to your email"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to send Email OTP: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationDTO verificationRequest) {
        String email = verificationRequest.getEmail();
        String otp = verificationRequest.getOtp();
        
        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and OTP are required"));
        }

        try {
            boolean isValid = otpService.validateEmailOtp(email, otp);
            if (isValid) {
                return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Validate required fields
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            if (user.getOtp() == null || user.getOtp().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Verification OTP is required"));
            }
            if (user.getName() == null || user.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Full name is required"));
            }
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }
            if (user.getPhone() == null || user.getPhone().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Phone number is required"));
            }
            if (user.getAddress() == null || user.getAddress().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Address is required"));
            }
            
            boolean isOtpValid = otpService.validateEmailOtp(user.getEmail(), user.getOtp());
            if (!isOtpValid) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP"));
            }

            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        User user = userService.loginUser(email, password);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody OtpRequestDTO otpRequest) {
        String email = otpRequest.getEmail();
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        try {
            otpService.generateAndSendEmailOtp(email);
            return ResponseEntity.ok(Map.of("message", "OTP sent to your email successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to send Email OTP: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (email == null || otp == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email, OTP, and new password are required"));
        }

        try {
            boolean isOtpValid = otpService.validateEmailOtp(email, otp);
            if (!isOtpValid) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP"));
            }

            User updatedUser = userService.updatePassword(email, newPassword);
            if (updatedUser == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found with this email"));
            }

            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

