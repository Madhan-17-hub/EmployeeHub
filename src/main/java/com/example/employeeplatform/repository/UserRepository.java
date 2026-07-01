package com.example.employeeplatform.repository;

import com.example.employeeplatform.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.*;

public interface UserRepository extends JpaRepository<User,Long> {
    @EntityGraph(attributePaths = {"department"})
    List<User> findAll();

    Optional<User> findByEmail(String email);
    long countByRole(Role role);
    long countByStatus(UserStatus status);
    long countByDepartmentId(Long departmentId);
}
