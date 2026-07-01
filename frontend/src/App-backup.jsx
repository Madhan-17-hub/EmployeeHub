import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FolderKanban,
  Building2,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Plus,
  Search,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Menu,
  ChevronDown
} from "lucide-react";

import api from "./api";


const emptyStats = {
  employees: 0,
  managers: 0,
  activeUsers: 0,
  projects: 0,
  tasks: 0,
  completed: 0,
  inProgress: 0,
  blocked: 0,
  todo: 0,
  dueThisWeek: 0,
  overdue: 0
};


/* =====================================================
   LOGIN
===================================================== */

function Login({onLogin}){

  const [email, setEmail] = useState("admin@company.com");
  const [password, setPassword] = useState("Admin@123");
  const [err, setErr] = useState("");

  const nav = useNavigate();

  const submit = async (e) => {

    e.preventDefault();
    setErr("");

    try {

      const r = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token",r.data.token);
localStorage.setItem("user",JSON.stringify(r.data));
onLogin();
nav("/");

    } catch (x) {

      setErr(
        "Invalid credentials or backend is not running."
      );

    }
  };


  return (
    <div className="login-shell">

      <div className="login-art">

        <div className="brand big">
          Employee<span>Hub</span>
        </div>

        <h1>
          Work smarter.
          <br />
          Move work forward.
        </h1>

        <p>
          A modern workspace for tasks, teams,
          projects and performance.
        </p>

        <div className="mini-grid">
          <div>✓ Role-based access</div>
          <div>✓ Live task visibility</div>
          <div>✓ Performance insights</div>
          <div>✓ Audit-ready workflows</div>
        </div>

      </div>


      <form
        className="login-card"
        onSubmit={submit}
      >

        <div className="eyebrow">
          WORKSPACE LOGIN
        </div>

        <h2>Welcome back</h2>

        <p className="muted">
          Sign in to continue to your workspace.
        </p>

        {err && (
          <div className="error">
            {err}
          </div>
        )}


        <label>
          Work email

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </label>


        <label>
          Password

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </label>


        <button
          className="primary full"
          type="submit"
        >
          Sign in <span>→</span>
        </button>


        <div className="demo-hint">
          Demo: admin@company.com / Admin@123
        </div>

      </form>

    </div>
  );
}


/* =====================================================
   APP
===================================================== */

function App(){
 const [loggedIn, setLoggedIn] = useState(
   !!localStorage.getItem("token")
 );

 if(!loggedIn){
   return <Login onLogin={() => setLoggedIn(true)} />;
 }

 return <Shell setLoggedIn={setLoggedIn} />;
}

