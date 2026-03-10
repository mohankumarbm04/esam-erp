// pages/student/Documents.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhotoIcon,
  DocumentIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    storageUsed: "0 MB",
    storageLimit: "50 MB",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/students/documents",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setDocuments(response.data.documents || []);
        calculateStats(response.data.documents || []);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);

      // Mock data for development
      const mockDocuments = [
        {
          id: 1,
          name: "10th Marks Card",
          type: "PDF",
          category: "academic",
          size: "245 KB",
          uploadedAt: "2026-01-15",
          status: "verified",
          verifiedBy: "Admin",
          verifiedOn: "2026-01-16",
          url: "#",
          icon: "📄",
        },
        {
          id: 2,
          name: "12th Marks Card",
          type: "PDF",
          category: "academic",
          size: "312 KB",
          uploadedAt: "2026-01-15",
          status: "verified",
          verifiedBy: "Admin",
          verifiedOn: "2026-01-16",
          url: "#",
          icon: "📄",
        },
        {
          id: 3,
          name: "Transfer Certificate",
          type: "PDF",
          category: "academic",
          size: "189 KB",
          uploadedAt: "2026-01-16",
          status: "pending",
          url: "#",
          icon: "📄",
        },
        {
          id: 4,
          name: "Aadhar Card",
          type: "PDF",
          category: "identity",
          size: "156 KB",
          uploadedAt: "2026-01-16",
          status: "verified",
          verifiedBy: "Admin",
          verifiedOn: "2026-01-17",
          url: "#",
          icon: "🆔",
        },
        {
          id: 5,
          name: "PAN Card",
          type: "PDF",
          category: "identity",
          size: "134 KB",
          uploadedAt: "2026-01-17",
          status: "rejected",
          remarks: "Document not clear. Please upload a clearer image.",
          url: "#",
          icon: "🆔",
        },
        {
          id: 6,
          name: "Passport Size Photo",
          type: "JPG",
          category: "personal",
          size: "89 KB",
          uploadedAt: "2026-01-15",
          status: "verified",
          verifiedBy: "Admin",
          verifiedOn: "2026-01-16",
          url: "#",
          icon: "📷",
        },
        {
          id: 7,
          name: "Internship Certificate",
          type: "PDF",
          category: "certificate",
          size: "423 KB",
          uploadedAt: "2026-02-20",
          status: "pending",
          url: "#",
          icon: "📜",
        },
        {
          id: 8,
          name: "Project Report",
          type: "PDF",
          category: "academic",
          size: "1.2 MB",
          uploadedAt: "2026-03-01",
          status: "pending",
          url: "#",
          icon: "📑",
        },
      ];

      setDocuments(mockDocuments);
      calculateStats(mockDocuments);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (docs) => {
    const verified = docs.filter((d) => d.status === "verified").length;
    const pending = docs.filter((d) => d.status === "pending").length;
    const rejected = docs.filter((d) => d.status === "rejected").length;

    // Calculate total size (mock)
    const totalSizeMB = 2.4; // This would come from API

    setStats({
      total: docs.length,
      verified,
      pending,
      rejected,
      storageUsed: `${totalSizeMB} MB`,
      storageLimit: "50 MB",
    });
  };

  const handleUpload = () => {
    setUploading(true);
    // Simulate file upload
    setTimeout(() => {
      setUploading(false);
      setSuccess(
        "Document uploaded successfully! It will be verified within 2-3 working days.",
      );

      // Add mock new document
      const newDoc = {
        id: Date.now(),
        name: "New Document",
        type: "PDF",
        category: "academic",
        size: "150 KB",
        uploadedAt: new Date().toISOString().split("T")[0],
        status: "pending",
        url: "#",
        icon: "📄",
      };

      setDocuments([newDoc, ...documents]);
      calculateStats([newDoc, ...documents]);

      setTimeout(() => setSuccess(""), 3000);
    }, 2000);
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      // API call would go here
      // await axios.delete(`http://localhost:5000/api/students/documents/${docId}`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      const updatedDocs = documents.filter((d) => d.id !== docId);
      setDocuments(updatedDocs);
      calculateStats(updatedDocs);
      setSuccess("Document deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete document");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleView = (doc) => {
    window.open(doc.url, "_blank");
  };

  const handleDownload = (doc) => {
    alert(`Downloading ${doc.name}...`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "pending":
        return "Pending Verification";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getFileIcon = (type) => {
    if (type === "PDF")
      return <DocumentTextIcon className="h-8 w-8 text-red-500" />;
    if (type === "JPG" || type === "PNG" || type === "JPEG")
      return <PhotoIcon className="h-8 w-8 text-blue-500" />;
    return <DocumentIcon className="h-8 w-8 text-gray-500" />;
  };

  const categories = [
    { id: "all", name: "All Documents", icon: DocumentTextIcon },
    { id: "academic", name: "Academic", icon: DocumentTextIcon },
    { id: "identity", name: "Identity", icon: DocumentIcon },
    { id: "personal", name: "Personal", icon: PhotoIcon },
    { id: "certificate", name: "Certificates", icon: DocumentTextIcon },
  ];

  const filteredDocuments =
    selectedCategory === "all"
      ? documents
      : documents.filter((d) => d.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-800">
              My Documents
            </h1>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
            >
              <CloudArrowUpIcon className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Upload New"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Total Documents</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.verified}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Storage</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.storageUsed}
            </p>
            <p className="text-xs text-gray-500">of {stats.storageLimit}</p>
          </div>
        </div>

        {/* Storage Progress Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Storage Usage
            </span>
            <span className="text-sm text-gray-600">
              {((parseFloat(stats.storageUsed) / 50) * 100).toFixed(0)}% used
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 rounded-full h-2.5"
              style={{
                width: `${(parseFloat(stats.storageUsed) / 50) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.name}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {category.id === "all"
                  ? documents.length
                  : documents.filter((d) => d.category === category.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition"
            >
              {/* Document Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {getFileIcon(doc.type)}
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {doc.type} • {doc.size} •{" "}
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(doc.status)}
                  </div>
                </div>
              </div>

              {/* Document Body */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          doc.status === "verified"
                            ? "text-green-600"
                            : doc.status === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {getStatusText(doc.status)}
                      </span>
                    </p>
                    {doc.verifiedBy && (
                      <p className="text-xs text-gray-500 mt-1">
                        Verified by {doc.verifiedBy} on {doc.verifiedOn}
                      </p>
                    )}
                    {doc.remarks && (
                      <p className="text-xs text-red-600 mt-1">{doc.remarks}</p>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                    {doc.category}
                  </span>
                </div>
              </div>

              {/* Document Actions */}
              <div className="p-4 border-t border-gray-100 flex justify-end space-x-2">
                <button
                  onClick={() => handleView(doc)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="View"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                  title="Download"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-100">
            <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No documents found
            </h3>
            <p className="text-gray-500 mt-2">
              {selectedCategory !== "all"
                ? "No documents in this category"
                : "Upload your first document to get started"}
            </p>
            <button
              onClick={handleUpload}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <CloudArrowUpIcon className="h-5 w-5 mr-2" />
              Upload Document
            </button>
          </div>
        )}

        {/* Guidelines */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            📋 Document Upload Guidelines
          </h3>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Allowed formats: PDF, JPG, PNG (Max size: 5MB per file)</li>
            <li>• Ensure documents are clear and legible</li>
            <li>
              • Uploaded documents will be verified within 2-3 working days
            </li>
            <li>
              • Keep original documents ready for verification if required
            </li>
            <li>• Rejected documents can be re-uploaded after corrections</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Documents;
