package com.example.employeeplatform.controller;

import com.example.employeeplatform.entity.Department;
import com.example.employeeplatform.entity.User;
import com.example.employeeplatform.repository.DepartmentRepository;
import com.example.employeeplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository departments;
    private final UserRepository users;

    @GetMapping
    public List<Department> all() {
        return departments.findAll();
    }

    @GetMapping("/{id}")
    public Department one(@PathVariable Long id) {
        return departments.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
    }

    @PostMapping
    public Department create(@RequestBody Department department) {

        if (department.getName() == null ||
                department.getName().trim().isEmpty()) {
            throw new RuntimeException("Department name is required");
        }

        return departments.save(department);
    }

    @PutMapping("/{id}")
    public Department update(
            @PathVariable Long id,
            @RequestBody Department request
    ) {

        Department department = departments.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));

        if (request.getName() != null &&
                !request.getName().trim().isEmpty()) {

            department.setName(request.getName().trim());
        }

        department.setDescription(request.getDescription());

        if (request.getDepartmentHead() != null &&
                request.getDepartmentHead().getId() != null) {

            User manager = users.findById(
                    request.getDepartmentHead().getId()
            ).orElseThrow(() ->
                    new RuntimeException("Manager not found"));

            department.setDepartmentHead(manager);
        } else {
            department.setDepartmentHead(null);
        }

        return departments.save(department);
    }

    @PatchMapping("/{id}/manager/{managerId}")
    public Department assignManager(
            @PathVariable Long id,
            @PathVariable Long managerId
    ) {

        Department department = departments.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Department not found"));

        User manager = users.findById(managerId)
                .orElseThrow(() ->
                        new RuntimeException("Manager not found"));

        department.setDepartmentHead(manager);

        return departments.save(department);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        if (!departments.existsById(id)) {
            throw new RuntimeException("Department not found");
        }

        departments.deleteById(id);
    }
}