function RoleRoute({ roles, children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return roles.includes(user.role) ? children : <Navigate to="/" replace />;
}

/* =====================================================
   SHELL
===================================================== */

function Shell({setLoggedIn}) {

  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState(emptyStats);
  const [dashboardError, setDashboardError] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const nav = useNavigate();
  const loc = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  useEffect(() => {
    if (user.role === "EMPLOYEE") return;

    api.get("/dashboard/summary")
      .then((r) => {
        setStats({ ...emptyStats, ...r.data });
        setDashboardError("");
      })
      .catch(() => {
        setDashboardError("Dashboard data could not be loaded.");
      });
  }, [user.role]);


 const logout = () => {
 localStorage.clear();
 setLoggedIn(false);
 nav("/");
};


  const allItems = [
    ["/", "Dashboard", LayoutDashboard],
    ["/tasks", "Tasks", ClipboardList],
    ["/projects", "Projects", FolderKanban],
    ["/employees", "People", Users],
    ["/departments", "Departments", Building2],
    ["/performance", "Performance", BarChart3]
  ];


  /* ROLE BASED SIDEBAR */

  const items = allItems.filter(([path]) => {

    if (user.role === "ADMIN") {
      return true;
    }


    if (user.role === "MANAGER") {

      return [
        "/",
        "/tasks",
        "/projects",
        "/employees",
        "/performance"
      ].includes(path);

    }


    if (user.role === "EMPLOYEE") {

      return [
        "/",
        "/tasks"
      ].includes(path);

    }


    return false;

  });


  return (
    <div className="app">


      {/* SIDEBAR */}

      <aside
        className={
          collapsed
            ? "sidebar collapsed"
            : "sidebar"
        }
      >

        <div className="brand">
          Employee<span>Hub</span>
        </div>


        <button
          className="collapse"
          onClick={() =>
            setCollapsed(!collapsed)
          }
        >
          <Menu size={19} />
        </button>


        <div className="nav-label">
          WORKSPACE
        </div>


        {items.map(([path, name, Icon]) => (

          <Link
            key={path}
            className={
              loc.pathname === path
                ? "nav active"
                : "nav"
            }
            to={path}
          >

            <Icon size={19} />

            <span>
              {name}
            </span>

          </Link>

        ))}


        <div className="nav-label lower">
          SYSTEM
        </div>


        {user.role === "ADMIN" && (

          <Link
            className="nav"
            to="/settings"
          >
            <Settings size={19} />
            <span>Settings</span>
          </Link>

        )}


        <button
          className="logout"
          onClick={logout}
        >
          <LogOut size={19} />
          <span>Sign out</span>
        </button>

      </aside>


      {/* MAIN */}

      <main className="main">


        {/* HEADER */}

        <header>

          <div>

            <div className="crumb">

              WORKSPACE /{" "}

              {
                loc.pathname === "/"
                  ? "OVERVIEW"
                  : loc.pathname
                      .slice(1)
                      .toUpperCase()
              }

            </div>


            <h1>

              {
                loc.pathname === "/"
                  ? "Good morning, " +
                    (user.name || "Admin")
                      .split(" ")[0] +
                    " 👋"
                  : "Workspace"
              }

            </h1>

          </div>


          <div className="header-actions">


            {/* NOTIFICATION */}

            <button className="icon-btn">
              <Bell size={19} />
              <i />
            </button>


            {/* PROFILE */}

            <div className="profile-wrapper">

              <button
                className="profile"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
              >

                <div className="avatar">
                  {(user.name || "A").slice(0, 1)}
                </div>


                <div>

                  <b>
                    {user.name || "Admin"}
                  </b>

                  <small>
                    {user.role || "ADMIN"}
                  </small>

                </div>


                <ChevronDown size={15} />

              </button>


              {profileOpen && (

                <div className="profile-menu">

                  <div className="profile-menu-user">

                    <b>
                      {user.name || "Admin"}
                    </b>

                    <small>
                      {user.email}
                    </small>

                  </div>


                  <div className="profile-role">

                    Role:{" "}

                    <strong>
                      {user.role}
                    </strong>

                  </div>


                  {user.role === "ADMIN" && (

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        nav("/settings");
                      }}
                    >

                      <Settings size={16} />

                      Settings

                    </button>

                  )}


                  <button onClick={logout}>

                    <LogOut size={16} />

                    Sign out

                  </button>

                </div>

              )}

            </div>

          </div>

        </header>


        {/* ROUTES */}

        <Routes>

          <Route
            path="/"
            element={
              <Dashboard stats={stats} />
            }
          />


          <Route
            path="/tasks"
            element={<Tasks />}
          />


          <Route path="/projects" element={<RoleRoute roles={["ADMIN", "MANAGER"]}><Projects /></RoleRoute>} />


          <Route path="/employees" element={<RoleRoute roles={["ADMIN", "MANAGER"]}><Employees /></RoleRoute>} />


          <Route path="/departments" element={<RoleRoute roles={["ADMIN"]}><Departments /></RoleRoute>} />


          <Route path="/performance" element={<RoleRoute roles={["ADMIN", "MANAGER"]}><Performance /></RoleRoute>} />


          <Route path="/settings" element={<RoleRoute roles={["ADMIN"]}><SettingsPage /></RoleRoute>} />

        </Routes>

      </main>

    </div>
  );
}


