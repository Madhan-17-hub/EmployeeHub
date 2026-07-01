package com.example.employeeplatform.controller;

import com.example.employeeplatform.dto.TaskRequest;
import com.example.employeeplatform.entity.*;
import com.example.employeeplatform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController @RequestMapping("/api/tasks") @RequiredArgsConstructor
public class TaskController {
    private final TaskRepository tasks;
    private final UserRepository users;
    private final ProjectRepository projects;

    @GetMapping
    public List<Task> all(Authentication authentication) {
        User current = users.findByEmail(authentication.getName()).orElseThrow();
        if (current.getRole() == Role.EMPLOYEE) {
            return tasks.findByAssignedToId(current.getId());
        }
        return tasks.findAll();
    }

    @GetMapping("/mine")
    public List<Task> mine(Authentication authentication) {
        User current = users.findByEmail(authentication.getName()).orElseThrow();
        return tasks.findByAssignedToId(current.getId());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Task create(@RequestBody TaskRequest r, Authentication authentication) {
        Task t = new Task();
        apply(t, r);
        t.setCreatedBy(users.findByEmail(authentication.getName()).orElseThrow());
        normalizeStatusFields(t);
        return tasks.save(t);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Task update(@PathVariable Long id, @RequestBody TaskRequest r) {
        Task t = tasks.findById(id).orElseThrow();
        apply(t, r);
        normalizeStatusFields(t);
        return tasks.save(t);
    }

    @PatchMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id,
                             @RequestBody Map<String, String> body,
                             Authentication authentication) {
        User current = users.findByEmail(authentication.getName()).orElseThrow();
        Task task = tasks.findById(id).orElseThrow();

        String statusValue = body.get("status");
        if (statusValue == null || statusValue.isBlank()) {
            throw new IllegalArgumentException("Status is required");
        }

        TaskStatus newStatus;
        try {
            newStatus = TaskStatus.valueOf(statusValue.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid task status: " + statusValue);
        }

        if (current.getRole() == Role.EMPLOYEE) {
            if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(current.getId())) {
                throw new org.springframework.security.access.AccessDeniedException("Employee can update only their own tasks");
            }

            TaskStatus oldStatus = task.getStatus();
            boolean validEmployeeTransition =
                    (oldStatus == TaskStatus.TODO || oldStatus == TaskStatus.ASSIGNED) && newStatus == TaskStatus.IN_PROGRESS
                    || oldStatus == TaskStatus.IN_PROGRESS && newStatus == TaskStatus.COMPLETED;

            if (!validEmployeeTransition) {
                throw new org.springframework.security.access.AccessDeniedException("Invalid employee task status transition");
            }
        }

        task.setStatus(newStatus);
        normalizeStatusFields(task);
        return tasks.save(task);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        tasks.deleteById(id);
    }

    private void apply(Task t, TaskRequest r) {
        if (r.title() == null || r.title().isBlank()) {
            throw new IllegalArgumentException("Task title is required");
        }
        if (r.progress() != null && (r.progress() < 0 || r.progress() > 100)) {
            throw new IllegalArgumentException("Task progress must be between 0 and 100");
        }

        t.setTitle(r.title().trim());
        t.setDescription(r.description());
        t.setPriority(r.priority() == null ? Priority.MEDIUM : r.priority());
        t.setStatus(r.status() == null ? TaskStatus.TODO : r.status());
        t.setProgress(r.progress() == null ? 0 : r.progress());
        t.setEstimatedHours(r.estimatedHours());
        t.setDueDate(r.dueDate());

        if (r.assignedTo() != null) {
            User assignee = users.findById(r.assignedTo()).orElseThrow();
            if (assignee.getRole() != Role.EMPLOYEE) {
                throw new IllegalArgumentException("Tasks can only be assigned to employees");
            }
            t.setAssignedTo(assignee);
        } else {
            t.setAssignedTo(null);
        }

        if (r.projectId() != null) {
            t.setProject(projects.findById(r.projectId()).orElseThrow());
        } else {
            t.setProject(null);
        }
    }

    private void normalizeStatusFields(Task task) {
        TaskStatus status = task.getStatus();
        if (status == TaskStatus.COMPLETED) {
            task.setProgress(100);
            if (task.getCompletedAt() == null) {
                task.setCompletedAt(LocalDateTime.now());
            }
        } else if (status == TaskStatus.IN_PROGRESS) {
            if (task.getProgress() == null || task.getProgress() == 0) {
                task.setProgress(1);
            }
            task.setCompletedAt(null);
        } else {
            task.setCompletedAt(null);
        }
    }
}
