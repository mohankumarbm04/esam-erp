import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./Admin.css";
import api from "../../utils/axiosConfig";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const TABS = [
  { id: "system", label: "System" },
  { id: "email", label: "Email" },
  { id: "backup", label: "Backup" },
  { id: "notifications", label: "Notifications" },
  { id: "roles", label: "Roles & Permissions" },
  { id: "academic", label: "Academic Years" },
  { id: "holidays", label: "Holidays" },
];

function toastFromError(err) {
  return (
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong"
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("system");

  const [alert, setAlert] = useState({ type: "", message: "" });
  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
    window.clearTimeout(showAlert._t);
    showAlert._t = window.setTimeout(() => setAlert({ type: "", message: "" }), 3500);
  }, []);

  // System
  const [system, setSystem] = useState({
    institutionName: "",
    logoUrl: "",
    timezone: "Asia/Kolkata",
    language: "en",
    theme: "light",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [savingSystem, setSavingSystem] = useState(false);

  // Email
  const [email, setEmail] = useState({
    smtpHost: "",
    smtpPort: 587,
    username: "",
    password: "",
    senderEmail: "",
    secure: false,
    hasPassword: false,
  });
  const [testEmailTo, setTestEmailTo] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);

  // Backup
  const [backup, setBackup] = useState({
    schedule: "off",
    lastBackupAt: null,
    lastBackupStatus: "never",
    lastBackupMessage: "",
  });
  const [savingBackup, setSavingBackup] = useState(false);
  const [runningBackup, setRunningBackup] = useState(false);

  // Notifications
  const [notif, setNotif] = useState({
    inAppEnabled: true,
    emailEnabled: false,
    smsEnabled: false,
    pushEnabled: false,
  });
  const [savingNotif, setSavingNotif] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [tplForm, setTplForm] = useState({
    id: "",
    key: "",
    channel: "email",
    name: "",
    subject: "",
    body: "",
    enabled: true,
  });
  const [savingTpl, setSavingTpl] = useState(false);
  const [confirmDeleteTpl, setConfirmDeleteTpl] = useState({ open: false, id: "" });

  // Roles
  const [roles, setRoles] = useState([]);
  const [roleForm, setRoleForm] = useState({ id: "", name: "", description: "" });
  const [rolePerms, setRolePerms] = useState(null);
  const [savingRole, setSavingRole] = useState(false);
  const [confirmDeleteRole, setConfirmDeleteRole] = useState({ open: false, id: "" });

  // Academic years
  const [years, setYears] = useState([]);
  const [yearForm, setYearForm] = useState({
    id: "",
    name: "",
    startDate: "",
    endDate: "",
    isActive: false,
  });
  const [savingYear, setSavingYear] = useState(false);
  const [confirmDeleteYear, setConfirmDeleteYear] = useState({ open: false, id: "" });

  // Holidays
  const [holidays, setHolidays] = useState([]);
  const [holidayForm, setHolidayForm] = useState({
    id: "",
    name: "",
    date: "",
    description: "",
  });
  const [savingHoliday, setSavingHoliday] = useState(false);
  const [confirmDeleteHoliday, setConfirmDeleteHoliday] = useState({ open: false, id: "" });

  const defaultPerms = useMemo(
    () => ({
      dashboard: { view: true, create: false, edit: false, delete: false },
      students: { view: true, create: false, edit: false, delete: false },
      teachers: { view: true, create: false, edit: false, delete: false },
      subjects: { view: true, create: false, edit: false, delete: false },
      departments: { view: true, create: false, edit: false, delete: false },
      attendance: { view: true, create: false, edit: false, delete: false },
      reports: { view: true, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false },
    }),
    [],
  );

  const loadAll = useCallback(async () => {
    try {
      const [sysRes, emailRes, backupRes, notifRes, tplRes, rolesRes, yearsRes, holidaysRes] =
        await Promise.all([
          api.get("/admin/settings/system"),
          api.get("/admin/settings/email"),
          api.get("/admin/settings/backup"),
          api.get("/admin/settings/notifications"),
          api.get("/admin/settings/notifications/templates"),
          api.get("/admin/settings/roles"),
          api.get("/admin/settings/academic-years"),
          api.get("/admin/settings/holidays"),
        ]);

      setSystem(sysRes.data?.settings || {});
      setEmail((prev) => ({
        ...prev,
        ...(emailRes.data?.settings || {}),
        password: "",
      }));
      setBackup(backupRes.data?.settings || {});
      setNotif(notifRes.data?.settings || {});
      setTemplates(tplRes.data?.templates || []);
      setRoles(rolesRes.data?.roles || []);
      setYears(yearsRes.data?.years || []);
      setHolidays(holidaysRes.data?.holidays || []);
    } catch (err) {
      showAlert("error", toastFromError(err));
    }
  }, [showAlert]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const saveSystem = async () => {
    try {
      setSavingSystem(true);
      const payload = {
        institutionName: system.institutionName,
        timezone: system.timezone,
        language: system.language,
        theme: system.theme,
      };
      const res = await api.put("/admin/settings/system", payload);
      setSystem(res.data?.settings || system);

      if (logoFile) {
        const fd = new FormData();
        fd.append("logo", logoFile);
        const up = await api.post("/admin/settings/system/logo", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSystem((s) => ({ ...s, logoUrl: up.data?.logoUrl || s.logoUrl }));
        setLogoFile(null);
      }

      showAlert("success", "System settings saved");
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setSavingSystem(false);
    }
  };

  const saveEmail = async () => {
    try {
      setSavingEmail(true);
      const payload = {
        smtpHost: email.smtpHost,
        smtpPort: Number(email.smtpPort),
        username: email.username,
        senderEmail: email.senderEmail,
        secure: !!email.secure,
      };
      if (email.password) payload.password = email.password;
      await api.put("/admin/settings/email", payload);
      setEmail((e) => ({ ...e, password: "", hasPassword: true }));
      showAlert("success", "Email settings saved");
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setSavingEmail(false);
    }
  };

  const testEmail = async () => {
    try {
      setTestingEmail(true);
      await api.post("/admin/settings/email/test", { to: testEmailTo });
      showAlert("success", "Test email sent");
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setTestingEmail(false);
    }
  };

  const saveBackup = async () => {
    try {
      setSavingBackup(true);
      const res = await api.put("/admin/settings/backup", { schedule: backup.schedule });
      setBackup(res.data?.settings || backup);
      showAlert("success", "Backup settings saved");
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setSavingBackup(false);
    }
  };

  const runManualBackup = async () => {
    try {
      setRunningBackup(true);
      const res = await api.post("/admin/settings/backup/manual", null, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dispo = res.headers?.["content-disposition"] || "";
      const match = dispo.match(/filename="([^"]+)"/);
      a.download = match?.[1] || "esam-erp-backup.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      await loadAll();
      showAlert("success", "Backup downloaded");
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setRunningBackup(false);
    }
  };

  const saveNotifications = async () => {
    try {
      setSavingNotif(true);
      const res = await api.put("/admin/settings/notifications", {
        inAppEnabled: !!notif.inAppEnabled,
        emailEnabled: !!notif.emailEnabled,
        smsEnabled: !!notif.smsEnabled,
        pushEnabled: !!notif.pushEnabled,
      });
      setNotif(res.data?.settings || notif);
      showAlert("success", "Notification settings saved");
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setSavingNotif(false);
    }
  };

  const startNewTemplate = () => {
    setTplForm({
      id: "",
      key: "",
      channel: "email",
      name: "",
      subject: "",
      body: "",
      enabled: true,
    });
  };

  const editTemplate = (t) => {
    setTplForm({
      id: t._id,
      key: t.key || "",
      channel: t.channel || "email",
      name: t.name || "",
      subject: t.subject || "",
      body: t.body || "",
      enabled: t.enabled !== false,
    });
  };

  const saveTemplate = async () => {
    try {
      if (!tplForm.key.trim()) return showAlert("error", "Template key is required");
      if (!tplForm.body.trim()) return showAlert("error", "Template body is required");
      setSavingTpl(true);

      if (tplForm.id) {
        const res = await api.put(`/admin/settings/notifications/templates/${tplForm.id}`, {
          key: tplForm.key,
          channel: tplForm.channel,
          name: tplForm.name,
          subject: tplForm.subject,
          body: tplForm.body,
          enabled: !!tplForm.enabled,
        });
        setTemplates((prev) =>
          prev.map((x) => (x._id === tplForm.id ? res.data?.template || x : x)),
        );
      } else {
        const res = await api.post("/admin/settings/notifications/templates", {
          key: tplForm.key,
          channel: tplForm.channel,
          name: tplForm.name,
          subject: tplForm.subject,
          body: tplForm.body,
          enabled: !!tplForm.enabled,
        });
        setTemplates((prev) => [res.data?.template, ...prev].filter(Boolean));
      }

      showAlert("success", "Template saved");
      startNewTemplate();
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setSavingTpl(false);
    }
  };

  const deleteTemplate = async () => {
    const id = confirmDeleteTpl.id;
    if (!id) return;
    try {
      await api.delete(`/admin/settings/notifications/templates/${id}`);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
      showAlert("success", "Template deleted");
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setConfirmDeleteTpl({ open: false, id: "" });
    }
  };

  const startNewRole = () => {
    setRoleForm({ id: "", name: "", description: "" });
    setRolePerms(JSON.parse(JSON.stringify(defaultPerms)));
  };

  const editRole = (role) => {
    setRoleForm({ id: role._id, name: role.name, description: role.description || "" });
    setRolePerms(role.permissions || JSON.parse(JSON.stringify(defaultPerms)));
  };

  const saveRole = async () => {
    try {
      if (!roleForm.name.trim()) return showAlert("error", "Role name is required");
      if (!rolePerms) return showAlert("error", "Permissions are required");
      setSavingRole(true);
      if (roleForm.id) {
        const res = await api.put(`/admin/settings/roles/${roleForm.id}`, {
          name: roleForm.name,
          description: roleForm.description,
          permissions: rolePerms,
        });
        setRoles((prev) =>
          prev.map((r) => (r._id === roleForm.id ? res.data?.role || r : r)),
        );
      } else {
        const res = await api.post("/admin/settings/roles", {
          name: roleForm.name,
          description: roleForm.description,
          permissions: rolePerms,
        });
        setRoles((prev) => [res.data?.role, ...prev].filter(Boolean));
      }
      showAlert("success", "Role saved");
      startNewRole();
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setSavingRole(false);
    }
  };

  const deleteRole = async () => {
    const id = confirmDeleteRole.id;
    if (!id) return;
    try {
      await api.delete(`/admin/settings/roles/${id}`);
      setRoles((prev) => prev.filter((r) => r._id !== id));
      showAlert("success", "Role deleted");
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setConfirmDeleteRole({ open: false, id: "" });
    }
  };

  const startNewYear = () => {
    setYearForm({ id: "", name: "", startDate: "", endDate: "", isActive: false });
  };

  const editYear = (y) => {
    setYearForm({
      id: y._id,
      name: y.name || "",
      startDate: y.startDate ? String(y.startDate).slice(0, 10) : "",
      endDate: y.endDate ? String(y.endDate).slice(0, 10) : "",
      isActive: !!y.isActive,
    });
  };

  const saveYear = async () => {
    try {
      if (!yearForm.name.trim()) return showAlert("error", "Academic year name is required");
      if (!yearForm.startDate || !yearForm.endDate) {
        return showAlert("error", "Start date and end date are required");
      }
      setSavingYear(true);
      if (yearForm.id) {
        const res = await api.put(`/admin/settings/academic-years/${yearForm.id}`, {
          name: yearForm.name,
          startDate: yearForm.startDate,
          endDate: yearForm.endDate,
          isActive: yearForm.isActive,
        });
        setYears((prev) =>
          prev.map((y) => (y._id === yearForm.id ? res.data?.year || y : y)),
        );
      } else {
        const res = await api.post("/admin/settings/academic-years", {
          name: yearForm.name,
          startDate: yearForm.startDate,
          endDate: yearForm.endDate,
          isActive: yearForm.isActive,
        });
        setYears((prev) => [res.data?.year, ...prev].filter(Boolean));
      }
      await loadAll();
      showAlert("success", "Academic year saved");
      startNewYear();
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setSavingYear(false);
    }
  };

  const deleteYear = async () => {
    const id = confirmDeleteYear.id;
    if (!id) return;
    try {
      await api.delete(`/admin/settings/academic-years/${id}`);
      setYears((prev) => prev.filter((y) => y._id !== id));
      showAlert("success", "Academic year deleted");
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setConfirmDeleteYear({ open: false, id: "" });
    }
  };

  const startNewHoliday = () => {
    setHolidayForm({ id: "", name: "", date: "", description: "" });
  };

  const editHoliday = (h) => {
    setHolidayForm({
      id: h._id,
      name: h.name || "",
      date: h.date ? String(h.date).slice(0, 10) : "",
      description: h.description || "",
    });
  };

  const saveHoliday = async () => {
    try {
      if (!holidayForm.name.trim()) return showAlert("error", "Holiday name is required");
      if (!holidayForm.date) return showAlert("error", "Holiday date is required");
      setSavingHoliday(true);
      if (holidayForm.id) {
        const res = await api.put(`/admin/settings/holidays/${holidayForm.id}`, {
          name: holidayForm.name,
          date: holidayForm.date,
          description: holidayForm.description,
        });
        setHolidays((prev) =>
          prev.map((h) => (h._id === holidayForm.id ? res.data?.holiday || h : h)),
        );
      } else {
        const res = await api.post("/admin/settings/holidays", {
          name: holidayForm.name,
          date: holidayForm.date,
          description: holidayForm.description,
        });
        setHolidays((prev) => [res.data?.holiday, ...prev].filter(Boolean));
      }
      showAlert("success", "Holiday saved");
      startNewHoliday();
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setSavingHoliday(false);
    }
  };

  const deleteHoliday = async () => {
    const id = confirmDeleteHoliday.id;
    if (!id) return;
    try {
      await api.delete(`/admin/settings/holidays/${id}`);
      setHolidays((prev) => prev.filter((h) => h._id !== id));
      showAlert("success", "Holiday deleted");
    } catch (err) {
      showAlert("error", toastFromError(err));
    } finally {
      setConfirmDeleteHoliday({ open: false, id: "" });
    }
  };

  const togglePerm = (moduleKey, permKey) => {
    setRolePerms((p) => ({
      ...p,
      [moduleKey]: { ...(p?.[moduleKey] || {}), [permKey]: !p?.[moduleKey]?.[permKey] },
    }));
  };

  const moduleRows = [
    { key: "dashboard", label: "Dashboard" },
    { key: "students", label: "Students" },
    { key: "teachers", label: "Teachers" },
    { key: "subjects", label: "Subjects" },
    { key: "departments", label: "Departments" },
    { key: "attendance", label: "Attendance" },
    { key: "reports", label: "Reports" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="modern-dashboard settings-page">
      <div className="modern-header-clean settings-header">
        <div>
          <h1>Admin Settings</h1>
          <p>Manage system configuration, roles, academic years and holidays.</p>
        </div>
      </div>

      {alert.message ? (
        <div className={`alert ${alert.type === "error" ? "alert-error" : "alert-success"}`}>
          {alert.message}
        </div>
      ) : null}

      <div className="modern-card settings-container" style={{ padding: 0, overflow: "hidden" }}>
        <div className="settings-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`btn settings-tab-btn ${
                activeTab === t.id ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: 16 }}>
          {activeTab === "system" ? (
            <div className="grid-2">
              <div className="form-group">
                <label>College / Institution Name</label>
                <input
                  className="form-control"
                  value={system.institutionName || ""}
                  onChange={(e) => setSystem((s) => ({ ...s, institutionName: e.target.value }))}
                  placeholder="Enter institution name"
                />
              </div>

              <div className="form-group">
                <label>Logo upload</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
                {system.logoUrl ? (
                  <div style={{ marginTop: 10 }}>
                    <img
                      src={system.logoUrl}
                      alt="Logo"
                      style={{ height: 40, width: "auto", objectFit: "contain" }}
                    />
                  </div>
                ) : null}
              </div>

              <div className="form-group">
                <label>System timezone</label>
                <input
                  className="form-control"
                  value={system.timezone || ""}
                  onChange={(e) => setSystem((s) => ({ ...s, timezone: e.target.value }))}
                  placeholder="Asia/Kolkata"
                />
              </div>

              <div className="form-group">
                <label>Default language</label>
                <select
                  className="form-control"
                  value={system.language || "en"}
                  onChange={(e) => setSystem((s) => ({ ...s, language: e.target.value }))}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="kn">Kannada</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </div>

              <div className="form-group">
                <label>System theme</label>
                <select
                  className="form-control"
                  value={system.theme || "light"}
                  onChange={(e) => setSystem((s) => ({ ...s, theme: e.target.value }))}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "end", gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveSystem}
                  disabled={savingSystem}
                >
                  {savingSystem ? "Saving..." : "Save System Settings"}
                </button>
              </div>
            </div>
          ) : null}

          {activeTab === "email" ? (
            <div className="grid-2">
              <div className="form-group">
                <label>SMTP Host</label>
                <input
                  className="form-control"
                  value={email.smtpHost}
                  onChange={(e) => setEmail((s) => ({ ...s, smtpHost: e.target.value }))}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="form-group">
                <label>SMTP Port</label>
                <input
                  className="form-control"
                  type="number"
                  value={email.smtpPort}
                  onChange={(e) => setEmail((s) => ({ ...s, smtpPort: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Email username</label>
                <input
                  className="form-control"
                  value={email.username}
                  onChange={(e) => setEmail((s) => ({ ...s, username: e.target.value }))}
                  placeholder="username"
                />
              </div>
              <div className="form-group">
                <label>Email password {email.hasPassword ? "(saved)" : ""}</label>
                <input
                  className="form-control"
                  type="password"
                  value={email.password}
                  onChange={(e) => setEmail((s) => ({ ...s, password: e.target.value }))}
                  placeholder="Leave blank to keep existing"
                />
              </div>
              <div className="form-group">
                <label>Sender email</label>
                <input
                  className="form-control"
                  value={email.senderEmail}
                  onChange={(e) => setEmail((s) => ({ ...s, senderEmail: e.target.value }))}
                  placeholder="noreply@college.edu"
                />
              </div>
              <div className="form-group">
                <label>Secure (SSL/TLS)</label>
                <select
                  className="form-control"
                  value={email.secure ? "true" : "false"}
                  onChange={(e) => setEmail((s) => ({ ...s, secure: e.target.value === "true" }))}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "end", gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveEmail}
                  disabled={savingEmail}
                >
                  {savingEmail ? "Saving..." : "Save Email Settings"}
                </button>
              </div>

              <div className="form-group">
                <label>Test email (send to)</label>
                <input
                  className="form-control"
                  value={testEmailTo}
                  onChange={(e) => setTestEmailTo(e.target.value)}
                  placeholder="test@domain.com"
                />
                <div style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={testEmail}
                    disabled={testingEmail}
                  >
                    {testingEmail ? "Testing..." : "Send Test Email"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "backup" ? (
            <div className="grid-2">
              <div className="form-group">
                <label>Automatic backup schedule</label>
                <select
                  className="form-control"
                  value={backup.schedule || "off"}
                  onChange={(e) => setBackup((b) => ({ ...b, schedule: e.target.value }))}
                >
                  <option value="off">Off</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
                <div style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveBackup}
                    disabled={savingBackup}
                  >
                    {savingBackup ? "Saving..." : "Save Backup Settings"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Backup status</label>
                <div className="modern-card" style={{ padding: 12 }}>
                  <div style={{ color: "var(--text-secondary)" }}>
                    <div>
                      <strong>Status:</strong> {backup.lastBackupStatus || "never"}
                    </div>
                    <div>
                      <strong>Last backup:</strong>{" "}
                      {backup.lastBackupAt ? new Date(backup.lastBackupAt).toLocaleString() : "-"}
                    </div>
                    <div>
                      <strong>Message:</strong> {backup.lastBackupMessage || "-"}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={runManualBackup}
                  disabled={runningBackup}
                >
                  {runningBackup ? "Preparing..." : "Manual Database Backup (Download)"}
                </button>
              </div>
            </div>
          ) : null}

          {activeTab === "notifications" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>
              <div>
                <h3 style={{ marginTop: 0 }}>Notification channels</h3>
                <div className="modern-card" style={{ padding: 12 }}>
                  <div style={{ display: "grid", gap: 10 }}>
                    <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!notif.inAppEnabled}
                        onChange={(e) =>
                          setNotif((s) => ({ ...s, inAppEnabled: e.target.checked }))
                        }
                      />
                      <span>Send notifications to users (in-app)</span>
                    </label>
                    <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!notif.emailEnabled}
                        onChange={(e) =>
                          setNotif((s) => ({ ...s, emailEnabled: e.target.checked }))
                        }
                      />
                      <span>Email alerts</span>
                    </label>
                    <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!notif.smsEnabled}
                        onChange={(e) =>
                          setNotif((s) => ({ ...s, smsEnabled: e.target.checked }))
                        }
                      />
                      <span>SMS alerts</span>
                    </label>
                    <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={!!notif.pushEnabled}
                        onChange={(e) =>
                          setNotif((s) => ({ ...s, pushEnabled: e.target.checked }))
                        }
                      />
                      <span>Push notifications</span>
                    </label>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={saveNotifications}
                      disabled={savingNotif}
                    >
                      {savingNotif ? "Saving..." : "Save Notification Settings"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <h3 style={{ marginTop: 0 }}>Notification templates</h3>
                  <button type="button" className="btn btn-secondary" onClick={startNewTemplate}>
                    New Template
                  </button>
                </div>

                <div className="modern-card" style={{ padding: 0, marginTop: 12 }}>
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Channel</th>
                        <th>Enabled</th>
                        <th style={{ width: 160 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ color: "var(--text-secondary)" }}>
                            No templates found.
                          </td>
                        </tr>
                      ) : (
                        templates.map((t) => (
                          <tr key={t._id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{t.key}</div>
                              {t.name ? (
                                <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                                  {t.name}
                                </div>
                              ) : null}
                            </td>
                            <td>{t.channel}</td>
                            <td>{t.enabled === false ? "No" : "Yes"}</td>
                            <td>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="action-btn action-btn--edit"
                                  onClick={() => editTemplate(t)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-btn action-btn--delete"
                                  onClick={() => setConfirmDeleteTpl({ open: true, id: t._id })}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <h3 style={{ marginTop: 16 }}>Template editor</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Key</label>
                    <input
                      className="form-control"
                      value={tplForm.key}
                      onChange={(e) => setTplForm((s) => ({ ...s, key: e.target.value }))}
                      placeholder="e.g. student_created"
                    />
                  </div>
                  <div className="form-group">
                    <label>Channel</label>
                    <select
                      className="form-control"
                      value={tplForm.channel}
                      onChange={(e) => setTplForm((s) => ({ ...s, channel: e.target.value }))}
                    >
                      <option value="inapp">In-app</option>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="push">Push</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Name (label)</label>
                    <input
                      className="form-control"
                      value={tplForm.name}
                      onChange={(e) => setTplForm((s) => ({ ...s, name: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="form-group">
                    <label>Enabled</label>
                    <select
                      className="form-control"
                      value={tplForm.enabled ? "true" : "false"}
                      onChange={(e) =>
                        setTplForm((s) => ({ ...s, enabled: e.target.value === "true" }))
                      }
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Subject (for email/push)</label>
                    <input
                      className="form-control"
                      value={tplForm.subject}
                      onChange={(e) => setTplForm((s) => ({ ...s, subject: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Body</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={tplForm.body}
                      onChange={(e) => setTplForm((s) => ({ ...s, body: e.target.value }))}
                      placeholder="Template text. You can use placeholders like {{name}}"
                    />
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveTemplate}
                    disabled={savingTpl}
                  >
                    {savingTpl ? "Saving..." : tplForm.id ? "Update Template" : "Create Template"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={startNewTemplate}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "roles" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <h3 style={{ margin: 0 }}>Roles</h3>
                  <button type="button" className="btn btn-secondary" onClick={startNewRole}>
                    New Role
                  </button>
                </div>
                <div style={{ marginTop: 12 }}>
                  {roles.length === 0 ? (
                    <div style={{ color: "var(--text-secondary)" }}>No roles found.</div>
                  ) : (
                    <div className="modern-card" style={{ padding: 0 }}>
                      <table className="erp-table">
                        <thead>
                          <tr>
                            <th>Role</th>
                            <th style={{ width: 140 }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roles.map((r) => (
                            <tr key={r._id}>
                              <td>
                                <div style={{ fontWeight: 600 }}>{r.name}</div>
                                {r.description ? (
                                  <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                                    {r.description}
                                  </div>
                                ) : null}
                              </td>
                              <td>
                                <div className="table-actions">
                                  <button
                                    type="button"
                                    className="action-btn action-btn--edit"
                                    onClick={() => editRole(r)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="action-btn action-btn--delete"
                                    onClick={() => setConfirmDeleteRole({ open: true, id: r._id })}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ marginTop: 0 }}>Role editor</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Role name</label>
                    <input
                      className="form-control"
                      value={roleForm.name}
                      onChange={(e) => setRoleForm((s) => ({ ...s, name: e.target.value }))}
                      placeholder="e.g. Teacher"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      className="form-control"
                      value={roleForm.description}
                      onChange={(e) =>
                        setRoleForm((s) => ({ ...s, description: e.target.value }))
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="modern-card" style={{ padding: 0, marginTop: 12 }}>
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th style={{ width: 80, textAlign: "center" }}>View</th>
                        <th style={{ width: 80, textAlign: "center" }}>Create</th>
                        <th style={{ width: 80, textAlign: "center" }}>Edit</th>
                        <th style={{ width: 80, textAlign: "center" }}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {moduleRows.map((m) => (
                        <tr key={m.key}>
                          <td style={{ fontWeight: 600 }}>{m.label}</td>
                          {["view", "create", "edit", "delete"].map((p) => (
                            <td key={p} style={{ textAlign: "center" }}>
                              <input
                                type="checkbox"
                                checked={!!rolePerms?.[m.key]?.[p]}
                                onChange={() => togglePerm(m.key, p)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveRole}
                    disabled={savingRole}
                  >
                    {savingRole ? "Saving..." : roleForm.id ? "Update Role" : "Create Role"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={startNewRole}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "academic" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>
              <div>
                <h3 style={{ marginTop: 0 }}>Academic years</h3>
                <div className="modern-card" style={{ padding: 0 }}>
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Active</th>
                        <th style={{ width: 160 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {years.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ color: "var(--text-secondary)" }}>
                            No academic years found.
                          </td>
                        </tr>
                      ) : (
                        years.map((y) => (
                          <tr key={y._id}>
                            <td style={{ fontWeight: 600 }}>{y.name}</td>
                            <td>{y.startDate ? String(y.startDate).slice(0, 10) : "-"}</td>
                            <td>{y.endDate ? String(y.endDate).slice(0, 10) : "-"}</td>
                            <td>{y.isActive ? "Yes" : "No"}</td>
                            <td>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="action-btn action-btn--edit"
                                  onClick={() => editYear(y)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-btn action-btn--delete"
                                  onClick={() => setConfirmDeleteYear({ open: true, id: y._id })}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 style={{ marginTop: 0 }}>Add / edit academic year</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      className="form-control"
                      value={yearForm.name}
                      onChange={(e) => setYearForm((s) => ({ ...s, name: e.target.value }))}
                      placeholder="2025-2026"
                    />
                  </div>
                  <div className="form-group">
                    <label>Set as current active</label>
                    <select
                      className="form-control"
                      value={yearForm.isActive ? "true" : "false"}
                      onChange={(e) =>
                        setYearForm((s) => ({ ...s, isActive: e.target.value === "true" }))
                      }
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Start date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={yearForm.startDate}
                      onChange={(e) => setYearForm((s) => ({ ...s, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>End date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={yearForm.endDate}
                      onChange={(e) => setYearForm((s) => ({ ...s, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveYear}
                    disabled={savingYear}
                  >
                    {savingYear ? "Saving..." : yearForm.id ? "Update Year" : "Add Year"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={startNewYear}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "holidays" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16 }}>
              <div>
                <h3 style={{ marginTop: 0 }}>Holiday calendar</h3>
                <div className="modern-card" style={{ padding: 0 }}>
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Holiday</th>
                        <th>Description</th>
                        <th style={{ width: 160 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holidays.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ color: "var(--text-secondary)" }}>
                            No holidays found.
                          </td>
                        </tr>
                      ) : (
                        holidays.map((h) => (
                          <tr key={h._id}>
                            <td>{h.date ? String(h.date).slice(0, 10) : "-"}</td>
                            <td style={{ fontWeight: 600 }}>{h.name}</td>
                            <td style={{ color: "var(--text-secondary)" }}>
                              {h.description || "-"}
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="action-btn action-btn--edit"
                                  onClick={() => editHoliday(h)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-btn action-btn--delete"
                                  onClick={() =>
                                    setConfirmDeleteHoliday({ open: true, id: h._id })
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 style={{ marginTop: 0 }}>Add / edit holiday</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Holiday name</label>
                    <input
                      className="form-control"
                      value={holidayForm.name}
                      onChange={(e) => setHolidayForm((s) => ({ ...s, name: e.target.value }))}
                      placeholder="e.g. Independence Day"
                    />
                  </div>
                  <div className="form-group">
                    <label>Holiday date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={holidayForm.date}
                      onChange={(e) => setHolidayForm((s) => ({ ...s, date: e.target.value }))}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Description</label>
                    <input
                      className="form-control"
                      value={holidayForm.description}
                      onChange={(e) =>
                        setHolidayForm((s) => ({ ...s, description: e.target.value }))
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={saveHoliday}
                    disabled={savingHoliday}
                  >
                    {savingHoliday ? "Saving..." : holidayForm.id ? "Update Holiday" : "Add Holiday"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={startNewHoliday}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDeleteRole.open}
        title="Delete role?"
        message="This will permanently delete the role."
        confirmText="Delete"
        danger
        onConfirm={deleteRole}
        onCancel={() => setConfirmDeleteRole({ open: false, id: "" })}
      />
      <ConfirmDialog
        open={confirmDeleteYear.open}
        title="Delete academic year?"
        message="This will permanently delete the academic year."
        confirmText="Delete"
        danger
        onConfirm={deleteYear}
        onCancel={() => setConfirmDeleteYear({ open: false, id: "" })}
      />
      <ConfirmDialog
        open={confirmDeleteHoliday.open}
        title="Delete holiday?"
        message="This will permanently delete the holiday."
        confirmText="Delete"
        danger
        onConfirm={deleteHoliday}
        onCancel={() => setConfirmDeleteHoliday({ open: false, id: "" })}
      />
      <ConfirmDialog
        open={confirmDeleteTpl.open}
        title="Delete template?"
        message="This will permanently delete the notification template."
        confirmText="Delete"
        danger
        onConfirm={deleteTemplate}
        onCancel={() => setConfirmDeleteTpl({ open: false, id: "" })}
      />
    </div>
  );
}