/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard({ stats }) {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isEmployee = user.role === "EMPLOYEE";
  const [myTasks, setMyTasks] = useState([]);

  useEffect(() => {
    if (!isEmployee) return;

    api.get("/tasks")
      .then((r) => {
        setMyTasks(
          Array.isArray(r.data)
            ? r.data
            : []
        );
      })
      .catch(() => {
        setMyTasks([]);
      });
  }, [isEmployee]);

  /* =====================================================
     EMPLOYEE DASHBOARD
  ===================================================== */

  if (isEmployee) {

    const assignedTasks = myTasks.length;

    const inProgressTasks = myTasks.filter(
      (task) =>
        String(task.status || "").toUpperCase() === "IN_PROGRESS"
    ).length;

    const completedTasks = myTasks.filter(
      (task) =>
        String(task.status || "").toUpperCase() === "COMPLETED"
    ).length;

    const projectIds = myTasks
      .map((task) => {
        if (task.projectId !== undefined && task.projectId !== null) {
          return task.projectId;
        }

        if (task.project && task.project.id !== undefined) {
          return task.project.id;
        }

        if (task.project && task.project.projectId !== undefined) {
          return task.project.projectId;
        }

        return null;
      })
      .filter((id) => id !== null && id !== undefined);

    const myProjects = new Set(projectIds).size;

    const todoTasks = myTasks.filter(
      (task) => {
        const status = String(task.status || "").toUpperCase();
        return status === "TODO" || status === "ASSIGNED";
      }
    ).length;

    const blockedTasks = myTasks.filter(
      (task) =>
        String(task.status || "").toUpperCase() === "BLOCKED"
    ).length;

    return (
      <section>

        <div className="hero">

          <div>

            <div className="eyebrow">
              PERSONAL WORKSPACE
            </div>

            <h2>
              Your work, at a glance.
              <br />
              <span>
                Stay focused and keep moving.
              </span>
            </h2>

            <p>
              View your assigned tasks, track progress
              and stay on top of your work.
            </p>

          </div>

          <button
            className="primary"
            onClick={() => navToTasks()}
          >
            <ClipboardList size={17} />
            View My Tasks
          </button>

        </div>

        <div className="stats">

          <div className="stat">
            <div className="stat-top">
              <span>Assigned tasks</span>
              <ClipboardList size={19} />
            </div>
            <strong>{assignedTasks}</strong>
            <small className="growth">
              <span>Your assigned work</span>
            </small>
          </div>

          <div className="stat">
            <div className="stat-top">
              <span>In progress</span>
              <Clock3 size={19} />
            </div>
            <strong>{inProgressTasks}</strong>
            <small className="growth">
              <span>Currently working</span>
            </small>
          </div>

          <div className="stat">
            <div className="stat-top">
              <span>Completed</span>
              <CheckCircle2 size={19} />
            </div>
            <strong>{completedTasks}</strong>
            <small className="growth">
              <span>Finished tasks</span>
            </small>
          </div>

          <div className="stat">
            <div className="stat-top">
              <span>My projects</span>
              <FolderKanban size={19} />
            </div>
            <strong>{myProjects}</strong>
            <small className="growth">
              <span>Projects you work on</span>
            </small>
          </div>

        </div>

        <div className="grid2">

          <div className="panel">

            <div className="panel-head">
              <div>
                <h3>My task progress</h3>
                <p>Current status of your assigned work</p>
              </div>
              <span className="pill">
                {assignedTasks} tasks
              </span>
            </div>

            <div className="bars">

              <Bar
                label="Completed"
                value={completedTasks}
                max={assignedTasks}
              />

              <Bar
                label="In progress"
                value={inProgressTasks}
                max={assignedTasks}
              />

              <Bar
                label="To do"
                value={todoTasks}
                max={assignedTasks}
              />

              <Bar
                label="Blocked"
                value={blockedTasks}
                max={assignedTasks}
              />

            </div>

          </div>

          <div className="panel">

            <div className="panel-head">
              <div>
                <h3>My attention</h3>
                <p>Items that may need your action</p>
              </div>
              <AlertTriangle size={18} />
            </div>

            <div className="attention">

              <div>
                <span className="dot red" />
                <b>{blockedTasks} blocked tasks</b>
                <small>Check blocked work</small>
              </div>

              <div>
                <span className="dot amber" />
                <b>{todoTasks} tasks to start</b>
                <small>Work waiting to begin</small>
              </div>

              <div>
                <span className="dot green" />
                <b>{completedTasks} completed</b>
                <small>Good progress on your work</small>
              </div>

            </div>

          </div>

        </div>

      </section>
    );
  }

  /* =====================================================
     ADMIN / MANAGER DASHBOARD
  ===================================================== */

  const cards = [
    ["Employees", stats.employees, Users, "Current database count"],
    ["Open tasks", stats.inProgress + stats.todo, ClipboardList, "In progress + waiting"],
    ["Completed", stats.completed, CheckCircle2, "Current database count"],
    ["Projects", stats.projects, FolderKanban, "Current database count"]
  ];

  return (
  <section>

    <div className="hero">

        <div>
          <div className="eyebrow">
            OPERATIONS OVERVIEW
          </div>

          <h2>
            Everything your team needs,
            <br />
            <span>
              in one clear view.
            </span>
          </h2>

          <p>
            Track delivery, spot blockers and
            understand performance without
            digging through spreadsheets.
          </p>
        </div>

        <button
          className="primary"
          onClick={() => navToTasks()}
        >
          <ClipboardList size={17} />
          View tasks
        </button>

      </div>

      <div className="stats">

        {cards.map(
          ([title, value, Icon, growth]) => (
            <div
              className="stat"
              key={title}
            >
              <div className="stat-top">
                <span>{title}</span>
                <Icon size={19} />
              </div>

              <strong>{value}</strong>

              <small className="growth">
                <span>{growth}</span>
              </small>
            </div>
          )
        )}

      </div>

      <div className="grid2">

        <div className="panel">

          <div className="panel-head">
            <div>
              <h3>Delivery pulse</h3>
              <p>Current task distribution</p>
            </div>

            <span className="pill">
              This month
            </span>
          </div>

          <div className="bars">
            <Bar
              label="Completed"
              value={stats.completed}
              max={stats.tasks}
            />

            <Bar
              label="In progress"
              value={stats.inProgress}
              max={stats.tasks}
            />

            <Bar
              label="To do"
              value={stats.todo}
              max={stats.tasks}
            />

            <Bar
              label="Blocked"
              value={stats.blocked}
              max={stats.tasks}
            />
          </div>

        </div>

        <div className="panel">

          <div className="panel-head">
            <div>
              <h3>Attention needed</h3>
              <p>Items worth reviewing today</p>
            </div>

            <AlertTriangle size={18} />
          </div>

          <div className="attention">

            <div>
              <span className="dot red" />
              <b>{stats.blocked} blocked tasks</b>
              <small>Need owner action</small>
            </div>

            <div>
              <span className="dot amber" />
              <b>{stats.dueThisWeek} deadlines this week</b>
              <small>Tasks due in the next 7 days</small>
            </div>

            <div>
              <span className="dot red" />
              <b>{stats.overdue} overdue tasks</b>
              <small>Completed tasks are excluded</small>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

/* =====================================================
   DASHBOARD -> TASK NAVIGATION
===================================================== */

function navToTasks() {

  window.location.href = "/tasks";

}


/* =====================================================
   BAR
===================================================== */

function Bar({ label, value, max }) {

  const percentage =
    max
      ? Math.min(
          100,
          (value / max) * 100
        )
      : 0;


  return (

    <div className="bar-row">

      <div>

        <span>
          {label}
        </span>

        <b>
          {value}
        </b>

      </div>


      <div className="track">

        <i
          style={{
            width: `${percentage}%`
          }}
        />

      </div>

    </div>

  );
}


/* =====================================================
   TASKS
===================================================== */

function Tasks() {

  const [tasks, setTasks] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(null);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const canCreate =
    user.role === "ADMIN" ||
    user.role === "MANAGER";

  const isEmployee = user.role === "EMPLOYEE";
  const isManager = user.role === "MANAGER";

  const loadTasks = () => {
    api.get("/tasks")
      .then((r) => {
        setTasks(
          Array.isArray(r.data)
            ? r.data
            : []
        );
      })
      .catch(() => {
        setTasks([]);
      });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    if (!isEmployee) return;

    setUpdatingTask(taskId);

    try {
      const response = await api.patch(
        `/tasks/${taskId}/status`,
        { status: newStatus }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? response.data
            : task
        )
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
      alert("Could not update task status.");
    } finally {
      setUpdatingTask(null);
    }
  };

  const shown = tasks.filter((task) => {
    const titleMatches = (task.title || "").toLowerCase().includes(q.toLowerCase());
    const taskStatus = String(task.status || "TODO").toUpperCase();
    const taskPriority = String(task.priority || "MEDIUM").toUpperCase();
    const statusMatches = statusFilter === "ALL" || taskStatus === statusFilter;
    const priorityMatches = priorityFilter === "ALL" || taskPriority === priorityFilter;
    return titleMatches && statusMatches && priorityMatches;
  });

  return (
    <section>

      <Toolbar
        title="Tasks"
        subtitle={
          isEmployee
            ? "View your assigned tasks and track your progress."
            : "Plan, assign and track work across teams."
        }
        button={
          canCreate
            ? "New task"
            : null
        }
        onButtonClick={() =>
          setShowForm(true)
        }
      />

      <div className="filterbar">

        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search tasks..."
            value={q}
            onChange={(e) =>
              setQ(e.target.value)
            }
          />
        </div>

        <select className="filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All status</option>
          <option value="TODO">To do</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="BLOCKED">Blocked</option>
          <option value="UNDER_REVIEW">Under review</option>
          <option value="COMPLETED">Completed</option>
          <option value="REOPENED">Reopened</option>
        </select>

        <select className="filter" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="ALL">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

      </div>

      <div className="table panel">

        <div
          className="table-head"
          style={{
            gridTemplateColumns:
              isEmployee || isManager
                ? "2fr 1.1fr 0.8fr 0.9fr 1.2fr 1.3fr"
                : "2fr 1.1fr 0.8fr 0.9fr 1.2fr"
          }}
        >
          <span>Task</span>
          <span>Assignee</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Progress</span>
          {(isEmployee || isManager) && (
            <span>Action</span>
          )}
        </div>

        {shown.length > 0 ? (

          shown.map((task) => {
            const status = String(
              task.status || "TODO"
            ).toUpperCase();

            return (
              <div
                className="table-row"
                key={task.id}
                style={{
                  gridTemplateColumns:
                    isEmployee || isManager
                      ? "2fr 1.1fr 0.8fr 0.9fr 1.2fr 1.3fr"
                      : "2fr 1.1fr 0.8fr 0.9fr 1.2fr"
                }}
              >

                <div>
                  <b>{task.title}</b>
                  <small>
                    {task.description || "No description"}
                  </small>
                </div>

                <span>
                  {task.assignedTo?.fullName || "Unassigned"}
                </span>

                <span
                  className={
                    "priority " +
                    String(
                      task.priority || "MEDIUM"
                    ).toLowerCase()
                  }
                >
                  {task.priority || "MEDIUM"}
                </span>

                <span
                  className={
                    "status " +
                    status.toLowerCase()
                  }
                >
                  {status.replace("_", " ")}
                </span>

                <div className="progress">
                  <i
                    style={{
                      width: `${task.progress || 0}%`
                    }}
                  />
                  <small>
                    {task.progress || 0}%
                  </small>
                </div>

                {(isEmployee || isManager) && (
                  <div className="task-status-actions">

                    {isEmployee && (status === "TODO" || status === "ASSIGNED") && (
                      <button
                        type="button"
                        className="task-action start"
                        disabled={updatingTask === task.id}
                        onClick={() =>
                          updateTaskStatus(
                            task.id,
                            "IN_PROGRESS"
                          )
                        }
                      >
                        {updatingTask === task.id
                          ? "..."
                          : "Start"}
                      </button>
                    )}

                    {isEmployee && status === "IN_PROGRESS" && (
                      <button
                        type="button"
                        className="task-action complete"
                        disabled={updatingTask === task.id}
                        onClick={() =>
                          updateTaskStatus(
                            task.id,
                            "COMPLETED"
                          )
                        }
                      >
                        {updatingTask === task.id
                          ? "..."
                          : "Complete ✓"}
                      </button>
                    )}

                    {isEmployee && status === "COMPLETED" && (
                      <span className="completed-label">
                        Completed ✓
                      </span>
                    )}

                    {isEmployee &&
                      status !== "TODO" &&
                      status !== "IN_PROGRESS" &&
                      status !== "COMPLETED" && (
                        <span className="monitor-label">
                          No action
                        </span>
                      )}

                    {isManager && (
                      <span className="monitor-label">
                        Monitoring
                      </span>
                    )}

                  </div>
                )}

              </div>
            );
          })

        ) : (
          <Empty
            text={
              user.role === "EMPLOYEE"
                ? "No tasks assigned to you."
                : "No tasks available."
            }
          />
        )}

      </div>

      {showForm && (
        <TaskModal
          onClose={() =>
            setShowForm(false)
          }
          onCreated={() => {
            setShowForm(false);
            loadTasks();
          }}
        />
      )}

    </section>
  );
}

/* =====================================================
   TASK MODAL
===================================================== */

function TaskModal({
  onClose,
  onCreated
}) {

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({

    title: "",
    description: "",
    assignedTo: "",
    projectId: "",
    priority: "MEDIUM",
    status: "TODO",
    progress: 0,
    estimatedHours: "",
    dueDate: ""

  });


  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);


  useEffect(() => {

    api.get("/users")
      .then((r) => {

        setUsers(
          Array.isArray(r.data)
            ? r.data
            : []
        );

      })
      .catch(() => {});


    api.get("/projects")
      .then((r) => {

        setProjects(
          Array.isArray(r.data)
            ? r.data
            : []
        );

      })
      .catch(() => {});

  }, []);


  const change = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  };


  const submit = async (e) => {

    e.preventDefault();

    setError("");
    setSaving(true);


    try {

      await api.post(
        "/tasks",
        {

          title: form.title,

          description:
            form.description,

          assignedTo:
            form.assignedTo
              ? Number(
                  form.assignedTo
                )
              : null,

          projectId:
            form.projectId
              ? Number(
                  form.projectId
                )
              : null,

          priority:
            form.priority,

          status:
            form.status,

          progress:
            Number(
              form.progress
            ),

          estimatedHours:
            form.estimatedHours
              ? Number(
                  form.estimatedHours
                )
              : null,

          dueDate:
            form.dueDate ||
            null

        }
      );


      onCreated();

    } catch (err) {

      console.error(err);

      if (
        err.response?.status === 403
      ) {

        setError(
          "You don't have permission to create tasks."
        );

      } else {

        setError(
          "Failed to create task. Check the backend."
        );

      }

    } finally {

      setSaving(false);

    }

  };


  return (

    <div className="modal-overlay">


      <div className="modal">


        <div className="modal-head">

          <div>

            <div className="eyebrow">
              TASK MANAGEMENT
            </div>

            <h2>
              New task
            </h2>

          </div>


          <button
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>

        </div>


        {error && (

          <div className="error">
            {error}
          </div>

        )}


        <form onSubmit={submit}>


          <label>

            Task title

            <input
              name="title"
              value={form.title}
              onChange={change}
              placeholder="Enter task title"
              required
            />

          </label>


          <label>

            Description

            <textarea
              name="description"
              value={form.description}
              onChange={change}
              placeholder="Describe the task"
            />

          </label>


          <div className="form-grid">


            <label>

              Assign to

              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={change}
              >

                <option value="">
                  Select employee
                </option>


                {users
                  .filter(
                    (u) =>
                      u.role ===
                      "EMPLOYEE"
                  )
                  .map((u) => (

                    <option
                      key={u.id}
                      value={u.id}
                    >
                      {u.fullName}
                    </option>

                  ))}

              </select>

            </label>


            <label>

              Project

              <select
                name="projectId"
                value={form.projectId}
                onChange={change}
              >

                <option value="">
                  Select project
                </option>


                {projects.map(
                  (project) => (

                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.projectName}
                    </option>

                  )
                )}

              </select>

            </label>

          </div>


          <div className="form-grid">


            <label>

              Priority

              <select
                name="priority"
                value={form.priority}
                onChange={change}
              >

                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="CRITICAL">
                  Critical
                </option>

              </select>

            </label>


            <label>

              Due date

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={change}
              />

            </label>

          </div>


          <div className="modal-actions">


            <button
              type="button"
              className="filter"
              onClick={onClose}
            >
              Cancel
            </button>


            <button
              className="primary"
              type="submit"
              disabled={saving}
            >

              {
                saving
                  ? "Creating..."
                  : "Create task"
              }

            </button>

          </div>


        </form>

      </div>

    </div>

  );
}


