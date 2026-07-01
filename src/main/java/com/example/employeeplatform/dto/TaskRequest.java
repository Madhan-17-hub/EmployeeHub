package com.example.employeeplatform.dto;
import com.example.employeeplatform.entity.*;
import java.time.LocalDate;
import java.math.BigDecimal;
public record TaskRequest(String title,String description,Long projectId,Long assignedTo,Priority priority,TaskStatus status,Integer progress,BigDecimal estimatedHours,LocalDate dueDate) {}
