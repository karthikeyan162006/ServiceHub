package com.example.localservice.repository;

import com.example.localservice.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
    List<Provider> findByServiceTypeContainingIgnoreCaseOrLocationContainingIgnoreCase(String serviceType, String location);
    List<Provider> findByServiceTypeIgnoreCase(String serviceType);
    Optional<Provider> findByUserId(Long userId);
}
