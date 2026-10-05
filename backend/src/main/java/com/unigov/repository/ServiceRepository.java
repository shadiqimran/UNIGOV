package com.unigov.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unigov.entity.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {

    Optional<Service> findByCode(String code);

    boolean existsByCode(String code);

    List<Service> findByDepartmentId(Long departmentId);
}