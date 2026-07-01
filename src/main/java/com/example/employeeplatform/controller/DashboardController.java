package com.example.employeeplatform.controller;

import com.example.employeeplatform.entity.Role;
import com.example.employeeplatform.entity.TaskStatus;
import com.example.employeeplatform.entity.UserStatus;
import com.example.employeeplatform.repository.ProjectRepository;
import com.example.employeeplatform.repository.TaskRepository;
import com.example.employeeplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository users;
    private final TaskRepository tasks;
    private final ProjectRepository projects;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public Map<String, Object> summary() {

        LocalDate today = LocalDate.now();
        LocalDate weekEnd = today.plusDays(7);

        Map<String, Object> result = new HashMap<>();

        result.put("employees",
                users.countByRole(Role.EMPLOYEE));

        result.put("managers",
                users.countByRole(Role.MANAGER));

        result.put("activeUsers",
                users.countByStatus(UserStatus.ACTIVE));

        result.put("projects",
                projects.count());

        result.put("tasks",
                tasks.count());

        result.put("completed",
                tasks.countByStatus(TaskStatus.COMPLETED));

        result.put("inProgress",
                tasks.countByStatus(TaskStatus.IN_PROGRESS));

        result.put("blocked",
                tasks.countByStatus(TaskStatus.BLOCKED));

        result.put("todo",
                tasks.countByStatus(TaskStatus.TODO)
                        + tasks.countByStatus(TaskStatus.ASSIGNED));

        result.put("dueThisWeek",
                tasks.countByDueDateBetweenAndStatusNot(
                        today,
                        weekEnd,
                        TaskStatus.COMPLETED));

        result.put("overdue",
                tasks.countByDueDateBeforeAndStatusNot(
                        today,
                        TaskStatus.COMPLETED));

        return result;
    }
}