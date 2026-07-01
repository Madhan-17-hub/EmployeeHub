# EmployeeHub — Employee Task & Performance Management System

This version is built **from the Spring Initializr project you uploaded** and uses your existing `employeeplatform_schema.sql` as the database source of truth.

## Stack
Java 17+ · Spring Boot 4.1.1 · Spring Security · JWT · JPA/Hibernate · MySQL · React/Vite

## Run database
Run `employeeplatform_schema.sql` in MySQL. It creates the `employeeplatform` database and your tables.

## Configure database
Open `src/main/resources/application.properties` and change `CHANGE_ME` to your MySQL password, or use PowerShell:

```powershell
$env:DB_PASSWORD="your_mysql_password"
```

## Run backend
From the project root:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend: `http://localhost:8080`

If the users table is empty, the seeder creates:
- `admin@company.com` / `Admin@123`
- `manager@company.com` / `Manager@123`
- `employee@company.com` / `Employee@123`
- `divya@company.com` / `Employee@123`

## Run frontend
Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## UI modules
Dashboard, tasks, projects, people, departments, performance, search, KPIs, task progress, priority/status indicators, responsive layout, dark mode, notifications UI, and role-aware login.

## Role permissions
- **ADMIN:** dashboard, tasks, projects, people, departments, performance, settings; can delete tasks/projects and create users/departments.
- **MANAGER:** dashboard, tasks, projects, people, performance; can create/update tasks and projects.
- **EMPLOYEE:** dashboard and assigned tasks only; can start assigned TODO/ASSIGNED tasks and complete IN_PROGRESS tasks.

## Important
Hibernate is configured with `validate`, so the backend will **not modify your existing SQL schema**. The schema uses `DOUBLE` for `tasks.actual_hours` to match the Java `Double` mapping.

The frontend no longer uses fake fallback dashboard/project/department data. API failures are shown instead of silently displaying demo values.
