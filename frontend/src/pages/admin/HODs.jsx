import "./Admin.css";
import React, { useCallback, useEffect, useState } from "react";
import api from "../../utils/axiosConfig";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const HODs = () => {
  const [hods, setHods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isActive: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const fetchHods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/hods");
      setHods(response.data.hods || []);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to load HODs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHods();
  }, [fetchHods]);

  const resetForm = () => {
    setFormData({ username: "", email: "", password: "", isActive: true });
  };

  const handleEdit = (hod) => {
    setEditingId(hod._id || hod.id);
    setFormData({
      username: hod.username || "",
      email: hod.email || "",
      password: "",
      isActive: hod.isActive !== false,
    });
    setFieldErrors({});
    setShowForm(true);
  };

  const requestDelete = (id) => setConfirm({ open: true, id });

  const confirmDelete = async () => {
    if (!confirm.id) return;
    setError("");
    setSuccess("");
    setDeleting(true);
    try {
      await api.delete(`/admin/hods/${confirm.id}`);
      setHods((prev) => prev.filter((h) => (h._id || h.id) !== confirm.id));
      setSuccess("HOD deleted successfully");
    } catch (e) {
      setError(e.response?.data?.error || "Failed to delete HOD");
    } finally {
      setDeleting(false);
      setConfirm({ open: false, id: null });
    }
  };

  const validate = () => {
    const next = {};
    if (!formData.username.trim()) next.username = "Username is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) next.email = "Invalid email";
    if (!editingId && !formData.password) next.password = "Password is required";
    if (formData.password && formData.password.length < 6)
      next.password = "Password must be at least 6 characters";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;

    try {
      if (editingId) {
        const response = await api.put(`/admin/hods/${editingId}`, formData);
        const updated = response.data.hod;
        setHods((prev) =>
          prev.map((h) =>
            (h._id || h.id) === editingId ? { ...h, ...updated, _id: h._id || updated.id } : h,
          ),
        );
        setSuccess("HOD updated successfully");
      } else {
        const response = await api.post("/admin/hods", formData);
        const created = response.data.hod;
        setHods((prev) => [{ ...created, _id: created.id }, ...prev]);
        setSuccess("HOD created successfully");
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (e) {
      setError(e.response?.data?.error || "Failed to save HOD");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      <div className="modern-header-clean">
        <div>
          <h1>HOD Management</h1>
          <p>Manage HOD user accounts and assignments</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingId(null);
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? (
              <>
                <XMarkIcon className="w-5 h-5 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5 mr-2" />
                Add HOD
              </>
            )}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error mb-6">{error}</div>}
      {success && <div className="alert alert-success mb-6">{success}</div>}

      {showForm && (
        <div className="card mb-6 slide-in">
          <h2>{editingId ? "Edit HOD" : "Create HOD"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                {fieldErrors.username && (
                  <div className="input-error-message">{fieldErrors.username}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                {fieldErrors.email && (
                  <div className="input-error-message">{fieldErrors.email}</div>
                )}
              </div>
              <div className="form-group md:col-span-2">
                <label className="form-label">
                  Password {editingId ? "(leave blank to keep)" : ""}
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingId}
                />
                {fieldErrors.password && (
                  <div className="input-error-message">{fieldErrors.password}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Active</label>
                <select
                  className="form-input"
                  value={formData.isActive ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.value === "true" })
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-success">
                {editingId ? "Update HOD" : "Create HOD"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hods.map((h) => (
              <tr key={h._id || h.id}>
                <td className="font-medium">{h.username}</td>
                <td className="text-muted">{h.email}</td>
                <td>
                  {h.isActive === false ? (
                    <span className="badge badge-warning">Inactive</span>
                  ) : (
                    <span className="badge badge-success">Active</span>
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(h)}
                      className="action-btn action-btn--edit"
                      title="Edit"
                    >
                      <PencilIcon className="action-icon" />
                    </button>
                    <button
                      onClick={() => requestDelete(h._id || h.id)}
                      className="action-btn action-btn--delete"
                      title="Delete"
                    >
                      <TrashIcon className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {hods.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No HOD users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Delete HOD"
        message="Delete this HOD user? They will be unassigned from any departments."
        confirmText="Delete"
        danger
        loading={deleting}
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default HODs;

