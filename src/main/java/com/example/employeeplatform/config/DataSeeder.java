package com.example.employeeplatform.config;

import com.example.employeeplatform.entity.Department;
import com.example.employeeplatform.entity.Role;
import com.example.employeeplatform.entity.User;
import com.example.employeeplatform.entity.UserStatus;
import com.example.employeeplatform.repository.DepartmentRepository;
import com.example.employeeplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {
    private final UserRepository users;
    private final DepartmentRepository departments;
    private final PasswordEncoder encoder;

    @Bean
    CommandLineRunner seed() {
        return args -> {
            Department engineering = departments.findAll().stream()
                    .filter(d -> "Engineering".equals(d.getName()))
                    .findFirst()
                    .orElseGet(() -> departments.save(makeDepartment("Engineering", "Software Engineering")));

            Department qa = departments.findAll().stream()
                    .filter(d -> "Quality Assurance".equals(d.getName()))
                    .findFirst()
                    .orElseGet(() -> departments.save(makeDepartment("Quality Assurance", "Quality and Testing")));

            upsert("admin@company.com", "System Admin", "Admin@123", "Platform Administrator", Role.ADMIN, engineering);
            upsert("manager@company.com", "Priya Sharma", "Manager@123", "Engineering Manager", Role.MANAGER, engineering);
            upsert("employee@company.com", "Rahul Kumar", "Employee@123", "Software Engineer", Role.EMPLOYEE, engineering);
            upsert("divya@company.com", "Divya Raj", "Employee@123", "QA Engineer", Role.EMPLOYEE, qa);

            System.out.println("EmployeeHub users initialized successfully");
            System.out.println("ADMIN   : admin@company.com / Admin@123");
            System.out.println("MANAGER : manager@company.com / Manager@123");
            System.out.println("RAHUL   : employee@company.com / Employee@123");
            System.out.println("DIVYA   : divya@company.com / Employee@123");
        };
    }

    private void upsert(String email, String name, String password, String designation,
                        Role role, Department department) {
        User user = users.findByEmail(email).orElseGet(User::new);
        user.setFullName(name);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setDesignation(designation);
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        user.setDepartment(department);
        if (user.getJoinedDate() == null) user.setJoinedDate(LocalDate.now());
        users.save(user);
    }

    private Department makeDepartment(String name, String description) {
        Department department = new Department();
        department.setName(name);
        department.setDescription(description);
        return department;
    }
}
