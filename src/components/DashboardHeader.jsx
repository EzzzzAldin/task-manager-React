import { useState, useEffect } from "react";
import api from "../services/api";

const DashboardHeader = ({ onTaskAdded }) => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    assignee_email: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user");
        setUser(res.data);
        setFormData((prev) => ({ ...prev, assignee_email: res.data.email }));
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await api.post("/tasks", formData);
      setToast({ type: "success", text: "Task created successfully!" });
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        due_date: "",
        priority: "medium",
        assignee_email: user.email,
      });
      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.errors) {
          setErrors(data.errors);
        } else if (data.message) {
          setToast({ type: "danger", text: data.message });
        }
      } else {
        setToast({ type: "danger", text: "Failed to create task" });
      }
    }
  };

  return (
    <div className="text-center position-relative">
      <h4>Hello, {user ? user.name : "..."}</h4>
      {toast && (
        <div
          className={`alert alert-${toast.type} mt-2`}
          role="alert"
          style={{ transition: "all 0.3s" }}
        >
          {toast.text}
        </div>
      )}

      <button
        className="btn btn-gradient w-100 mt-3 mb-4"
        onClick={() => setShowModal(true)}
      >
        Add New Task
      </button>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <form onSubmit={handleSubmit}>
                <div className="modal-header bg-gradient text-white p-3 rounded-top-4">
                  <h5 className="modal-title">Add New Task</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3 form-floating">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.title ? "is-invalid" : ""
                      }`}
                      placeholder="Title"
                      required
                    />
                    <label>Title</label>
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title[0]}</div>
                    )}
                  </div>

                  <div className="mb-3 form-floating">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.description ? "is-invalid" : ""
                      }`}
                      placeholder="Description"
                      style={{ height: "100px" }}
                    ></textarea>
                    <label>Description</label>
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description[0]}
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3 form-floating">
                      <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.due_date ? "is-invalid" : ""
                        }`}
                        placeholder="Due Date"
                        required
                      />
                      <label>Due Date</label>
                      {errors.due_date && (
                        <div className="invalid-feedback">
                          {errors.due_date[0]}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3 form-floating">
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      <label>Priority</label>
                    </div>
                  </div>

                  <div className="mb-3 form-floating">
                    <input
                      type="email"
                      name="assignee_email"
                      value={formData.assignee_email}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.assignee_email ? "is-invalid" : ""
                      }`}
                      placeholder="Assignee Email"
                      required
                    />
                    <label>Assignee Email</label>
                    {errors.assignee_email && (
                      <div className="invalid-feedback">
                        {errors.assignee_email[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-gradient">
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