/* =====================================================
   PROJECTS
===================================================== */

function Projects() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  const loadProjects = () => {
    api.get("/projects")
      .then(r => setProjects(Array.isArray(r.data) ? r.data : []))
      .catch(() => { setProjects([]); setError("Projects could not be loaded."); });
  };

  useEffect(() => {
    loadProjects();
    api.get("/departments").then(r => setDepartments(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get("/users").then(r => setManagers((Array.isArray(r.data) ? r.data : []).filter(u => u.role === "MANAGER"))).catch(() => {});
  }, []);

  const createProject = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    const f = new FormData(e.currentTarget);
    const body = {
      projectName: f.get("projectName"), projectCode: f.get("projectCode"), description: f.get("description"),
      status: f.get("status"), priority: f.get("priority"), startDate: f.get("startDate") || null, endDate: f.get("endDate") || null,
      managerId: f.get("managerId") ? Number(f.get("managerId")) : null, departmentId: f.get("departmentId") ? Number(f.get("departmentId")) : null,
      progress: Number(f.get("progress") || 0)
    };
    try { await api.post("/projects", body); setShowForm(false); loadProjects(); }
    catch (x) { setError(x?.response?.data?.message || "Could not create project. Check the backend console."); }
    finally { setSaving(false); }
  };

  return (
    <section>
      <Toolbar title="Projects" subtitle="Portfolio visibility, ownership and delivery health."
        button={(user.role === "ADMIN" || user.role === "MANAGER") ? "New project" : null}
        onButtonClick={() => { setError(""); setShowForm(true); }} />

      <div className="project-grid">
        {projects.map(project => (
          <Project key={project.id || project.projectId || project.projectCode}
            name={project.projectName || project.name} code={project.projectCode || project.code}
            progress={project.progress ?? 0} status={String(project.status || "PLANNING").replace("_", " ")}
            color="blue" description={project.description} />
        ))}
      </div>

      {showForm && <Modal title="Create new project" onClose={() => !saving && setShowForm(false)}>
        <form onSubmit={createProject}>
          {error && <div className="error" style={{marginBottom:12}}>{error}</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <FormField label="Project name"><input name="projectName" placeholder="e.g. Employee Portal" required /></FormField>
            <FormField label="Project code"><input name="projectCode" placeholder="e.g. EMP-01" required /></FormField>
            <FormField label="Description" wide><textarea name="description" placeholder="Project description" rows="3" /></FormField>
            <FormField label="Status"><select name="status" defaultValue="PLANNING"><option>PLANNING</option><option>ACTIVE</option><option>ON_HOLD</option><option>COMPLETED</option><option>CANCELLED</option></select></FormField>
            <FormField label="Priority"><select name="priority" defaultValue="MEDIUM"><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select></FormField>
            <FormField label="Start date"><input type="date" name="startDate" /></FormField>
            <FormField label="End date"><input type="date" name="endDate" /></FormField>
            <FormField label="Manager"><select name="managerId" defaultValue=""><option value="">Select manager</option>{managers.map(m => <option key={m.id} value={m.id}>{m.fullName}</option>)}</select></FormField>
            <FormField label="Department"><select name="departmentId" defaultValue=""><option value="">Select department</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></FormField>
            <FormField label="Progress (%)"><input type="number" name="progress" min="0" max="100" defaultValue="0" /></FormField>
          </div>
          <ModalActions saving={saving} onCancel={() => setShowForm(false)} submitText="Create project" />
        </form>
      </Modal>}
    </section>
  );
}

/* =====================================================
   PROJECT CARD
===================================================== */

function Project({
  name,
  code,
  progress,
  status,
  color,
  description
}) {

  return (

    <div className="project-card">


      <div className="project-icon">
        {name.slice(0, 1)}
      </div>


      <div className="project-meta">

        <span>
          {code}
        </span>

        <span
          className={
            "status " +
            status
              .toLowerCase()
              .replace(" ", "_")
          }
        >
          {status}
        </span>

      </div>


      <h3>
        {name}
      </h3>


      <p>
        {description || "Engineering delivery workspace with shared milestones and task ownership."}
      </p>


      <div className="progress big">

        <i
          style={{
            width: progress + "%"
          }}
        />

      </div>


      <div className="project-foot">

        <b>
          {progress}%
        </b>

        <small>
          overall progress
        </small>


        <div className="member-stack">

          <i>R</i>
          <i>P</i>
          <i>D</i>

        </div>

      </div>

    </div>

  );
}


/* =====================================================
   EMPLOYEES
===================================================== */

function Employees() {

  const [users, setUsers] = useState([]);


  useEffect(() => {

    api.get("/users")
      .then((r) => {

        setUsers(
          Array.isArray(r.data)
            ? r.data
            : []
        );

      })
      .catch(() => {});

  }, []);


  return (

    <section>


      <Toolbar
        title="People"
        subtitle="Employees, managers and team ownership."
      />


      <div className="people-grid">


        {users.map((u) => (

          <div
            className="person panel"
            key={u.id}
          >


            <div className="avatar lg">

              {(u.fullName || "?")
                .slice(0, 1)}

            </div>


            <div>

              <h3>
                {u.fullName}
              </h3>

              <p>
                {u.designation ||
                 u.role}
              </p>

              <span className="tag">
                {u.role}
              </span>

            </div>


            <div className="person-line">

              <span>
                Department
              </span>

              <b>
                {u.department?.name ||
                 "—"}
              </b>

            </div>


            <div className="person-line">

              <span>
                Status
              </span>

              <b className="online">
                {u.status}
              </b>

            </div>

          </div>

        ))}

      </div>

    </section>

  );
}


/* =====================================================
   DEPARTMENTS
===================================================== */

function Departments() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const loadDepartments = () => api.get("/departments").then(r => setDepartments(Array.isArray(r.data) ? r.data : [])).catch(() => { setDepartments([]); setError("Departments could not be loaded."); });
  useEffect(() => {
    loadDepartments();
    api.get("/users").then(r => setUsers(Array.isArray(r.data) ? r.data : [])).catch(() => setUsers([]));
  }, []);

  const createDepartment = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    const f = new FormData(e.currentTarget);
    try { await api.post("/departments", {name:f.get("name"), description:f.get("description")}); setShowForm(false); loadDepartments(); }
    catch (x) { setError(x?.response?.data?.message || "Could not create department. Check the backend console."); }
    finally { setSaving(false); }
  };

  return (
    <section>
      <Toolbar title="Departments" subtitle="Organize people and ownership by function."
        button={user.role === "ADMIN" ? "New department" : null}
        onButtonClick={() => { setError(""); setShowForm(true); }} />
      <div className="dept-grid">
        {departments.map((department, i) => (
          <div className="dept panel" key={department.id || department.name}>
            <div className="dept-icon"><Building2 size={20} /></div>
            <h3>{department.name}</h3>
            <p>{department.description || "Department"}</p>
            <small style={{color:"#71808d",fontSize:11}}>
              {users.filter(u => u.department?.id === department.id).length} team members
            </small>
          </div>
        ))}
      </div>
      {showForm && <Modal title="Create new department" onClose={() => !saving && setShowForm(false)}>
        <form onSubmit={createDepartment}>
          {error && <div className="error" style={{marginBottom:12}}>{error}</div>}
          <FormField label="Department name"><input name="name" placeholder="e.g. Research & Development" required /></FormField>
          <FormField label="Description"><textarea name="description" placeholder="What does this department handle?" rows="4" /></FormField>
          <ModalActions saving={saving} onCancel={() => setShowForm(false)} submitText="Create department" />
        </form>
      </Modal>}
    </section>
  );
}

