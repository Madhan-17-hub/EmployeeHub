package com.example.employeeplatform.controller;

import com.example.employeeplatform.dto.ProjectRequest;
import com.example.employeeplatform.entity.*;
import com.example.employeeplatform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/projects") @RequiredArgsConstructor
public class ProjectController {
    private final ProjectRepository projects;
    private final UserRepository users;
    private final DepartmentRepository departments;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public List<Project> all() {
        return projects.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Project create(@RequestBody ProjectRequest r) {
        return save(new Project(), r);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Project update(@PathVariable Long id, @RequestBody ProjectRequest r) {
        return save(projects.findById(id).orElseThrow(), r);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        projects.deleteById(id);
    }

    private Project save(Project p, ProjectRequest r) {
        if (r.projectName() == null || r.projectName().isBlank()) {
            throw new IllegalArgumentException("Project name is required");
        }
        if (r.projectCode() == null || r.projectCode().isBlank()) {
            throw new IllegalArgumentException("Project code is required");
        }
        if (r.progress() != null && (r.progress() < 0 || r.progress() > 100)) {
            throw new IllegalArgumentException("Project progress must be between 0 and 100");
        }
        if (r.startDate() != null && r.endDate() != null && r.endDate().isBefore(r.startDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        p.setProjectName(r.projectName().trim());
        p.setProjectCode(r.projectCode().trim().toUpperCase());
        p.setDescription(r.description());
        p.setStatus(r.status() == null ? ProjectStatus.PLANNING : r.status());
        p.setPriority(r.priority() == null ? Priority.MEDIUM : r.priority());
        p.setStartDate(r.startDate());
        p.setEndDate(r.endDate());
        p.setProgress(r.progress() == null ? 0 : r.progress());

        if (r.managerId() != null) {
            User manager = users.findById(r.managerId()).orElseThrow();
            if (manager.getRole() != Role.MANAGER) {
                throw new IllegalArgumentException("Project manager must have MANAGER role");
            }
            p.setManager(manager);
        } else {
            p.setManager(null);
        }

        if (r.departmentId() != null) {
            p.setDepartment(departments.findById(r.departmentId()).orElseThrow());
        } else {
            p.setDepartment(null);
        }

        return projects.save(p);
    }
}
