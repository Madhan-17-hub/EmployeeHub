package com.example.employeeplatform.repository;

import com.example.employeeplatform.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.time.LocalDate;
import java.util.*;

public interface TaskRepository extends JpaRepository<Task,Long> {
    @EntityGraph(attributePaths = {"assignedTo", "assignedTo.department"})
    List<Task> findByAssignedToId(Long userId);

    @Override
    @EntityGraph(attributePaths = {"assignedTo", "assignedTo.department"})
    List<Task> findAll();
    long countByStatus(TaskStatus status);
    long countByAssignedToId(Long userId);
    long countByAssignedToIdAndStatus(Long userId, TaskStatus status);
    long countByDueDateBetweenAndStatusNot(LocalDate start, LocalDate end, TaskStatus excludedStatus);
    long countByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus excludedStatus);
}