function FormField({label, children, wide}) {
  return <label style={{display:"flex",flexDirection:"column",gap:7,fontSize:12,fontWeight:700,color:"#334155",gridColumn:wide ? "1 / -1" : undefined,marginBottom:14}}>
    {label}
    {React.cloneElement(children, {style:{width:"100%",border:"1px solid #dfe5eb",borderRadius:9,padding:"10px 11px",outline:0,background:"#fff",color:"#17212b",fontSize:13,...(children.props.style || {})}})}
  </label>;
}

function ModalActions({saving, onCancel, submitText}) {
  return <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:8}}>
    <button type="button" className="secondary" onClick={onCancel} disabled={saving}>Cancel</button>
    <button type="submit" className="primary" disabled={saving}>{saving ? "Creating..." : submitText}</button>
  </div>;
}

function Modal({title, children, onClose}) {
  return <div onMouseDown={e => {if(e.target === e.currentTarget) onClose();}} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,zIndex:2000}}>
    <div role="dialog" aria-modal="true" style={{width:"min(680px, 100%)",maxHeight:"90vh",overflow:"auto",background:"#fff",borderRadius:16,boxShadow:"0 24px 70px rgba(15,23,42,.22)",border:"1px solid #e5e7eb",padding:22}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:20,marginBottom:18}}>
        <div><div className="eyebrow">WORKSPACE</div><h3 style={{margin:"5px 0 0",font:"800 20px Manrope"}}>{title}</h3></div>
        <button type="button" onClick={onClose} style={{width:34,height:34,border:0,background:"#f1f5f9",borderRadius:9,fontSize:24,lineHeight:1,color:"#475569",cursor:"pointer"}}>×</button>
      </div>
      {children}
    </div>
  </div>;
}

