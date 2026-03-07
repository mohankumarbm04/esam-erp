// pages/student/Documents.jsx
import React, { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FolderIcon,
  PhotoIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    storageUsed: "2.4 MB",
    storageLimit: "50 MB",
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    // Mock data - replace with API call
    setTimeout(() => {
      const data = [
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

      setDocuments(data);

      const verified = data.filter((d) => d.status === "verified").length;
      const pending = data.filter((d) => d.status === "pending").length;
      const rejected = data.filter((d) => d.status === "rejected").length;

      setStats({
        total: data.length,
        verified,
        pending,
        rejected,
        storageUsed: "2.4 MB",
        storageLimit: "50 MB",
      });

      setLoading(false);
    }, 500);
  };

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert(
        "Document uploaded successfully! It will be verified within 2-3 working days.",
      );
    }, 2000);
  };

  const handleView = (doc) => {
    alert(`Viewing ${doc.name}`);
  };

  const handleDownload = (doc) => {
    alert(`Downloading ${doc.name}`);
  };

  const handleDelete = (doc) => {
    if (window.confirm(`Are you sure you want to delete ${doc.name}?`)) {
      setDocuments(documents.filter((d) => d.id !== doc.id));
      alert("Document deleted successfully!");
    }
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
    if (type === "JPG" || type === "PNG")
      return <PhotoIcon className="h-8 w-8 text-blue-500" />;
    return <DocumentIcon className="h-8 w-8 text-gray-500" />;
  };

  const categories = [
    { id: "all", name: "All Documents", icon: FolderIcon },
    { id: "academic", name: "Academic", icon: DocumentTextIcon },
    { id: "identity", name: "Identity", icon: DocumentIcon },
    { id: "personal", name: "Personal", icon: PhotoIcon },
    { id: "certificate", name: "Certificates", icon: DocumentTextIcon },
  ];

  const filteredDocuments =
    selectedCategory === "all"
      ? documents
      : documents.filter((d) => d.category === selectedCategory);

  const CategoryCard = ({ category, selected, onClick }) => {
    const Icon = category.icon;
    const count =
      category.id === "all"
        ? documents.length
        : documents.filter((d) => d.category === category.id).length;

    return (
      <button
        onClick={onClick}
        className={`flex items-center p-3 rounded-lg transition ${
          selected
            ? "bg-blue-50 border-2 border-blue-500"
            : "bg-white border border-gray-200 hover:border-blue-300"
        }`}
      >
        <Icon
          className={`h-5 w-5 mr-2 ${selected ? "text-blue-600" : "text-gray-500"}`}
        />
        <span
          className={`text-sm font-medium ${selected ? "text-blue-600" : "text-gray-700"}`}
        >
          {category.name}
        </span>
        <span
          className={`ml-auto text-xs px-2 py-1 rounded-full ${
            selected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
          }`}
        >
          {count}
        </span>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <DocumentTextIcon className="h-8 w-8 mr-3 text-blue-500" />
              My Documents
            </h1>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <CloudArrowUpIcon className="h-5 w-5 mr-2" />
              {uploading ? "Uploading..." : "Upload New"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600">Total Documents</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.verified}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Storage Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md p-6 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Storage Usage</p>
              <p className="text-2xl font-bold">
                {stats.storageUsed} / {stats.storageLimit}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Used</p>
              <p className="text-2xl font-bold">
                {Math.round((2.4 / 50) * 100)}%
              </p>
            </div>
          </div>
          <div className="mt-4 w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2"
              style={{ width: `${(2.4 / 50) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              selected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Document Header */}
              <div className="p-4 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {getFileIcon(doc.type)}
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {doc.type} • {doc.size} • {doc.uploadedAt}
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
                </div>
              </div>

              {/* Document Actions */}
              <div className="p-4 border-t flex justify-end space-x-2">
                <button
                  onClick={() => handleView(doc)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="View"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                  title="Download"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No documents found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Upload your first document to get started.
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
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
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
