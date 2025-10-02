import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Flag, CheckCircle, User } from "lucide-react";
import api from "../services/api";
import styles from "../pages/Dashboard.module.css";

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data.data);
      } catch (err) {
        console.error("Failed to fetch task:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading)
    return <p className="text-center mt-5">Loading task details...</p>;
  if (!task) return <p className="text-center mt-5">Task not found</p>;

  return (
    <div className="container mt-5">
      <div className={`p-4 shadow-lg rounded-4 ${styles.detailsCard}`}>
        <div className="row g-4">
          <div className="col-md-8">
            <h2 className={styles.detailsTitle}>{task.title}</h2>
            <p className="text-muted">
              {task.description || "No description provided"}
            </p>

            <div className="d-flex flex-wrap gap-3 mt-4">
              <div className={styles.detailItem}>
                <Calendar size={18} className="me-2 text-primary" />
                <strong>Due:</strong> {task.due_date}
              </div>
              <div className={styles.detailItem}>
                <Flag size={18} className="me-2 text-danger" />
                <strong>Priority:</strong>{" "}
                <span className={`${styles.badge} ${styles[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              <div className={styles.detailItem}>
                <CheckCircle size={18} className="me-2 text-success" />
                <strong>Status:</strong>{" "}
                <span className={`${styles.badge} ${styles[task.status]}`}>
                  {task.status.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="mt-3">
              <p>
                <strong>Completed:</strong>{" "}
                {task.is_completed ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className={styles.infoBox}>
              <h5 className="mb-3">People</h5>
              <div className={styles.userInfo}>
                <User size={18} className="me-2 text-primary" />
                <span>
                  <strong>Creator:</strong> {task.creator.name} (
                  {task.creator.email})
                </span>
              </div>
              <div className={styles.userInfo}>
                <User size={18} className="me-2 text-secondary" />
                <span>
                  <strong>Assignee:</strong> {task.assignee?.name} (
                  {task.assignee?.email})
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="text-center">
          <small className="text-muted d-block mb-3">
            Created at: {task.created_at} <br />
            Updated at: {task.updated_at}
          </small>
          <Link to="/dashboard" className="btn btn-gradient px-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
