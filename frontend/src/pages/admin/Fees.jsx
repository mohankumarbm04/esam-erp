import "./Admin.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../utils/axiosConfig";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const TABS = [
  { id: "structures", label: "Fee Structures" },
  { id: "collect", label: "Fee Collection" },
  { id: "dues", label: "Due Payments" },
  { id: "history", label: "Payment History" },
  { id: "reports", label: "Fee Reports" },
];

function formatDateInput(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

const Fees = () => {
  const [activeTab, setActiveTab] = useState("structures");

  const [structures, setStructures] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [structureForm, setStructureForm] = useState({
    id: "",
    name: "",
    departmentId: "",
    semester: "",
    amount: "",
    dueDate: "",
    isActive: true,
  });
  const [savingStructure, setSavingStructure] = useState(false);
  const [confirmDeleteStruct, setConfirmDeleteStruct] = useState({
    open: false,
    id: "",
  });

  // Fee collection
  const [searchStudent, setSearchStudent] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [collectStudent, setCollectStudent] = useState(null);
  const [collectStructures, setCollectStructures] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    feeStructureId: "",
    amount: "",
    method: "Cash",
    paymentDate: formatDateInput(new Date()),
    transactionId: "",
    notes: "",
  });
  const [savingPayment, setSavingPayment] = useState(false);

  // Dues
  const [dues, setDues] = useState([]);
  const [duesLoading, setDuesLoading] = useState(false);
  const [confirmRemind, setConfirmRemind] = useState({
    open: false,
    studentId: "",
    feeStructureId: "",
  });

  // History
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFilters, setHistoryFilters] = useState({
    departmentId: "",
    from: "",
    to: "",
  });
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Reports
  const [reportSummary, setReportSummary] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportFilters, setReportFilters] = useState({
    from: "",
    to: "",
  });

  const loadMeta = useCallback(async () => {
    const [deptRes, structRes] = await Promise.all([
      api.get("/admin/departments"),
      api.get("/fees/structures"),
    ]);
    setDepartments(deptRes.data?.departments || []);
    setStructures(structRes.data?.structures || []);
  }, []);

  useEffect(() => {
    loadMeta().catch((e) => console.error("Failed to load fee meta", e));
  }, [loadMeta]);

  const resetStructureForm = () => {
    setStructureForm({
      id: "",
      name: "",
      departmentId: "",
      semester: "",
      amount: "",
      dueDate: "",
      isActive: true,
    });
    setSelectedStructure(null);
  };

  const handleEditStructure = (s) => {
    setSelectedStructure(s);
    setStructureForm({
      id: s._id,
      name: s.name || "",
      departmentId: s.departmentId?._id || "",
      semester: s.semester || "",
      amount: s.amount || "",
      dueDate: formatDateInput(s.dueDate),
      isActive: s.isActive !== false,
    });
  };

  const handleSaveStructure = async () => {
    if (!structureForm.name.trim()) return alert("Fee name is required");
    if (!structureForm.departmentId) return alert("Department is required");
    if (!structureForm.semester) return alert("Semester is required");
    if (!structureForm.amount) return alert("Amount is required");
    if (!structureForm.dueDate) return alert("Due date is required");

    try {
      setSavingStructure(true);
      const payload = {
        name: structureForm.name,
        departmentId: structureForm.departmentId,
        semester: Number(structureForm.semester),
        amount: Number(structureForm.amount),
        dueDate: structureForm.dueDate,
        isActive: structureForm.isActive,
      };

      if (structureForm.id) {
        const res = await api.put(
          `/fees/structures/${structureForm.id}`,
          payload,
        );
        setStructures((prev) =>
          prev.map((s) =>
            s._id === structureForm.id ? res.data?.structure || s : s,
          ),
        );
      } else {
        const res = await api.post("/fees/structures", payload);
        setStructures((prev) => [res.data?.structure, ...prev].filter(Boolean));
      }
      resetStructureForm();
    } catch (e) {
      alert(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          e?.message ||
          "Failed to save structure",
      );
    } finally {
      setSavingStructure(false);
    }
  };

  const handleDeleteStructure = async () => {
    const id = confirmDeleteStruct.id;
    if (!id) return;
    try {
      await api.delete(`/fees/structures/${id}`);
      setStructures((prev) => prev.filter((s) => s._id !== id));
    } catch (e) {
      alert(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          e?.message ||
          "Failed to delete structure",
      );
    } finally {
      setConfirmDeleteStruct({ open: false, id: "" });
    }
  };

  // ---- Fee collection helpers ----
  const debouncedSearchKey = useMemo(
    () => ({ currentTimeout: null }),
    [],
  );

  const handleSearchStudent = (value) => {
    setSearchStudent(value);
    if (debouncedSearchKey.currentTimeout) {
      clearTimeout(debouncedSearchKey.currentTimeout);
    }
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    debouncedSearchKey.currentTimeout = setTimeout(async () => {
      try {
        const res = await api.get("/fees/students/search", {
          params: { q: value },
        });
        setSearchResults(res.data?.students || []);
      } catch (e) {
        console.error("Student search failed", e?.message || e);
      }
    }, 400);
  };

  const handleSelectStudent = async (s) => {
    setCollectStudent(s);
    setSearchResults([]);
    setSearchStudent(`${s.usn} - ${s.name}`);
    try {
      const res = await api.get(`/fees/students/${s._id}/structures`);
      setCollectStructures(res.data?.structures || []);
      setPaymentForm((f) => ({
        ...f,
        feeStructureId:
          res.data?.structures && res.data.structures[0]
            ? res.data.structures[0]._id
            : "",
        amount:
          res.data?.structures && res.data.structures[0]
            ? res.data.structures[0].amount
            : "",
      }));
    } catch (e) {
      console.error("Failed to load student fee structures", e);
      setCollectStructures([]);
    }
  };

  const handleSelectCollectStructure = (id) => {
    const fs = collectStructures.find((x) => x._id === id);
    setPaymentForm((f) => ({
      ...f,
      feeStructureId: id,
      amount: fs ? fs.amount : "",
    }));
  };

  const handleSavePayment = async () => {
    if (!collectStudent) return alert("Select a student first");
    if (!paymentForm.feeStructureId) return alert("Select fee structure");
    if (!paymentForm.amount) return alert("Amount is required");
    if (!paymentForm.method) return alert("Payment method is required");

    try {
      setSavingPayment(true);
      const payload = {
        studentId: collectStudent._id,
        feeStructureId: paymentForm.feeStructureId,
        amount: Number(paymentForm.amount),
        method: paymentForm.method,
        paymentDate: paymentForm.paymentDate,
        transactionId: paymentForm.transactionId,
        notes: paymentForm.notes,
      };
      await api.post("/fees/payments", payload);
      alert("Payment recorded");
      setPaymentForm((f) => ({
        ...f,
        amount: "",
        transactionId: "",
        notes: "",
      }));
    } catch (e) {
      alert(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          e?.message ||
          "Failed to save payment",
      );
    } finally {
      setSavingPayment(false);
    }
  };

  // ---- Dues ----
  const loadDues = useCallback(
    async (deptId) => {
      try {
        setDuesLoading(true);
        const res = await api.get("/fees/dues", {
          params: deptId ? { departmentId: deptId } : {},
        });
        setDues(res.data?.dues || []);
      } catch (e) {
        console.error("Failed to load dues", e);
        setDues([]);
      } finally {
        setDuesLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (activeTab === "dues") {
      loadDues().catch(() => {});
    }
  }, [activeTab, loadDues]);

  const handleSendReminder = async () => {
    const { studentId, feeStructureId } = confirmRemind;
    try {
      await api.post(
        `/fees/dues/${studentId}/${feeStructureId}/remind`,
        {},
      );
      alert("Reminder sent");
    } catch (e) {
      alert(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          e?.message ||
          "Failed to send reminder",
      );
    } finally {
      setConfirmRemind({ open: false, studentId: "", feeStructureId: "" });
    }
  };

  // ---- History ----
  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const params = {};
      if (historyFilters.departmentId)
        params.departmentId = historyFilters.departmentId;
      if (historyFilters.from) params.from = historyFilters.from;
      if (historyFilters.to) params.to = historyFilters.to;
      const res = await api.get("/fees/payments", { params });
      setHistory(res.data?.payments || []);
    } catch (e) {
      console.error("Failed to load fee history", e);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [historyFilters]);

  useEffect(() => {
    if (activeTab === "history") {
      loadHistory().catch(() => {});
    }
  }, [activeTab, loadHistory]);

  const handlePrintReceipt = (p) => {
    setSelectedPayment(p);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // ---- Reports ----
  const loadReports = useCallback(async () => {
    try {
      setReportLoading(true);
      const params = {};
      if (reportFilters.from) params.from = reportFilters.from;
      if (reportFilters.to) params.to = reportFilters.to;
      const res = await api.get("/fees/reports/summary", { params });
      setReportSummary(res.data || null);
    } catch (e) {
      console.error("Failed to load fee reports", e);
      setReportSummary(null);
    } finally {
      setReportLoading(false);
    }
  }, [reportFilters]);

  useEffect(() => {
    if (activeTab === "reports") {
      loadReports().catch(() => {});
    }
  }, [activeTab, loadReports]);

  return (
    <div className="modern-dashboard fees-page">
      <div className="modern-header-clean fees-header">
        <div>
          <h1>Fee Management</h1>
          <p>Manage fee structures, collections, dues, and reports.</p>
        </div>
      </div>

      <div className="modern-card fees-container" style={{ padding: 0, overflow: "hidden" }}>
        <div className="fees-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`btn fees-tab-btn ${
                activeTab === t.id ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="fees-content" style={{ padding: 16 }}>
          {activeTab === "structures" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1.4fr",
                gap: 16,
              }}
            >
              <div>
                <h3 style={{ marginTop: 0 }}>
                  {structureForm.id ? "Edit fee structure" : "New fee structure"}
                </h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Fee name</label>
                    <input
                      className="form-control"
                      value={structureForm.name}
                      onChange={(e) =>
                        setStructureForm((f) => ({
                          ...f,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g. B.E CSE Sem 5 Tuition"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      className="form-control"
                      value={structureForm.departmentId}
                      onChange={(e) =>
                        setStructureForm((f) => ({
                          ...f,
                          departmentId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select department</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <input
                      type="number"
                      className="form-control"
                      min={1}
                      max={8}
                      value={structureForm.semester}
                      onChange={(e) =>
                        setStructureForm((f) => ({
                          ...f,
                          semester: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      min={0}
                      value={structureForm.amount}
                      onChange={(e) =>
                        setStructureForm((f) => ({
                          ...f,
                          amount: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Due date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={structureForm.dueDate}
                      onChange={(e) =>
                        setStructureForm((f) => ({
                          ...f,
                          dueDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      className="form-control"
                      value={structureForm.isActive ? "active" : "inactive"}
                      onChange={(e) =>
                        setStructureForm((f) => ({
                          ...f,
                          isActive: e.target.value === "active",
                        }))
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveStructure}
                    disabled={savingStructure}
                  >
                    {savingStructure
                      ? "Saving..."
                      : structureForm.id
                      ? "Update structure"
                      : "Create structure"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetStructureForm}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div>
                <h3 style={{ marginTop: 0 }}>Existing fee structures</h3>
                <div className="modern-card" style={{ padding: 0 }}>
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Fee</th>
                        <th>Department</th>
                        <th>Sem</th>
                        <th>Amount</th>
                        <th>Due</th>
                        <th>Status</th>
                        <th style={{ width: 160 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {structures.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            style={{ color: "var(--text-secondary)" }}
                          >
                            No fee structures defined.
                          </td>
                        </tr>
                      ) : (
                        structures.map((s) => (
                          <tr key={s._id}>
                            <td>{s.name}</td>
                            <td>{s.departmentId?.name}</td>
                            <td>{s.semester}</td>
                            <td>{s.amount}</td>
                            <td>{formatDateInput(s.dueDate)}</td>
                            <td>{s.isActive ? "Active" : "Inactive"}</td>
                            <td>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="action-btn action-btn--edit"
                                  onClick={() => handleEditStructure(s)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-btn action-btn--delete"
                                  onClick={() =>
                                    setConfirmDeleteStruct({
                                      open: true,
                                      id: s._id,
                                    })
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
            </div>
          )}

          {activeTab === "collect" && (
            <div className="grid-2">
              <div>
                <h3 style={{ marginTop: 0 }}>Find student</h3>
                <div className="form-group">
                  <label>Search by USN or name</label>
                  <input
                    className="form-control"
                    value={searchStudent}
                    onChange={(e) => handleSearchStudent(e.target.value)}
                    placeholder="Type at least 2 characters"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="modern-card" style={{ maxHeight: 260, overflow: "auto" }}>
                    {searchResults.map((s) => (
                      <button
                        key={s._id}
                        type="button"
                        className="btn btn-ghost"
                        style={{
                          width: "100%",
                          justifyContent: "flex-start",
                          padding: "6px 8px",
                        }}
                        onClick={() => handleSelectStudent(s)}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {s.usn} - {s.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--text-secondary)",
                            }}
                          >
                            {s.departmentId?.name} • Sem {s.semester} • Sec{" "}
                            {s.section}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {collectStudent && (
                  <div className="modern-card" style={{ marginTop: 16 }}>
                    <h4>Selected student</h4>
                    <div style={{ fontWeight: 600 }}>
                      {collectStudent.usn} - {collectStudent.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        marginTop: 4,
                      }}
                    >
                      {collectStudent.departmentId?.name} • Sem{" "}
                      {collectStudent.semester} • Sec {collectStudent.section}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 style={{ marginTop: 0 }}>Record payment</h3>
                {collectStudent ? (
                  <>
                    <div className="grid-2">
                      <div className="form-group">
                        <label>Fee structure</label>
                        <select
                          className="form-control"
                          value={paymentForm.feeStructureId}
                          onChange={(e) =>
                            handleSelectCollectStructure(e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          {collectStructures.map((f) => (
                            <option key={f._id} value={f._id}>
                              {f.name} ({f.amount})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Amount paid</label>
                        <input
                          type="number"
                          className="form-control"
                          min={0}
                          value={paymentForm.amount}
                          onChange={(e) =>
                            setPaymentForm((f) => ({
                              ...f,
                              amount: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Payment method</label>
                        <select
                          className="form-control"
                          value={paymentForm.method}
                          onChange={(e) =>
                            setPaymentForm((f) => ({
                              ...f,
                              method: e.target.value,
                            }))
                          }
                        >
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Payment date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={paymentForm.paymentDate}
                          onChange={(e) =>
                            setPaymentForm((f) => ({
                              ...f,
                              paymentDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Transaction ID</label>
                        <input
                          className="form-control"
                          value={paymentForm.transactionId}
                          onChange={(e) =>
                            setPaymentForm((f) => ({
                              ...f,
                              transactionId: e.target.value,
                            }))
                          }
                          placeholder="Optional"
                        />
                      </div>
                      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                        <label>Notes</label>
                        <input
                          className="form-control"
                          value={paymentForm.notes}
                          onChange={(e) =>
                            setPaymentForm((f) => ({
                              ...f,
                              notes: e.target.value,
                            }))
                          }
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSavePayment}
                        disabled={savingPayment}
                      >
                        {savingPayment ? "Saving..." : "Save payment"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: 14,
                    }}
                  >
                    Select a student to start recording a payment.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "dues" && (
            <div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Filter by department</label>
                  <select
                    className="form-control"
                    onChange={(e) => loadDues(e.target.value || undefined)}
                  >
                    <option value="">All departments</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modern-card" style={{ padding: 0, marginTop: 8 }}>
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>USN</th>
                      <th>Department</th>
                      <th>Fee</th>
                      <th>Amount due</th>
                      <th>Due date</th>
                      <th style={{ width: 140 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duesLoading ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Loading dues...
                        </td>
                      </tr>
                    ) : dues.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{ color: "var(--text-secondary)" }}
                        >
                          No due payments found.
                        </td>
                      </tr>
                    ) : (
                      dues.map((d) => (
                        <tr key={`${d.studentId}-${d.feeStructureId}`}>
                          <td>{d.studentName}</td>
                          <td>{d.usn}</td>
                          <td>{d.departmentName}</td>
                          <td>{d.feeName}</td>
                          <td>{d.amountDue}</td>
                          <td>{formatDateInput(d.dueDate)}</td>
                          <td>
                            <div className="table-actions">
                              <button
                                type="button"
                                className="action-btn action-btn--edit"
                                onClick={() =>
                                  setConfirmRemind({
                                    open: true,
                                    studentId: d.studentId,
                                    feeStructureId: d.feeStructureId,
                                  })
                                }
                              >
                                Send reminder
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
          )}

          {activeTab === "history" && (
            <div>
              <div className="grid-3" style={{ display: "grid", gap: 12 }}>
                <div className="form-group">
                  <label>Department</label>
                  <select
                    className="form-control"
                    value={historyFilters.departmentId}
                    onChange={(e) =>
                      setHistoryFilters((f) => ({
                        ...f,
                        departmentId: e.target.value,
                      }))
                    }
                  >
                    <option value="">All</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>From</label>
                  <input
                    type="date"
                    className="form-control"
                    value={historyFilters.from}
                    onChange={(e) =>
                      setHistoryFilters((f) => ({
                        ...f,
                        from: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>To</label>
                  <input
                    type="date"
                    className="form-control"
                    value={historyFilters.to}
                    onChange={(e) =>
                      setHistoryFilters((f) => ({
                        ...f,
                        to: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={loadHistory}
                >
                  Apply filters
                </button>
              </div>

              <div className="modern-card" style={{ padding: 0, marginTop: 8 }}>
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>USN</th>
                      <th>Department</th>
                      <th>Fee</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Date</th>
                      <th style={{ width: 120 }}>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyLoading ? (
                      <tr>
                        <td
                          colSpan={8}
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Loading payment history...
                        </td>
                      </tr>
                    ) : history.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          style={{ color: "var(--text-secondary)" }}
                        >
                          No payments found.
                        </td>
                      </tr>
                    ) : (
                      history.map((p) => (
                        <tr key={p._id}>
                          <td>{p.student?.name}</td>
                          <td>{p.student?.usn}</td>
                          <td>{p.department?.name}</td>
                          <td>{p.structure?.name}</td>
                          <td>{p.amount}</td>
                          <td>{p.method}</td>
                          <td>{formatDateInput(p.paymentDate)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handlePrintReceipt(p)}
                            >
                              Print receipt
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {selectedPayment && (
                <div
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    top: 0,
                  }}
                >
                  <div style={{ width: "600px", padding: "24px", fontSize: 14 }}>
                    <h2>Fee Receipt</h2>
                    <hr />
                    <h3>Student details</h3>
                    <p>
                      <strong>Name:</strong> {selectedPayment.student?.name}
                      <br />
                      <strong>USN:</strong> {selectedPayment.student?.usn}
                      <br />
                      <strong>Department:</strong>{" "}
                      {selectedPayment.department?.name}
                    </p>
                    <h3>Fee details</h3>
                    <p>
                      <strong>Fee:</strong> {selectedPayment.structure?.name}
                      <br />
                      <strong>Amount paid:</strong> {selectedPayment.amount}
                      <br />
                      <strong>Payment method:</strong>{" "}
                      {selectedPayment.method}
                      <br />
                      <strong>Payment date:</strong>{" "}
                      {formatDateInput(selectedPayment.paymentDate)}
                      <br />
                      <strong>Transaction ID:</strong>{" "}
                      {selectedPayment.transactionId || "-"}
                    </p>
                    <p style={{ marginTop: 24 }}>
                      This is a system-generated receipt.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "reports" && (
            <div>
              <div className="grid-2">
                <div className="form-group">
                  <label>From</label>
                  <input
                    type="date"
                    className="form-control"
                    value={reportFilters.from}
                    onChange={(e) =>
                      setReportFilters((f) => ({
                        ...f,
                        from: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>To</label>
                  <input
                    type="date"
                    className="form-control"
                    value={reportFilters.to}
                    onChange={(e) =>
                      setReportFilters((f) => ({
                        ...f,
                        to: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={loadReports}
                >
                  Generate report
                </button>
              </div>

              {reportLoading ? (
                <div style={{ marginTop: 12, color: "var(--text-secondary)" }}>
                  Loading reports...
                </div>
              ) : reportSummary ? (
                <>
                  <div className="stats-grid" style={{ marginTop: 16 }}>
                    <div className="modern-card">
                      <h3>Total fees collected</h3>
                      <p
                        style={{
                          fontSize: 24,
                          fontWeight: 700,
                          marginTop: 4,
                        }}
                      >
                        {reportSummary.totalCollected}
                      </p>
                    </div>
                    <div className="modern-card">
                      <h3>Estimated pending</h3>
                      <p
                        style={{
                          fontSize: 24,
                          fontWeight: 700,
                          marginTop: 4,
                        }}
                      >
                        {reportSummary.pending}
                      </p>
                    </div>
                  </div>

                  <div className="modern-card" style={{ marginTop: 16 }}>
                    <h3>Department-wise collection</h3>
                    <table className="erp-table">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Total collected</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportSummary.byDepartment?.length === 0 ? (
                          <tr>
                            <td
                              colSpan={2}
                              style={{ color: "var(--text-secondary)" }}
                            >
                              No data.
                            </td>
                          </tr>
                        ) : (
                          reportSummary.byDepartment.map((d) => (
                            <tr key={d.departmentId}>
                              <td>{d.departmentName}</td>
                              <td>{d.totalCollected}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="modern-card" style={{ marginTop: 16 }}>
                    <h3>Monthly collection</h3>
                    <table className="erp-table">
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th>Month</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportSummary.monthly?.length === 0 ? (
                          <tr>
                            <td
                              colSpan={3}
                              style={{ color: "var(--text-secondary)" }}
                            >
                              No data.
                            </td>
                          </tr>
                        ) : (
                          reportSummary.monthly.map((m) => (
                            <tr
                              key={`${m._id.year}-${m._id.month}`}
                            >
                              <td>{m._id.year}</td>
                              <td>{m._id.month}</td>
                              <td>{m.total}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div style={{ marginTop: 12, color: "var(--text-secondary)" }}>
                  No report data. Adjust the date range and click Generate.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDeleteStruct.open}
        title="Delete fee structure?"
        message="This will permanently delete the fee structure."
        confirmText="Delete"
        danger
        onConfirm={handleDeleteStructure}
        onCancel={() => setConfirmDeleteStruct({ open: false, id: "" })}
      />
      <ConfirmDialog
        open={confirmRemind.open}
        title="Send fee reminder?"
        message="A reminder notification will be sent to the student."
        confirmText="Send"
        danger={false}
        onConfirm={handleSendReminder}
        onCancel={() =>
          setConfirmRemind({ open: false, studentId: "", feeStructureId: "" })
        }
      />
    </div>
  );
};

export default Fees;

