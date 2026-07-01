DROP DATABASE IF EXISTS employeeplatform;
CREATE DATABASE employeeplatform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE employeeplatform;

CREATE TABLE departments (
 department_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL UNIQUE,
 description VARCHAR(500),
 department_head_id BIGINT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
 user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 full_name VARCHAR(150) NOT NULL,
 email VARCHAR(150) NOT NULL UNIQUE,
 password VARCHAR(255) NOT NULL,
 phone VARCHAR(20),
 designation VARCHAR(100),
 role ENUM('ADMIN','MANAGER','EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
 status ENUM('ACTIVE','INACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
 department_id BIGINT NULL,
 manager_id BIGINT NULL,
 profile_image VARCHAR(500),
 joined_date DATE,
 last_login TIMESTAMP NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
 FOREIGN KEY (manager_id) REFERENCES users(user_id) ON DELETE SET NULL
);

ALTER TABLE departments ADD CONSTRAINT fk_department_head
 FOREIGN KEY (department_head_id) REFERENCES users(user_id) ON DELETE SET NULL;

CREATE TABLE projects (
 project_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 project_name VARCHAR(200) NOT NULL,
 project_code VARCHAR(50) NOT NULL UNIQUE,
 description TEXT,
 status ENUM('PLANNING','ACTIVE','ON_HOLD','COMPLETED','CANCELLED') DEFAULT 'PLANNING',
 priority ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
 start_date DATE,
 end_date DATE,
 manager_id BIGINT,
 department_id BIGINT,
 progress INT DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (manager_id) REFERENCES users(user_id) ON DELETE SET NULL,
 FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

CREATE TABLE project_members (
 project_member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT NOT NULL,
 user_id BIGINT NOT NULL,
 assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
 UNIQUE (project_id,user_id)
);

CREATE TABLE tasks (
 task_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(255) NOT NULL,
 description TEXT,
 project_id BIGINT,
 assigned_to BIGINT,
 created_by BIGINT,
 priority ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
 status ENUM('TODO','ASSIGNED','IN_PROGRESS','BLOCKED','UNDER_REVIEW','COMPLETED','REOPENED') DEFAULT 'TODO',
 progress INT DEFAULT 0,
 estimated_hours DECIMAL(8,2),
 actual_hours DOUBLE,
 start_date DATE,
 due_date DATE,
 completed_at TIMESTAMP NULL,
 blocked_reason VARCHAR(500),
 task_score DECIMAL(5,2),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE SET NULL,
 FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL,
 FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE task_comments (
 comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 task_id BIGINT NOT NULL,
 user_id BIGINT NOT NULL,
 comment TEXT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE task_history (
 history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 task_id BIGINT NOT NULL,
 user_id BIGINT,
 action VARCHAR(100) NOT NULL,
 old_value VARCHAR(500),
 new_value VARCHAR(500),
 description VARCHAR(1000),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE task_reviews (
 review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 task_id BIGINT NOT NULL,
 reviewer_id BIGINT NOT NULL,
 rating DECIMAL(3,2),
 feedback TEXT,
 review_status ENUM('APPROVED','REJECTED','CHANGES_REQUESTED') NOT NULL,
 reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
 FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE performance_records (
 performance_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT NOT NULL,
 evaluation_month DATE NOT NULL,
 tasks_assigned INT DEFAULT 0,
 tasks_completed INT DEFAULT 0,
 tasks_overdue INT DEFAULT 0,
 completion_rate DECIMAL(5,2) DEFAULT 0,
 on_time_rate DECIMAL(5,2) DEFAULT 0,
 average_completion_hours DECIMAL(8,2) DEFAULT 0,
 quality_rating DECIMAL(3,2) DEFAULT 0,
 manager_rating DECIMAL(3,2) DEFAULT 0,
 performance_score DECIMAL(5,2) DEFAULT 0,
 manager_feedback TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
 UNIQUE (user_id,evaluation_month)
);

CREATE TABLE notifications (
 notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT NOT NULL,
 title VARCHAR(200) NOT NULL,
 message VARCHAR(1000) NOT NULL,
 type ENUM('TASK_ASSIGNED','TASK_UPDATED','TASK_OVERDUE','TASK_COMPLETED','TASK_REVIEW','FEEDBACK','PROJECT','SYSTEM') DEFAULT 'SYSTEM',
 is_read BOOLEAN DEFAULT FALSE,
 related_task_id BIGINT,
 related_project_id BIGINT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
 FOREIGN KEY (related_task_id) REFERENCES tasks(task_id) ON DELETE SET NULL,
 FOREIGN KEY (related_project_id) REFERENCES projects(project_id) ON DELETE SET NULL
);

CREATE TABLE audit_logs (
 audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT,
 action VARCHAR(100) NOT NULL,
 entity_type VARCHAR(100),
 entity_id BIGINT,
 description VARCHAR(1000),
 ip_address VARCHAR(50),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE time_entries (
 time_entry_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 task_id BIGINT NOT NULL,
 user_id BIGINT NOT NULL,
 start_time DATETIME NOT NULL,
 end_time DATETIME,
 duration_minutes INT DEFAULT 0,
 description VARCHAR(500),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE attachments (
 attachment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
 task_id BIGINT,
 uploaded_by BIGINT,
 file_name VARCHAR(255) NOT NULL,
 file_path VARCHAR(500) NOT NULL,
 file_type VARCHAR(100),
 file_size BIGINT,
 uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
 FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);

INSERT INTO departments(name,description) VALUES
('Engineering','Software development and engineering'),
('Quality Assurance','Software testing and quality assurance'),
('Human Resources','Employee and HR operations'),
('Finance','Financial operations and accounting'),
('Marketing','Marketing and business growth');

SHOW TABLES;