/* =====================================================
   PERFORMANCE
===================================================== */

function Performance() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard/summary")
      .then(r => setStats(r.data))
      .catch(() => setError("Performance data could not be loaded."));
  }, []);

  const total = stats?.tasks || 0;
  const completionRate = total ? Math.round((stats.completed / total) * 100) : 0;
  const activeRate = total ? Math.round(((stats.inProgress + stats.todo) / total) * 100) : 0;
  const blockedRate = total ? Math.round((stats.blocked / total) * 100) : 0;

  return (
    <section>
      {error && <div className="error" style={{marginBottom:12}}>{error}</div>}
      <Toolbar title="Performance" subtitle="Live delivery metrics calculated from current task activity." />

      <div className="stats">
        <div className="stat"><div className="stat-top"><span>Completion rate</span><CheckCircle2 size={19} /></div><strong>{completionRate}%</strong><small className="growth"><span>{stats ? `${stats.completed} of ${total} tasks completed` : "Loading..."}</span></small></div>
        <div className="stat"><div className="stat-top"><span>Active work</span><Clock3 size={19} /></div><strong>{activeRate}%</strong><small className="growth"><span>{stats ? `${stats.inProgress} in progress` : "Loading..."}</span></small></div>
        <div className="stat"><div className="stat-top"><span>Blocked rate</span><AlertTriangle size={19} /></div><strong>{blockedRate}%</strong><small className="growth"><span>{stats ? `${stats.blocked} blocked tasks` : "Loading..."}</span></small></div>
        <div className="stat"><div className="stat-top"><span>Projects</span><FolderKanban size={19} /></div><strong>{stats?.projects ?? 0}</strong><small className="growth"><span>Current database count</span></small></div>
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panel-head"><div><h3>Task distribution</h3><p>Current status distribution across the workspace</p></div><span className="pill">Live</span></div>
          <div className="bars">
            <Bar label="Completed" value={stats?.completed || 0} max={total} />
            <Bar label="In progress" value={stats?.inProgress || 0} max={total} />
            <Bar label="To do / assigned" value={stats?.todo || 0} max={total} />
            <Bar label="Blocked" value={stats?.blocked || 0} max={total} />
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><div><h3>Delivery attention</h3><p>Current items requiring review</p></div><AlertTriangle size={18} /></div>
          <div className="attention">
            <div><span className="dot red" /><b>{stats?.overdue || 0} overdue tasks</b><small>Completed tasks are excluded</small></div>
            <div><span className="dot amber" /><b>{stats?.dueThisWeek || 0} deadlines this week</b><small>Tasks due in the next 7 days</small></div>
            <div><span className="dot green" /><b>{stats?.completed || 0} completed tasks</b><small>Current completed count</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   SETTINGS
===================================================== */

function SettingsPage() {

  return (

    <section>


      <Toolbar
        title="Settings"
        subtitle="Workspace preferences and security controls."
      />


      <div className="panel settings">


        <h3>
          Workspace
        </h3>


        <label>

          Workspace name

          <input
            value="EmployeeHub"
            readOnly
          />

        </label>


        <label>

          Timezone

          <input
            value="Asia/Kolkata"
            readOnly
          />

        </label>


        <h3>
          Security
        </h3>


        <div className="setting-row">


          <div>

            <b>
              Role-based access
            </b>

            <small>
              Restrict actions according to
              Admin, Manager and Employee roles.
            </small>

          </div>


          <span className="toggle on" />

        </div>


        <div className="setting-row">


          <div>

            <b>
              Audit logging
            </b>

            <small>
              Track important changes across
              the workspace.
            </small>

          </div>


          <span className="toggle on" />

        </div>

      </div>

    </section>

  );
}


/* =====================================================
   TOOLBAR
   IMPORTANT: ONLY ONE TOOLBAR FUNCTION
===================================================== */

function Toolbar({
  title,
  subtitle,
  button,
  onButtonClick
}) {

  return (

    <div className="toolbar">


      <div>

        <div className="eyebrow">
          WORKSPACE
        </div>


        <h2>
          {title}
        </h2>


        <p>
          {subtitle}
        </p>

      </div>


      {button && (

        <button
          className="primary"
          onClick={onButtonClick}
        >

          <Plus size={17} />

          {button}

        </button>

      )}

    </div>

  );
}


/* =====================================================
   EMPTY
===================================================== */

function Empty({ text }) {

  return (

    <div className="empty">

      <ClipboardList size={30} />

      <b>
        {text}
      </b>

    </div>

  );
}


/* =====================================================
   EXPORT
   IMPORTANT: MUST BE LAST
===================================================== */

export default App;
