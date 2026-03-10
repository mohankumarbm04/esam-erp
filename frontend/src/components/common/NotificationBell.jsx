import React, { useEffect, useState } from "react";
import api from "../../utils/axiosConfig";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  useEffect(() => {
    let mounted = true;
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get("/notifications");
        if (!mounted) return;
        setNotifications(res.data?.notifications || []);
      } catch (e) {
        // Silent failure is fine for navbar/dashboard UI
        // console.error("Failed to load notifications", e?.message || e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchNotifications();
    return () => {
      mounted = false;
    };
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, readAt: new Date().toISOString() } : n)),
      );
    } catch (e) {
      // console.error("Failed to mark notification as read", e?.message || e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post("/notifications/read-all");
      const now = new Date().toISOString();
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: now })));
    } catch (e) {
      // console.error("Failed to mark all notifications as read", e?.message || e);
    }
  };

  return (
    <div className="navbar-notifications" style={{ position: "relative" }}>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "relative",
          padding: "6px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 20 }}>🔔</span>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              minWidth: 16,
              height: 16,
              borderRadius: 999,
              backgroundColor: "var(--primary, #2563EB)",
              color: "#fff",
              fontSize: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          className="modern-card"
          style={{
            position: "absolute",
            right: 0,
            top: "120%",
            width: 320,
            maxHeight: 360,
            overflow: "auto",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
            zIndex: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontWeight: 600 }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                className="btn btn-link"
                style={{ fontSize: 12, padding: 0 }}
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          {loading ? (
            <div style={{ padding: "8px 0", fontSize: 13, color: "var(--text-secondary)" }}>
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: "8px 0", fontSize: 13, color: "var(--text-secondary)" }}>
              No notifications.
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {notifications.map((n) => (
                <li
                  key={n._id}
                  style={{
                    padding: "8px 0",
                    borderTop: "1px solid var(--border)",
                    opacity: n.readAt ? 0.7 : 1,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      marginTop: 2,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {n.message}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                          })
                        : ""}
                    </span>
                    {!n.readAt && (
                      <button
                        type="button"
                        className="btn btn-link"
                        style={{ fontSize: 11, padding: 0 }}
                        onClick={() => handleMarkRead(n._id)}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

