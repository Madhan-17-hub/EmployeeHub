package com.example.employeeplatform.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.time.*;
import java.math.BigDecimal;

@Entity @Table(name="tasks")
@Getter @Setter @NoArgsConstructor
public class Task {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="task_id") private Long id;
    @Column(nullable=false) private String title;
    @Column(columnDefinition="TEXT") private String description;
    @JsonIgnore @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="project_id") private Project project;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="assigned_to") private User assignedTo;
    @JsonIgnore @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="created_by") private User createdBy;
    @Enumerated(EnumType.STRING) private Priority priority = Priority.MEDIUM;
    @Enumerated(EnumType.STRING) private TaskStatus status = TaskStatus.TODO;
    private Integer progress = 0;
    @Column(name="estimated_hours", precision=8, scale=2) private BigDecimal estimatedHours;
    @Column(name="actual_hours") private Double actualHours;
    @Column(name="start_date") private LocalDate startDate;
    @Column(name="due_date") private LocalDate dueDate;
    @Column(name="completed_at") private LocalDateTime completedAt;
    @Column(name="blocked_reason") private String blockedReason;
    @Column(name="task_score", precision=5, scale=2) private BigDecimal taskScore;
    @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name="updated_at") private LocalDateTime updatedAt = LocalDateTime.now();

    @JsonProperty("projectId")
    public Long getProjectId() {
        return project == null ? null : project.getId();
    }
}
