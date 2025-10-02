import styles from "../pages/Dashboard.module.css";
import { Link } from "react-router-dom";

function TaskList({ tasks, loading, statusFilter, priorityFilter }) {
  const statusClasses = {
    done: styles.statusCompleted,
    due_today: styles.statusDueToday,
    missed: styles.statusOverdue,
    upcoming: styles.statusUpcoming,
  };

  const statusLabels = {
    done: "Completed",
    due_today: "Due Today",
    missed: "Overdue",
    upcoming: "Upcoming",
  };

  if (loading) return <p>Loading tasks...</p>;
  if (!tasks || tasks.length === 0) return <p>No tasks found.</p>;

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === "all" || task.status === statusFilter;
    const priorityMatch =
      priorityFilter === "all" || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  if (filteredTasks.length === 0) {
    return <p>No tasks match your filters.</p>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {filteredTasks.map((task) => (
        <Link
          key={task.id}
          to={`/tasks/${task.id}`}
          className="text-decoration-none"
        >
          <div className="p-3 border rounded shadow-sm">
            <h5>{task.title}</h5>
            <p>
              {task.description} <br />
              <small className="text-muted">Due: {task.due_date}</small>
            </p>
            <span
              className={`${styles.taskBadge} ${
                statusClasses[task.status] || styles.statusUpcoming
              }`}
            >
              {statusLabels[task.status] || task.status}
            </span>
            <div className="mt-2">
              <small className="text-muted">
                Assigned to: {task.assignee?.name || "N/A"} (
                {task.assignee?.email})
              </small>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default TaskList;
