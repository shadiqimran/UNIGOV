package com.unigov.service;

import com.unigov.entity.Service;
import com.unigov.repository.ServiceRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ServiceCatalogService {

    private final ServiceRepository serviceRepository;

    public ServiceCatalogService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public Optional<Service> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    public Optional<Service> getServiceByCode(String code) {
        return serviceRepository.findByCode(code);
    }

    public List<Service> getServicesByDepartment(Long departmentId) {
        return serviceRepository.findByDepartmentId(departmentId);
    }
}
