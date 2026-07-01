package com.example.employeeplatform.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.time.*;

@Entity @Table(name="users")
@Getter @Setter @NoArgsConstructor
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="user_id") private Long id;
    @Column(name="full_name", nullable=false) private String fullName;
    @Column(nullable=false, unique=true) private String email;
    @JsonIgnore @Column(nullable=false) private String password;
    private String phone;
    private String designation;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role = Role.EMPLOYEE;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private UserStatus status = UserStatus.ACTIVE;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="department_id") private Department department;
    @JsonIgnore @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="manager_id") private User manager;
    @Column(name="joined_date") private LocalDate joinedDate;
    @Column(name="last_login") private LocalDateTime lastLogin;
    @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name="updated_at") private LocalDateTime updatedAt = LocalDateTime.now();
}
