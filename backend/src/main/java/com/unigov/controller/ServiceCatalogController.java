package com.unigov.controller;

import com.unigov.dto.ServiceResponse;
import com.unigov.entity.Service;
import com.unigov.service.ServiceCatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceCatalogController {

    private final ServiceCatalogService serviceCatalogService;

    public ServiceCatalogController(ServiceCatalogService serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }

    @GetMapping
    public List<ServiceResponse> getAllServices() {
        return serviceCatalogService.getAllServices()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getService(
            @PathVariable Long id) {
        return serviceCatalogService.getServiceById(id)
                .map(service -> ResponseEntity.ok(toResponse(service)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{departmentId}")
    public List<ServiceResponse> getServicesByDepartment(
            @PathVariable Long departmentId) {
        return serviceCatalogService.getServicesByDepartment(departmentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ServiceResponse toResponse(Service service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getCode(),
                service.getDescription(),
                service.getDepartment() != null
                        ? service.getDepartment().getName()
                        : null,
                service.getStatus()
        );
    }
}
