package com.example.localservice.controller;

import com.example.localservice.model.Booking;
import com.example.localservice.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Booking>> getProviderBookings(@PathVariable Long providerId) {
        return ResponseEntity.ok(bookingService.getBookingsByProvider(providerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        Booking updatedBooking = bookingService.updateBookingStatus(id, status);
        if (updatedBooking != null) {
            return ResponseEntity.ok(updatedBooking);
        }
        return ResponseEntity.notFound().build();
    }
}
