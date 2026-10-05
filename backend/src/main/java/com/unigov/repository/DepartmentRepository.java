package com.unigov.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.unigov.entity.Department;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    Optional<Department> findByCode(String code);

    boolean existsByCode(String code);
}