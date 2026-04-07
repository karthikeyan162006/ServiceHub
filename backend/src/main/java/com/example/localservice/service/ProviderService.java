package com.example.localservice.service;

import com.example.localservice.model.Provider;
import com.example.localservice.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderService {
    @Autowired
    private ProviderRepository providerRepository;

    public Provider addProvider(Provider provider) {
        return providerRepository.save(provider);
    }

    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    public List<Provider> searchProviders(String serviceType, String location) {
        if (serviceType != null && location != null) {
            return providerRepository.findByServiceTypeContainingIgnoreCaseOrLocationContainingIgnoreCase(serviceType, location);
        } else if (serviceType != null) {
            return providerRepository.findByServiceTypeIgnoreCase(serviceType);
        }
        return getAllProviders();
    }

    public Provider getProviderById(Long id) {
        return providerRepository.findById(id).orElse(null);
    }

    public Provider getProviderByUserId(Long userId) {
        return providerRepository.findByUserId(userId).orElse(null);
    }
}
