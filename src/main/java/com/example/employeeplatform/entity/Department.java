package com.example.employeeplatform.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="departments")
@Getter @Setter @NoArgsConstructor
public class Department {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="department_id") private Long id;
    @Column(nullable=false, unique=true) private String name;
    private String description;
    @JsonIgnore @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="department_head_id") private User departmentHead;
    @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
}
