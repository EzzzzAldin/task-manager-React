import { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader";
import TaskList from "../components/TaskList";
import api from "../services/api";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className={`container-fluid p-4 ${styles.dashboardContainer}`}>
      <div className="row">
        <aside className="col-md-3">
          <div className={styles.sidebar}>
            <DashboardHeader onTaskAdded={fetchTasks} />

            <hr />

            <h5 className="mt-4">Filter by Status</h5>
            <ul className="list-group">
              {[
                { key: "all", label: "All" },
                { key: "due_today", label: "🟡 Due Today" },
                { key: "missed", label: "🔴 Overdue" },
                { key: "done", label: "🟢 Completed" },
                { key: "upcoming", label: "🔵 Upcoming" },
              ].map((item) => (
                <li
                  key={item.key}
                  className={`list-group-item ${styles.filterItem} ${
                    statusFilter === item.key ? styles.active : ""
                  }`}
                  onClick={() => setStatusFilter(item.key)}
                >
                  {item.label}
                </li>
              ))}
            </ul>

            <h5 className="mt-4">Filter by Priority</h5>
            <ul className="list-group">
              {["all", "high", "medium", "low"].map((priority) => (
                <li
                  key={priority}
                  className={`list-group-item ${styles.filterItem} ${
                    priorityFilter === priority ? styles.active : ""
                  }`}
                  onClick={() => setPriorityFilter(priority)}
                >
                  {priority === "all"
                    ? "All"
                    : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="col-md-9">
          <div className={styles.mainContent}>
            <TaskList
              tasks={tasks}
              loading={loading}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
