package com.example.localservice.controller;

import com.example.localservice.model.Provider;
import com.example.localservice.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*")
public class ProviderController {
    @Autowired
    private ProviderService providerService;

    @PostMapping("/add")
    public ResponseEntity<Provider> addProvider(@RequestBody Provider provider) {
        return ResponseEntity.ok(providerService.addProvider(provider));
    }

    @GetMapping
    public ResponseEntity<List<Provider>> getAllProviders(
            @RequestParam(required = false) String serviceType,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(providerService.searchProviders(serviceType, location));
    }

    @GetMapping("/service/{type}")
    public ResponseEntity<List<Provider>> getProvidersByType(@PathVariable String type) {
        return ResponseEntity.ok(providerService.searchProviders(type, null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Provider> getProviderById(@PathVariable Long id) {
        Provider provider = providerService.getProviderById(id);
        if (provider != null) {
            return ResponseEntity.ok(provider);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Provider> getProviderByUserId(@PathVariable Long userId) {
        Provider provider = providerService.getProviderByUserId(userId);
        if (provider != null) {
            return ResponseEntity.ok(provider);
        }
        return ResponseEntity.notFound().build();
    }
}
