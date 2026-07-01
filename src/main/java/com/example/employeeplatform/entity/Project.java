package com.example.employeeplatform.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.time.*;

@Entity @Table(name="projects")
@Getter @Setter @NoArgsConstructor
public class Project {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="project_id") private Long id;
    @Column(name="project_name", nullable=false) private String projectName;
    @Column(name="project_code", nullable=false, unique=true) private String projectCode;
    @Column(columnDefinition="TEXT") private String description;
    @Enumerated(EnumType.STRING) private ProjectStatus status = ProjectStatus.PLANNING;
    @Enumerated(EnumType.STRING) private Priority priority = Priority.MEDIUM;
    @Column(name="start_date") private LocalDate startDate;
    @Column(name="end_date") private LocalDate endDate;
    @JsonIgnore @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="manager_id") private User manager;
    @JsonIgnore @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="department_id") private Department department;
    private Integer progress = 0;
    @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name="updated_at") private LocalDateTime updatedAt = LocalDateTime.now();
}
