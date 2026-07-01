import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
 
  Menu,
  LogOut,
  Settings,
  Moon,
  Sun,
  Command,
  Building2,
  Users,
  FolderKanban,
  CheckCircle2,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  UserRound,
  BriefcaseBusiness,
  ClipboardList,
  ChevronRight,
  ChevronDown,
  Clock3,
  AlertTriangle, 
  ArrowRight,
  Crown,
  Activity,
  TrendingUp,
  BarChart3,
  LayoutDashboard,
  Bell,
  Eye,
  Filter,
  Edit3,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

import api from "./api";

const emptyStats = {
  employees: 0, managers: 0, activeUsers: 0, projects: 0, tasks: 0,
  completed: 0, inProgress: 0, blocked: 0, todo: 0
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

/* =====================================================
   SHELL
===================================================== */

function Shell({setLoggedIn}) {

  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState(emptyStats);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");
  const [globalResults, setGlobalResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("employeehub-theme") === "dark");

  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    localStorage.setItem("employeehub-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );


  useEffect(() => {
    if (user.role === "EMPLOYEE") return;
    api.get("/dashboard/summary")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, [user.role]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const q = globalQuery.trim().toLowerCase();
    if (!q) {
      setGlobalResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const endpoints = user.role === "EMPLOYEE"
          ? ["/tasks"]
          : ["/tasks", "/projects", "/users"];
        const responses = await Promise.all(endpoints.map((url) => api.get(url).catch(() => ({data: []}))));
        const results = [];
        responses.forEach((response, index) => {
          const list = Array.isArray(response.data) ? response.data : [];
          list.forEach((item) => {
            const text = JSON.stringify(item).toLowerCase();
            if (text.includes(q)) {
              if (index === 0) results.push({ type: "Task", title: item.title || "Untitled task", path: "/tasks" });
              if (index === 1) results.push({ type: "Project", title: item.projectName || item.name || "Untitled project", path: "/projects" });
              if (index === 2) results.push({ type: "Person", title: item.fullName || item.name || item.email || "User", path: "/employees" });
            }
          });
        });
        setGlobalResults(results.slice(0, 8));
      } finally {
        setSearching(false);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [globalQuery, user.role]);


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
    <div className={darkMode ? "app dark-mode" : "app"}>


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
            <div className="global-search">
              <Search size={17} />
              <input
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                onFocus={() => globalQuery && setCommandOpen(false)}
                placeholder="Search workspace..."
              />
              <kbd>Ctrl K</kbd>
              {globalQuery && (
                <div className="search-results">
                  {searching && <div className="search-empty">Searching...</div>}
                  {!searching && globalResults.length === 0 && <div className="search-empty">No matching records</div>}
                  {!searching && globalResults.map((item, index) => (
                    <button key={index} type="button" className="search-result" onClick={() => { setGlobalQuery(""); nav(item.path); }}>
                      <span className="search-result-type">{item.type}</span>
                      <b>{item.title}</b>
                      <ArrowRight size={14}/>
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* THEME TOGGLE */}
            <button
              type="button"
              className="icon-btn theme-toggle"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setDarkMode((value) => !value)}
            >
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* NOTIFICATION */}
            <div className="notification-wrapper">
              <button
                type="button"
                className="icon-btn notification-btn"
                title="Notifications"
                onClick={() => { setNotificationsOpen((v) => !v); setProfileOpen(false); }}
              >
                <Bell size={20} />
                <span className="notification-dot" />
              </button>
              {notificationsOpen && (
                <div className="notification-panel">
                  <div className="notification-head">
                    <div><b>Notifications</b><small>Latest workspace signals</small></div>
                    <button type="button" className="mini-icon" onClick={() => setNotificationsOpen(false)}><X size={16}/></button>
                  </div>
                  <div className="notification-item">
                    <span className="notification-icon danger"><AlertTriangle size={16}/></span>
                    <div><b>{stats.blocked} blocked tasks</b><small>Needs review from the team</small></div>
                  </div>
                  <div className="notification-item">
                    <span className="notification-icon info"><ClipboardList size={16}/></span>
                    <div><b>{stats.inProgress} tasks in progress</b><small>Work currently being delivered</small></div>
                  </div>
                  <div className="notification-item">
                    <span className="notification-icon success"><CheckCircle2 size={16}/></span>
                    <div><b>{stats.completed} completed</b><small>Latest completion count</small></div>
                  </div>
                  <button type="button" className="notification-footer" onClick={() => { setNotificationsOpen(false); nav("/tasks"); }}>Open task workspace <ArrowRight size={15}/></button>
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="profile-wrapper">
              <button
                type="button"
                className="profile"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="avatar profile-avatar">
                  {(user.name || "A").slice(0, 1).toUpperCase()}
                </div>

                <div className="profile-info">
                  <b>{user.name || "Admin"}</b>
                  <small>{user.role || "ADMIN"}</small>
                </div>

                <ChevronDown
                  size={16}
                  className={profileOpen ? "profile-chevron open" : "profile-chevron"}
                />
              </button>

              {profileOpen && (
                <div className="profile-menu premium-profile-menu">
                  <div className="profile-menu-top">
                    <div className="avatar profile-menu-avatar">
                      {(user.name || "A").slice(0, 1).toUpperCase()}
                    </div>

                    <div className="profile-menu-user">
                      <b>{user.name || "Admin"}</b>
                      <small>{user.email || "—"}</small>
                    </div>

                    <span className="online-badge">
                      <span />
                      Online
                    </span>
                  </div>

                  <div className="profile-divider" />

                  <div className="profile-role-row">
                    <div className="profile-role-icon">
                      <Users size={16} />
                    </div>
                    <div>
                      <small>Role</small>
                      <strong>{user.role || "EMPLOYEE"}</strong>
                    </div>
                  </div>

                  <div className="profile-divider" />

                  <button type="button" className="profile-menu-item">
                    <Users size={17} />
                    <span>Profile</span>
                  </button>

                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => setDarkMode((value) => !value)}
                  >
                    {darkMode ? <Sun size={17} /> : <Moon size={17} />}
                    <span>{darkMode ? "Light mode" : "Dark mode"}</span>
                  </button>

                  {user.role === "ADMIN" && (
                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={() => {
                        setProfileOpen(false);
                        nav("/settings");
                      }}
                    >
                      <Settings size={17} />
                      <span>Settings</span>
                    </button>
                  )}

                  <button type="button" className="profile-menu-item">
                    <Bell size={17} />
                    <span>Notifications</span>
                    <span className="notification-count">1</span>
                  </button>

                  <div className="profile-divider" />

                  <button
                    type="button"
                    className="profile-menu-item logout-menu"
                    onClick={logout}
                  >
                    <LogOut size={17} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </header>


        {commandOpen && (
          <div className="command-overlay" onMouseDown={() => setCommandOpen(false)}>
            <div className="command-palette" onMouseDown={(e) => e.stopPropagation()}>
              <div className="command-search"><Command size={19}/><input autoFocus placeholder="Type a command..." /></div>
              <div className="command-section">Quick actions</div>
              {[
                ["Open Dashboard", "/", LayoutDashboard],
                ["Open Tasks", "/tasks", ClipboardList],
                ["Open Projects", "/projects", FolderKanban],
                ...(user.role !== "EMPLOYEE" ? [["Open People", "/employees", Users]] : []),
                ...(user.role === "ADMIN" ? [["Open Settings", "/settings", Settings]] : [])
              ].map(([label, path, Icon]) => (
                <button key={path} type="button" className="command-item" onClick={() => { setCommandOpen(false); nav(path); }}>
                  <span><Icon size={17}/>{label}</span><kbd>↵</kbd>
                </button>
              ))}
              <div className="command-hint"><span>ESC</span> Close <span>CTRL K</span> Toggle palette</div>
            </div>
          </div>
        )}

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


          <Route
            path="/projects"
            element={<Projects />}
          />


          <Route
            path="/employees"
            element={<Employees />}
          />


          <Route
            path="/departments"
            element={<Departments />}
          />


          <Route
            path="/performance"
            element={<Performance />}
          />


          <Route
            path="/settings"
            element={<SettingsPage />}
          />

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
            <strong><AnimatedCounter value={assignedTasks} /></strong>
            <small className="growth">
              <span>Your assigned work</span>
            </small>
          </div>

          <div className="stat">
            <div className="stat-top">
              <span>In progress</span>
              <Clock3 size={19} />
            </div>
            <strong><AnimatedCounter value={inProgressTasks} /></strong>
            <small className="growth">
              <span>Currently working</span>
            </small>
          </div>

          <div className="stat">
            <div className="stat-top">
              <span>Completed</span>
              <CheckCircle2 size={19} />
            </div>
            <strong><AnimatedCounter value={completedTasks} /></strong>
            <small className="growth">
              <span>Finished tasks</span>
            </small>
          </div>

          <div className="stat">
            <div className="stat-top">
              <span>My projects</span>
              <FolderKanban size={19} />
            </div>
            <strong><AnimatedCounter value={myProjects} /></strong>
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
    [
      "Active employees",
      stats.activeUsers,
      Users,
      "+8.2%"
    ],
    [
      "Open tasks",
      stats.inProgress + stats.todo,
      ClipboardList,
      "+12.4%"
    ],
    [
      "Completed",
      stats.completed,
      CheckCircle2,
      "+6.7%"
    ],
    [
      "Projects",
      stats.projects,
      FolderKanban,
      "+4.1%"
    ]
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
          <Plus size={17} />
          Create task
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

              <strong><AnimatedCounter value={value} /></strong>

              <small className="growth">
                {growth}
                <span>vs last month</span>
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
              <b>Review upcoming deadlines</b>
              <small>Check work due soon</small>
            </div>

            <div>
              <span className="dot green" />
              <b>{stats.completed} completed tasks</b>
              <small>Completed work this period</small>
            </div>

          </div>

        </div>

      </div>

      <div className="dashboard-analytics">
        <div className="panel analytics-panel">
          <div className="panel-head">
            <div><h3>Workload analytics</h3><p>Live distribution across the current task pool</p></div>
            <span className="analytics-badge">LIVE</span>
          </div>
          <div className="analytics-layout">
            <div className="donut-wrap">
              <div className="donut" style={{background: `conic-gradient(var(--accent) 0 ${stats.tasks ? (stats.completed/stats.tasks)*100 : 0}%, #f59e0b 0 ${stats.tasks ? ((stats.completed+stats.inProgress)/stats.tasks)*100 : 0}%, #ef4444 0 ${stats.tasks ? ((stats.completed+stats.inProgress+stats.blocked)/stats.tasks)*100 : 0}%, rgba(148,163,184,.18) 0)`}}>
                <div><strong>{stats.tasks}</strong><small>Total tasks</small></div>
              </div>
            </div>
            <div className="legend-list">
              <Legend label="Completed" value={stats.completed} total={stats.tasks} cls="accent" />
              <Legend label="In progress" value={stats.inProgress} total={stats.tasks} cls="amber" />
              <Legend label="Blocked" value={stats.blocked} total={stats.tasks} cls="red" />
              <Legend label="To do" value={stats.todo} total={stats.tasks} cls="muted" />
            </div>
          </div>
        </div>
        <div className="panel quick-actions-panel">
          <div className="panel-head"><div><h3>Quick actions</h3><p>Jump straight into common workflows</p></div><Plus size={18}/></div>
          <div className="quick-actions-grid">
            <button type="button" onClick={() => navToTasks()}><Plus size={18}/><span>Create task</span><ArrowRight size={14}/></button>
            <Link to="/tasks"><ClipboardList size={18}/><span>Review tasks</span><ArrowRight size={14}/></Link>
            <Link to="/projects"><FolderKanban size={18}/><span>View projects</span><ArrowRight size={14}/></Link>
            {user.role === "ADMIN" && <Link to="/employees"><Users size={18}/><span>Manage people</span><ArrowRight size={14}/></Link>}
          </div>
        </div>
      </div>

    </section>
  );
}

function AnimatedCounter({ value, duration = 650 }) {
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = null;
    const from = 0;
    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return display.toLocaleString();
}

function Legend({ label, value, total, cls }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return <div className="legend-row"><span className={`legend-dot ${cls}`}/><div><b>{label}</b><small>{value} tasks</small></div><strong>{pct}%</strong></div>;
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
  const [showForm, setShowForm] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [draggedTask, setDraggedTask] = useState(null);

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

  const patchTaskStatus = async (taskId, newStatus) => {
    // Support both versions of the backend endpoint used during development:
    // PATCH /tasks/{id}/status?value=IN_PROGRESS
    // PATCH /tasks/{id}/status with { status: "IN_PROGRESS" }
    // The final fallback also supports the older PUT endpoint.
    try {
      return await api.patch(
        `/tasks/${taskId}/status`,
        null,
        { params: { value: newStatus } }
      );
    } catch (firstError) {
      try {
        return await api.patch(
          `/tasks/${taskId}/status`,
          { status: newStatus }
        );
      } catch (secondError) {
        return await api.put(
          `/tasks/${taskId}/status`,
          { status: newStatus }
        );
      }
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    if (!isEmployee) return;

    setUpdatingTask(taskId);

    try {
      const response = await patchTaskStatus(taskId, newStatus);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? response.data
            : task
        )
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
      alert(
        error?.response?.data?.message ||
        "Could not update task status. Please check that the backend is running and the task update endpoint is available."
      );
    } finally {
      setUpdatingTask(null);
    }
  };

  const handleKanbanDrop = async (targetStatus) => {
    if (!draggedTask) return;

    const currentStatus = String(draggedTask.status || "TODO").toUpperCase();
    const normalizedTarget =
      targetStatus === "TODO" && currentStatus === "ASSIGNED"
        ? "ASSIGNED"
        : targetStatus;

    setDraggedTask(null);

    if (currentStatus === normalizedTarget) return;

    if (
      isEmployee &&
      !(
        (currentStatus === "TODO" || currentStatus === "ASSIGNED") &&
        normalizedTarget === "IN_PROGRESS"
      ) &&
      !(currentStatus === "IN_PROGRESS" && normalizedTarget === "COMPLETED")
    ) {
      alert("Employees can move tasks only from TODO to IN PROGRESS and from IN PROGRESS to COMPLETED.");
      return;
    }

    try {
      const response = await patchTaskStatus(
        draggedTask.id,
        normalizedTarget
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggedTask.id ? response.data : task
        )
      );
    } catch (error) {
      console.error("Failed to move task:", error);
      alert(error?.response?.data?.message || "Could not move this task.");
    }
  };

  const shown = tasks.filter((task) =>
    (task.title || "")
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  const kanbanColumns = [
    { key: "TODO", title: "To do", tone: "todo" },
    { key: "IN_PROGRESS", title: "In progress", tone: "progress" },
    { key: "BLOCKED", title: "Blocked", tone: "blocked" },
    { key: "COMPLETED", title: "Completed", tone: "completed" }
  ];

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

        <button className="filter">
          All status
        </button>

        <button className="filter">
          All priorities
        </button>

        <div className="task-view-switch" role="group" aria-label="Task view">
          <button
            type="button"
            className={viewMode === "table" ? "view-toggle active" : "view-toggle"}
            onClick={() => setViewMode("table")}
          >
            List
          </button>
          <button
            type="button"
            className={viewMode === "kanban" ? "view-toggle active" : "view-toggle"}
            onClick={() => setViewMode("kanban")}
          >
            Kanban
          </button>
        </div>

      </div>

      {viewMode === "kanban" && (
        <div className="kanban-board">
          {kanbanColumns.map((column) => {
            const columnTasks = shown.filter((task) => {
              const status = String(task.status || "TODO").toUpperCase();
              return column.key === "TODO"
                ? status === "TODO" || status === "ASSIGNED"
                : status === column.key;
            });

            return (
              <div
                key={column.key}
                className={`kanban-column ${column.tone}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleKanbanDrop(column.key)}
              >
                <div className="kanban-column-head">
                  <div>
                    <span className="kanban-dot" />
                    <strong>{column.title}</strong>
                  </div>
                  <span className="kanban-count">{columnTasks.length}</span>
                </div>

                <div className="kanban-dropzone">
                  {columnTasks.length ? (
                    columnTasks.map((task) => {
                      const status = String(task.status || "TODO").toUpperCase();
                      return (
                        <article
                          key={task.id}
                          className="kanban-card"
                          draggable
                          onDragStart={() => setDraggedTask(task)}
                          onDragEnd={() => setDraggedTask(null)}
                        >
                          <div className="kanban-card-top">
                            <span className={`priority ${String(task.priority || "MEDIUM").toLowerCase()}`}>
                              {task.priority || "MEDIUM"}
                            </span>
                            <span className="kanban-card-id">#{task.id}</span>
                          </div>

                          <h3>{task.title || "Untitled task"}</h3>
                          <p>{task.description || "No description provided."}</p>

                          <div className="kanban-card-meta">
                            <span>{task.assignedTo?.fullName || "Unassigned"}</span>
                            <span>{task.progress || 0}%</span>
                          </div>

                          <div className="progress">
                            <i style={{ width: `${task.progress || 0}%` }} />
                          </div>

                          <div className="kanban-card-footer">
                            <span className={`status ${status.toLowerCase()}`}>
                              {status.replace("_", " ")}
                            </span>
                            <span className="drag-hint">Drag ↕</span>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="kanban-empty">
                      <span>Drop tasks here</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        className="table panel"
        style={{ display: viewMode === "table" ? "block" : "none" }}
      >

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

                    {isEmployee && status === "TODO" && (
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
  const canManage = user.role === "ADMIN" || user.role === "MANAGER";
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("progress");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [details, setDetails] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const calls = [api.get("/projects"), api.get("/tasks")];
      if (canManage) {
        calls.push(api.get("/users"), api.get("/departments"));
      }
      const responses = await Promise.all(calls);
      setProjects(Array.isArray(responses[0]?.data) ? responses[0].data : []);
      setTasks(Array.isArray(responses[1]?.data) ? responses[1].data : []);
      if (canManage) {
        setUsers(Array.isArray(responses[2]?.data) ? responses[2].data : []);
        setDepartments(Array.isArray(responses[3]?.data) ? responses[3].data : []);
      }
    } catch (e) {
      setError("Projects could not be loaded. Check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [canManage]);

  const visibleProjects = projects
    .filter((p) => {
      const text = `${p.projectName || ""} ${p.projectCode || ""} ${p.description || ""}`.toLowerCase();
      return text.includes(query.trim().toLowerCase());
    })
    .filter((p) => statusFilter === "ALL" || String(p.status || "PLANNING") === statusFilter)
    .filter((p) => priorityFilter === "ALL" || String(p.priority || "MEDIUM") === priorityFilter)
    .sort((a, b) => {
      if (sortBy === "name") return String(a.projectName || "").localeCompare(String(b.projectName || ""));
      if (sortBy === "progress") return Number(b.progress || 0) - Number(a.progress || 0);
      if (sortBy === "priority") {
        const rank = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
        return (rank[b.priority] || 0) - (rank[a.priority] || 0);
      }
      return String(a.endDate || "9999-12-31").localeCompare(String(b.endDate || "9999-12-31"));
    });

  const projectTaskCount = (projectId) => tasks.filter((t) => Number(t.projectId) === Number(projectId)).length;
  const projectCompletedCount = (projectId) => tasks.filter((t) => Number(t.projectId) === Number(projectId) && String(t.status).toUpperCase() === "COMPLETED").length;

  const openCreate = () => {
    setError("");
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (project) => {
    setError("");
    setEditing(project);
    setShowForm(true);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const body = {
      projectName: String(f.get("projectName") || "").trim(),
      projectCode: String(f.get("projectCode") || "").trim().toUpperCase(),
      description: String(f.get("description") || "").trim(),
      status: f.get("status") || "PLANNING",
      priority: f.get("priority") || "MEDIUM",
      startDate: f.get("startDate") || null,
      endDate: f.get("endDate") || null,
      managerId: f.get("managerId") ? Number(f.get("managerId")) : null,
      departmentId: f.get("departmentId") ? Number(f.get("departmentId")) : null,
      progress: Math.max(0, Math.min(100, Number(f.get("progress") || 0)))
    };
    try {
      if (editing?.id) await api.put(`/projects/${editing.id}`, body);
      else await api.post("/projects", body);
      setShowForm(false);
      setEditing(null);
      await loadData();
    } catch (e2) {
      setError(e2?.response?.data?.message || "Could not save project. Check the backend console.");
    } finally {
      setSaving(false);
    }
  };

  const removeProject = async (project) => {
    if (!canManage || !project?.id) return;
    const linked = projectTaskCount(project.id);
    const message = linked
      ? `Delete ${project.projectName}? It has ${linked} linked task${linked === 1 ? "" : "s"}. Tasks will remain, but their project link may be removed by the database.`
      : `Delete ${project.projectName}? This cannot be undone.`;
    if (!window.confirm(message)) return;
    setDeleting(project.id);
    setError("");
    try {
      await api.delete(`/projects/${project.id}`);
      if (details?.id === project.id) setDetails(null);
      await loadData();
    } catch (e) {
      setError(e?.response?.data?.message || "Could not delete project.");
    } finally {
      setDeleting(null);
    }
  };

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "ACTIVE").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
    onHold: projects.filter((p) => p.status === "ON_HOLD").length
  };

  return (
    <section className="projects-page">
      <Toolbar
        title="Projects"
        subtitle="Portfolio visibility, ownership and delivery health."
        button={canManage ? "New project" : null}
        onButtonClick={canManage ? openCreate : undefined}
      />

      {error && <div className="error project-error">{error}</div>}

      <div className="project-overview-stats">
        <div className="project-mini-stat"><span>Total projects</span><strong>{stats.total}</strong></div>
        <div className="project-mini-stat"><span>Active</span><strong>{stats.active}</strong></div>
        <div className="project-mini-stat"><span>Completed</span><strong>{stats.completed}</strong></div>
        <div className="project-mini-stat"><span>On hold</span><strong>{stats.onHold}</strong></div>
      </div>

      <div className="project-toolbar panel">
        <div className="project-search search">
          <Search size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects, codes or descriptions..." />
        </div>
        <div className="project-filter-wrap">
          <Filter size={16} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All status</option>
            <option value="PLANNING">Planning</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On hold</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <select className="filter" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="ALL">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
        <select className="filter" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="progress">Sort: progress</option>
          <option value="name">Sort: name</option>
          <option value="priority">Sort: priority</option>
          <option value="date">Sort: due date</option>
        </select>
      </div>

      {loading ? (
        <div className="project-grid project-skeleton-grid">
          {[1,2,3].map((n) => <div className="project-card project-skeleton" key={n}><div/><div/><div/><div/></div>)}
        </div>
      ) : visibleProjects.length ? (
        <div className="project-grid">
          {visibleProjects.map((project, index) => (
            <Project
              key={project.id || project.projectId || project.projectCode || index}
              project={project}
              taskCount={projectTaskCount(project.id)}
              completedCount={projectCompletedCount(project.id)}
              canManage={canManage}
              deleting={deleting === project.id}
              onView={() => setDetails(project)}
              onEdit={() => openEdit(project)}
              onDelete={() => removeProject(project)}
            />
          ))}
        </div>
      ) : (
        <div className="empty project-empty"><FolderKanban size={34}/><h3>No projects found</h3><p>Try changing your search or filters.</p>{canManage && <button className="primary" onClick={openCreate}><Plus size={16}/> Create project</button>}</div>
      )}

      {showForm && (
        <ProjectModal
          project={editing}
          users={users.filter((u) => u.role === "MANAGER")}
          departments={departments}
          saving={saving}
          error={error}
          onClose={() => !saving && setShowForm(false)}
          onSubmit={saveProject}
        />
      )}

      {details && (
        <ProjectDetails
          project={details}
          tasks={tasks.filter((t) => Number(t.projectId) === Number(details.id))}
          onClose={() => setDetails(null)}
          onEdit={canManage ? () => { setDetails(null); openEdit(details); } : null}
        />
      )}
    </section>
  );
}

function Project({ project, taskCount, completedCount, canManage, deleting, onView, onEdit, onDelete }) {
  const name = project.projectName || project.name || "Untitled project";
  const code = project.projectCode || project.code || "—";
  const progress = Number(project.progress || 0);
  const status = String(project.status || "PLANNING").replaceAll("_", " ");
  const priority = String(project.priority || "MEDIUM");
  const description = project.description || "No project description has been added yet.";
  const due = project.endDate || "No end date";

  return (
    <article className="project-card project-card-v2">
      <div className="project-card-top">
        <div className="project-icon">{name.slice(0, 1).toUpperCase()}</div>
        <div className="project-card-actions">
          <button className="icon-btn" title="View project" onClick={onView}><Eye size={16}/></button>
          {canManage && <button className="icon-btn" title="More actions" onClick={onEdit}><Edit3 size={16}/></button>}
        </div>
      </div>
      <div className="project-meta">
        <span>{code}</span>
        <span className={`status ${status.toLowerCase().replaceAll(" ", "_")}`}>{status}</span>
      </div>
      <div className="project-title-row">
        <h3>{name}</h3>
        <span className={`priority ${priority.toLowerCase()}`}>{priority}</span>
      </div>
      <p>{description}</p>
      <div className="project-progress-row"><span>Delivery progress</span><b>{progress}%</b></div>
      <div className="progress big"><i style={{width: `${progress}%`}} /></div>
      <div className="project-foot project-foot-v2">
        <div><b>{completedCount}/{taskCount}</b><small>tasks complete</small></div>
        <div><CalendarDays size={14}/><small>{due}</small></div>
      </div>
      <div className="project-card-footer">
        <button className="project-view-btn" onClick={onView}>View details <ArrowRight size={14}/></button>
        {canManage && <button className="project-delete-btn" disabled={deleting} onClick={onDelete}>{deleting ? "Deleting..." : <Trash2 size={15}/>}</button>}
      </div>
    </article>
  );
}

function ProjectModal({ project, users, departments, saving, error, onClose, onSubmit }) {
  const [localError, setLocalError] = useState("");
  const submit = (e) => {
    const f = new FormData(e.currentTarget);
    const start = f.get("startDate");
    const end = f.get("endDate");
    if (start && end && start > end) {
      e.preventDefault();
      setLocalError("End date must be on or after the start date.");
      return;
    }
    setLocalError("");
    onSubmit(e);
  };
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="project-modal panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="project-modal-head"><div><span className="eyebrow">PROJECT MANAGEMENT</span><h2>{project ? "Edit project" : "Create new project"}</h2><p>Keep ownership, delivery dates and project health in one place.</p></div><button className="modal-close" onClick={onClose}><X size={19}/></button></div>
        {(error || localError) && <div className="error">{localError || error}</div>}
        <form onSubmit={submit}>
          <div className="project-form-grid">
            <label>Project name<input name="projectName" defaultValue={project?.projectName || ""} placeholder="e.g. Employee Portal" required /></label>
            <label>Project code<input name="projectCode" defaultValue={project?.projectCode || ""} placeholder="e.g. EMP-01" required /></label>
            <label className="wide">Description<textarea name="description" defaultValue={project?.description || ""} rows="4" placeholder="What is this project responsible for?" /></label>
            <label>Status<select name="status" defaultValue={project?.status || "PLANNING"}><option>PLANNING</option><option>ACTIVE</option><option>ON_HOLD</option><option>COMPLETED</option><option>CANCELLED</option></select></label>
            <label>Priority<select name="priority" defaultValue={project?.priority || "MEDIUM"}><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select></label>
            <label>Start date<input type="date" name="startDate" defaultValue={project?.startDate || ""} /></label>
            <label>End date<input type="date" name="endDate" defaultValue={project?.endDate || ""} /></label>
            <label>Manager<select name="managerId" defaultValue={project?.manager?.id || project?.managerId || ""}><option value="">No manager</option>{users.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}</select></label>
            <label>Department<select name="departmentId" defaultValue={project?.department?.id || project?.departmentId || ""}><option value="">No department</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
            <label>Progress<input type="number" name="progress" min="0" max="100" defaultValue={project?.progress ?? 0} /></label>
          </div>
          <div className="modal-actions"><button type="button" className="filter" onClick={onClose}>Cancel</button><button className="primary" disabled={saving} type="submit">{saving ? "Saving..." : project ? "Save changes" : "Create project"}</button></div>
        </form>
      </div>
    </div>
  );
}

function ProjectDetails({ project, tasks, onClose, onEdit }) {
  const progress = Number(project.progress || 0);
  const status = String(project.status || "PLANNING").replaceAll("_", " ");
  const completed = tasks.filter((t) => String(t.status).toUpperCase() === "COMPLETED").length;
  const inProgress = tasks.filter((t) => String(t.status).toUpperCase() === "IN_PROGRESS").length;
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="project-details panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="project-details-head"><div className="project-icon large">{String(project.projectName || "P").slice(0,1).toUpperCase()}</div><button className="modal-close" onClick={onClose}><X size={19}/></button></div>
        <span className="eyebrow">{project.projectCode || "PROJECT"}</span>
        <h2>{project.projectName}</h2>
        <p className="details-description">{project.description || "No project description has been added yet."}</p>
        <div className="details-status-row"><span className={`status ${status.toLowerCase().replaceAll(" ", "_")}`}>{status}</span><span className={`priority ${String(project.priority || "MEDIUM").toLowerCase()}`}>{project.priority || "MEDIUM"}</span></div>
        <div className="details-progress"><div><span>Overall progress</span><b>{progress}%</b></div><div className="progress big"><i style={{width: `${progress}%`}}/></div></div>
        <div className="details-metrics"><div><strong>{tasks.length}</strong><span>Total tasks</span></div><div><strong>{completed}</strong><span>Completed</span></div><div><strong>{inProgress}</strong><span>In progress</span></div></div>
        <div className="details-info-grid"><div><small>Start date</small><b>{project.startDate || "—"}</b></div><div><small>End date</small><b>{project.endDate || "—"}</b></div><div><small>Manager</small><b>{project.manager?.fullName || "Assigned manager"}</b></div><div><small>Department</small><b>{project.department?.name || "Assigned department"}</b></div></div>
        <div className="details-task-list"><div className="details-section-title"><span>Project tasks</span><span>{tasks.length}</span></div>{tasks.length ? tasks.slice(0,8).map((t) => <div className="details-task" key={t.id}><span className={`status-dot ${String(t.status).toLowerCase()}`}/><div><b>{t.title}</b><small>{String(t.status || "TODO").replaceAll("_", " ")} · {t.progress || 0}%</small></div></div>) : <div className="details-empty">No tasks are linked to this project yet.</div>}</div>
        {onEdit && <button className="primary details-edit-btn" onClick={onEdit}><Edit3 size={16}/> Edit project</button>}
      </aside>
    </div>
  );
}


/* =====================================================
   EMPLOYEES
===================================================== */

function EmployeeDetails({ employee, tasks, onClose }) {
  if (!employee) return null;
  const assigned = tasks.filter((t) => Number(t.assignedTo?.id ?? t.assignedToId) === Number(employee.id));
  const completed = assigned.filter((t) => String(t.status).toUpperCase() === "COMPLETED").length;
  const inProgress = assigned.filter((t) => String(t.status).toUpperCase() === "IN_PROGRESS").length;
  const blocked = assigned.filter((t) => String(t.status).toUpperCase() === "BLOCKED").length;
  const rate = assigned.length ? Math.round((completed / assigned.length) * 100) : 0;
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="employee-details panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="employee-details-top">
          <div className="avatar xl">{String(employee.fullName || "?").slice(0,1).toUpperCase()}</div>
          <button className="modal-close" onClick={onClose}><X size={19}/></button>
        </div>
        <div className="employee-title-row">
          <div><span className="eyebrow">EMPLOYEE PROFILE</span><h2>{employee.fullName}</h2><p>{employee.designation || employee.role}</p></div>
          <span className={`employee-status ${String(employee.status || "ACTIVE").toLowerCase()}`}><i/> {employee.status || "ACTIVE"}</span>
        </div>
        <div className="employee-meta-grid">
          <div><small>Email</small><b>{employee.email || "—"}</b></div>
          <div><small>Role</small><b>{employee.role || "—"}</b></div>
          <div><small>Department</small><b>{employee.department?.name || "—"}</b></div>
          <div><small>Joined</small><b>{employee.joinedDate || "—"}</b></div>
        </div>
        <div className="employee-metric-grid">
          <div><strong>{assigned.length}</strong><span>Total tasks</span></div>
          <div><strong>{completed}</strong><span>Completed</span></div>
          <div><strong>{inProgress}</strong><span>In progress</span></div>
          <div><strong>{rate}%</strong><span>Completion</span></div>
        </div>
        <div className="employee-progress-block">
          <div><span>Completion rate</span><b>{rate}%</b></div>
          <div className="progress big"><i style={{width: `${rate}%`}}/></div>
        </div>
        <div className="employee-detail-section">
          <div className="details-section-title"><span>Current workload</span><span>{blocked} blocked</span></div>
          {assigned.length ? assigned.slice(0, 8).map((t) => (
            <div className="employee-task" key={t.id}>
              <div><b>{t.title}</b><small>{String(t.status || "TODO").replaceAll("_", " ")} · {t.progress || 0}%</small></div>
              <span className={`priority ${String(t.priority || "MEDIUM").toLowerCase()}`}>{t.priority || "MEDIUM"}</span>
            </div>
          )) : <div className="details-empty">No tasks are currently assigned to this employee.</div>}
        </div>
      </aside>
    </div>
  );
}

function EmployeeForm({ departments, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    const f = new FormData(e.currentTarget);
    const body = {
      fullName: String(f.get("fullName") || "").trim(),
      email: String(f.get("email") || "").trim().toLowerCase(),
      password: String(f.get("password") || ""),
      phone: String(f.get("phone") || "").trim(),
      designation: String(f.get("designation") || "").trim(),
      role: f.get("role") || "EMPLOYEE",
      status: f.get("status") || "ACTIVE",
      department: f.get("departmentId") ? { id: Number(f.get("departmentId")) } : null,
      joinedDate: f.get("joinedDate") || null
    };
    try {
      await api.post("/users", body);
      onSaved();
    } catch (e2) {
      setError(e2?.response?.data?.message || "Could not create this employee. Check the backend console.");
    } finally { setSaving(false); }
  };
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="form-card employee-form" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head"><div><span className="eyebrow">PEOPLE</span><h2>Add employee</h2><p>Create a new workspace account.</p></div><button className="modal-close" onClick={onClose}><X size={19}/></button></div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={save}>
          <div className="form-grid two">
            <label>Full name<input name="fullName" required placeholder="Employee name"/></label>
            <label>Email<input name="email" type="email" required placeholder="employee@company.com"/></label>
            <label>Password<input name="password" type="password" required minLength="6" placeholder="Temporary password"/></label>
            <label>Phone<input name="phone" placeholder="Phone number"/></label>
            <label>Designation<input name="designation" placeholder="Software Engineer"/></label>
            <label>Role<select name="role" defaultValue="EMPLOYEE"><option value="EMPLOYEE">Employee</option><option value="MANAGER">Manager</option><option value="ADMIN">Admin</option></select></label>
            <label>Status<select name="status" defaultValue="ACTIVE"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option></select></label>
            <label>Department<select name="departmentId" defaultValue=""><option value="">No department</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
            <label>Joined date<input name="joinedDate" type="date" defaultValue={new Date().toISOString().slice(0,10)}/></label>
          </div>
          <div className="modal-actions"><button type="button" className="filter" onClick={onClose}>Cancel</button><button className="primary" disabled={saving}>{saving ? "Creating..." : "Create employee"}</button></div>
        </form>
      </div>
    </div>
  );
}

function Employees() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canManage = user.role === "ADMIN";
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const calls = [api.get("/users"), api.get("/tasks")];
      if (canManage) calls.push(api.get("/departments"));
      const r = await Promise.all(calls);
      setUsers(Array.isArray(r[0]?.data) ? r[0].data : []);
      setTasks(Array.isArray(r[1]?.data) ? r[1].data : []);
      if (canManage) setDepartments(Array.isArray(r[2]?.data) ? r[2].data : []);
    } catch (e) { setError("People could not be loaded. Check the backend connection."); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, [canManage]);

  const workload = (id) => tasks.filter((t) => Number(t.assignedTo?.id ?? t.assignedToId) === Number(id));
  const filtered = users.filter((u) => {
    const text = `${u.fullName || ""} ${u.email || ""} ${u.designation || ""} ${u.department?.name || ""}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (roleFilter === "ALL" || u.role === roleFilter) && (statusFilter === "ALL" || u.status === statusFilter);
  });
  const metrics = {
    total: users.length,
    active: users.filter((u) => u.status === "ACTIVE").length,
    managers: users.filter((u) => u.role === "MANAGER").length,
    workload: tasks.filter((t) => String(t.status).toUpperCase() !== "COMPLETED").length
  };

  return (
    <section>
      <Toolbar title="People" subtitle="Employees, managers and team ownership." button={canManage ? "Add employee" : null} onButtonClick={() => setShowForm(true)}/>
      {error && <div className="error page-error">{error}</div>}
      <div className="people-overview">
        <div className="people-stat"><span>Total people</span><strong>{metrics.total}</strong><small>Workspace accounts</small></div>
        <div className="people-stat"><span>Active</span><strong>{metrics.active}</strong><small>Currently enabled</small></div>
        <div className="people-stat"><span>Managers</span><strong>{metrics.managers}</strong><small>Team owners</small></div>
        <div className="people-stat"><span>Open workload</span><strong>{metrics.workload}</strong><small>Non-completed tasks</small></div>
      </div>
      <div className="people-toolbar panel">
        <div className="people-search"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search people, email, department..."/></div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}><option value="ALL">All roles</option><option value="ADMIN">Admin</option><option value="MANAGER">Manager</option><option value="EMPLOYEE">Employee</option></select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="ALL">All status</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option></select>
      </div>
      {loading ? <div className="people-grid"><div className="panel skeleton-card"/><div className="panel skeleton-card"/><div className="panel skeleton-card"/></div> : (
        <div className="people-grid">
          {filtered.map((u) => {
            const wt = workload(u.id);
            const done = wt.filter((t) => String(t.status).toUpperCase() === "COMPLETED").length;
            const pct = wt.length ? Math.round(done / wt.length * 100) : 0;
            return <div className="person panel person-rich" key={u.id} onClick={() => setSelected(u)}>
              <div className="person-rich-head"><div className="avatar lg">{String(u.fullName || "?").slice(0,1).toUpperCase()}</div><div><h3>{u.fullName}</h3><p>{u.designation || u.role}</p></div><span className={`employee-status compact ${String(u.status || "ACTIVE").toLowerCase()}`}><i/></span></div>
              <div className="person-tags"><span className="tag">{u.role}</span><span className="tag">{u.department?.name || "No department"}</span></div>
              <div className="person-lines"><div><span>Email</span><b>{u.email}</b></div><div><span>Tasks</span><b>{wt.length} · {done} done</b></div></div>
              <div className="person-work"><div><span>Completion</span><b>{pct}%</b></div><div className="progress"><i style={{width: `${pct}%`}}/></div></div>
              <button className="person-view" onClick={(e) => { e.stopPropagation(); setSelected(u); }}><Eye size={15}/> View profile <ArrowRight size={14}/></button>
            </div>;
          })}
          {!filtered.length && <div className="panel large-empty-state"><Users size={30}/><h3>No people found</h3><p>Try changing your search or filters.</p></div>}
        </div>
      )}
      {selected && <EmployeeDetails employee={selected} tasks={tasks} onClose={() => setSelected(null)}/>} 
      {showForm && <EmployeeForm departments={departments} onClose={() => setShowForm(false)} onSaved={async () => { setShowForm(false); await loadData(); }}/>} 
    </section>
  );
}

/* =====================================================
   DEPARTMENTS
===================================================== */

function Departments() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user.role === "ADMIN";

  const loadDepartments = () => {
    setLoading(true);
    setError("");

    api.get("/departments")
      .then((r) => {
        setDepartments(
          Array.isArray(r.data)
            ? r.data
            : []
        );
      })
      .catch((err) => {
        console.error(
          "Failed to load departments:",
          err
        );

        setDepartments([]);
        setError(
          "Failed to load departments. Check the backend."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  return (
    <section>

      <Toolbar
        title="Departments"
        subtitle="Organize people and ownership by function."
        button={
          isAdmin
            ? "New department"
            : null
        }
        onButtonClick={() =>
          setShowForm(true)
        }
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="panel empty">
          <b>Loading departments...</b>
        </div>
      ) : departments.length === 0 ? (
        <div className="panel empty">
          <Building2 size={30} />
          <b>No departments found.</b>

          {isAdmin && (
            <button
              className="primary"
              onClick={() =>
                setShowForm(true)
              }
            >
              <Plus size={17} />
              Create department
            </button>
          )}
        </div>
      ) : (
        <div className="dept-grid">

          {departments.map((department, index) => (

            <div
              className="dept panel"
              key={department.id || index}
            >

              <div className="dept-icon">
                <Building2 size={20} />
              </div>

              <h3>
                {department.name}
              </h3>

              <p>
                {department.description ||
                  "No description available."}
              </p>

              <div className="mini-progress">
                <i
                  style={{
                    width:
                      `${Math.min(
                        100,
                        35 + index * 12
                      )}%`
                  }}
                />
              </div>

              <small>
                Department ID:{" "}
                {department.id || "—"}
              </small>

            </div>

          ))}

        </div>
      )}

      {showForm && (
        <DepartmentModal
          onClose={() =>
            setShowForm(false)
          }
          onCreated={() => {
            setShowForm(false);
            loadDepartments();
          }}
        />
      )}

    </section>
  );
}


/* =====================================================
   DEPARTMENT MODAL
===================================================== */

function DepartmentModal({
  onClose,
  onCreated
}) {

  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {

    e.preventDefault();

    setError("");
    setSaving(true);

    try {

      await api.post(
        "/departments",
        {
          name: form.name,
          description: form.description
        }
      );

      onCreated();

    } catch (err) {

      console.error(
        "Failed to create department:",
        err
      );

      if (err.response?.status === 403) {

        setError(
          "You don't have permission to create departments."
        );

      } else {

        setError(
          "Failed to create department. Check the backend."
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
              DEPARTMENT MANAGEMENT
            </div>

            <h2>
              New department
            </h2>

          </div>

          <button
            className="modal-close"
            type="button"
            onClick={onClose}
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

            Department name

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={change}
              placeholder="e.g. Engineering"
              required
            />

          </label>

          <label>

            Description

            <textarea
              name="description"
              value={form.description}
              onChange={change}
              placeholder="Describe the department"
              rows="4"
            />

          </label>

          <div className="modal-actions">

            <button
              type="button"
              className="filter"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary"
              disabled={saving}
            >

              {saving
                ? "Creating..."
                : "Create department"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );
}/* =====================================================
   PERFORMANCE
===================================================== */
function StatCard({
  icon,
  label,
  value,
  note
}) {
  return (
    <div className="panel stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {note}
        </small>

      </div>

    </div>
  );
}

function Performance() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        setLoading(true);
        setError("");

        const [tasksRes, usersRes] = await Promise.all([
          api.get("/tasks"),
          api.get("/users")
        ]);

        setTasks(
          Array.isArray(tasksRes.data)
            ? tasksRes.data
            : []
        );

        setUsers(
          Array.isArray(usersRes.data)
            ? usersRes.data
            : []
        );

      } catch (err) {
        console.error(
          "Failed to load performance:",
          err
        );

        setError(
          "Failed to load performance data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPerformance();
  }, []);

  /* ---------------------------------------------------
     STATUS HELPERS
  --------------------------------------------------- */

  const getStatus = (task) => {
    return String(
      task.status || "TODO"
    ).toUpperCase();
  };

  const isCompleted = (task) =>
    getStatus(task) === "COMPLETED";

  const isInProgress = (task) =>
    getStatus(task) === "IN_PROGRESS";

  const isBlocked = (task) =>
    getStatus(task) === "BLOCKED";

  const isPending = (task) => {
    const status = getStatus(task);

    return (
      status === "TODO" ||
      status === "ASSIGNED"
    );
  };

  /* ---------------------------------------------------
     OVERALL STATISTICS
  --------------------------------------------------- */

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    isCompleted
  ).length;

  const inProgressTasks = tasks.filter(
    isInProgress
  ).length;

  const blockedTasks = tasks.filter(
    isBlocked
  ).length;

  const pendingTasks = tasks.filter(
    isPending
  ).length;

  const completionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  /* ---------------------------------------------------
     EMPLOYEE PERFORMANCE
  --------------------------------------------------- */

  const employees = users.filter(
    (u) => u.role === "EMPLOYEE"
  );

  const getEmployeeTasks = (employeeId) => {
    return tasks.filter(
      (task) =>
        Number(
          task.assignedTo?.id ||
          task.assignedToId
        ) === Number(employeeId)
    );
  };

  const getEmployeeStats = (employeeId) => {

    const employeeTasks =
      getEmployeeTasks(employeeId);

    const completed =
      employeeTasks.filter(
        isCompleted
      ).length;

    const inProgress =
      employeeTasks.filter(
        isInProgress
      ).length;

    const blocked =
      employeeTasks.filter(
        isBlocked
      ).length;

    const pending =
      employeeTasks.filter(
        isPending
      ).length;

    const total =
      employeeTasks.length;

    const rate =
      total > 0
        ? Math.round(
            (completed / total) * 100
          )
        : 0;

    return {
      total,
      completed,
      inProgress,
      blocked,
      pending,
      rate
    };
  };

  /* ---------------------------------------------------
     EMPLOYEE VIEW
  --------------------------------------------------- */

  const visibleEmployees =
    currentUser.role === "EMPLOYEE"
      ? employees.filter(
          (employee) =>
            Number(employee.id) ===
            Number(currentUser.id)
        )
      : employees;

  /* ---------------------------------------------------
     LOADING
  --------------------------------------------------- */

  if (loading) {
    return (
      <section>

        <Toolbar
          title="Performance"
          subtitle="Track employee productivity and task completion."
        />

        <div className="panel empty">
          <b>
            Loading performance data...
          </b>
        </div>

      </section>
    );
  }

  /* ---------------------------------------------------
     ERROR
  --------------------------------------------------- */

  if (error) {
    return (
      <section>

        <Toolbar
          title="Performance"
          subtitle="Track employee productivity and task completion."
        />

        <div className="panel empty">
          <AlertTriangle size={30} />

          <b>{error}</b>

          <button
            className="primary"
            onClick={() =>
              window.location.reload()
            }
          >
            Retry
          </button>
        </div>

      </section>
    );
  }

  return (
    <section>

      <Toolbar
        title="Performance"
        subtitle="Track employee productivity and task completion."
      />

      {/* =================================================
          OVERALL PERFORMANCE
      ================================================= */}

      <div className="stats-grid">

        <StatCard
          icon={<ClipboardList size={20} />}
          label="Total Tasks"
          value={totalTasks}
          note="All assigned tasks"
        />

        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Completed"
          value={completedTasks}
          note={`${completionRate}% completion rate`}
        />

        <StatCard
          icon={<Clock3 size={20} />}
          label="In Progress"
          value={inProgressTasks}
          note="Currently being worked on"
        />

        <StatCard
          icon={<AlertTriangle size={20} />}
          label="Blocked"
          value={blockedTasks}
          note="Needs attention"
        />

      </div>

      {/* =================================================
          TEAM COMPLETION
      ================================================= */}

      <div className="performance-layout">

        <div className="panel">

          <div className="panel-head">

            <div>
              <div className="eyebrow">
                TEAM PERFORMANCE
              </div>

              <h3>
                Overall completion
              </h3>
            </div>

            <strong className="performance-rate">
              {completionRate}%
            </strong>

          </div>

          <div className="progress big">

            <i
              style={{
                width:
                  `${completionRate}%`
              }}
            />

          </div>

          <div className="performance-summary">

            <div>
              <b>{completedTasks}</b>
              <span>Completed</span>
            </div>

            <div>
              <b>{inProgressTasks}</b>
              <span>In Progress</span>
            </div>

            <div>
              <b>{pendingTasks}</b>
              <span>Pending</span>
            </div>

            <div>
              <b>{blockedTasks}</b>
              <span>Blocked</span>
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          EMPLOYEE PERFORMANCE
      ================================================= */}

      <div className="toolbar performance-toolbar">

        <div>

          <div className="eyebrow">
            EMPLOYEE PERFORMANCE
          </div>

          <h2>
            Team members
          </h2>

        </div>

      </div>

      {visibleEmployees.length === 0 ? (

        <div className="panel empty">

          <Users size={30} />

          <b>
            No employee performance data found.
          </b>

        </div>

      ) : (

        <div className="performance-grid">

          {visibleEmployees.map(
            (employee) => {

              const stats =
                getEmployeeStats(
                  employee.id
                );

              return (

                <div
                  className="panel performance-card"
                  key={employee.id}
                >

                  {/* Employee header */}

                  <div className="performance-person">

                    <div className="avatar">
                      {(
                        employee.fullName ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <h3>
                        {employee.fullName}
                      </h3>

                      <p>
                        {employee.designation ||
                          employee.role}
                      </p>

                    </div>

                  </div>

                  {/* Completion */}

                  <div className="performance-progress">

                    <div className="performance-progress-head">

                      <span>
                        Completion
                      </span>

                      <b>
                        {stats.rate}%
                      </b>

                    </div>

                    <div className="progress">

                      <i
                        style={{
                          width:
                            `${stats.rate}%`
                        }}
                      />

                    </div>

                  </div>

                  {/* Statistics */}

                  <div className="performance-numbers">

                    <div>
                      <b>
                        {stats.total}
                      </b>
                      <span>Total</span>
                    </div>

                    <div>
                      <b>
                        {stats.completed}
                      </b>
                      <span>Done</span>
                    </div>

                    <div>
                      <b>
                        {stats.inProgress}
                      </b>
                      <span>Active</span>
                    </div>

                    <div>
                      <b>
                        {stats.blocked}
                      </b>
                      <span>Blocked</span>
                    </div>

                  </div>

                </div>

              );
            }
          )}

        </div>

      )}

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