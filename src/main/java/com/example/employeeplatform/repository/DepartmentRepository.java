package com.example.employeeplatform.repository;
import com.example.employeeplatform.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DepartmentRepository extends JpaRepository<Department,Long> {}
