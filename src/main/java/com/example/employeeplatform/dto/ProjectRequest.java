package com.example.employeeplatform.dto;
import com.example.employeeplatform.entity.*;
import java.time.LocalDate;
public record ProjectRequest(String projectName,String projectCode,String description,ProjectStatus status,Priority priority,LocalDate startDate,LocalDate endDate,Long managerId,Long departmentId,Integer progress) {}
