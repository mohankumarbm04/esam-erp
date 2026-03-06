// pages/student/Documents.jsx
import React, { useState } from "react";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Documents = () => {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "10th Marks Card",
      type: "PDF",
      size: "245 KB",
      uploadedAt: "2024-01-15",
      status: "verified",
      url: "#",
    },
    {
      id: 2,
      name: "12th Marks Card",
      type: "PDF",
      size: "312 KB",
      uploadedAt: "2024-01-15",
      status: "verified",
      url: "#",
    },
    {
      id: 3,
      name: "Transfer Certificate",
      type: "PDF",
      size: "189 KB",
      uploadedAt: "2024-01-16",
      status: "pending",
      url: "#",
    },
    {
      id: 4,
      name: "Aadhar Card",
      type: "PDF",
      size: "156 KB",
      uploadedAt: "2024-01-16",
      status: "verified",
      url: "#",
    },
    {
      id: 5,
      name: "Internship Certificate",
      type: "PDF",
      size: "423 KB",
      uploadedAt: "2024-02-20",
      status: "pending",
      url: "#",
    },
  ]);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert("Document uploaded successfully!");
    }, 2000);
  };

  const getStatusIcon = (status) => {
    if (status === "verified") {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    } else {
      return <XCircleIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    return status === "verified" ? "Verified" : "Pending Verification";
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              <CloudArrowUpIcon className="h-5 w-5 mr-2" />
              {uploading ? "Uploading..." : "Upload New"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Document Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Academic Documents</h3>
            <p className="text-3xl font-bold text-blue-600">3</p>
            <p className="text-sm text-gray-500">2 verified, 1 pending</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Identity Proofs</h3>
            <p className="text-3xl font-bold text-green-600">1</p>
            <p className="text-sm text-gray-500">1 verified</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Certificates</h3>
            <p className="text-3xl font-bold text-purple-600">1</p>
            <p className="text-sm text-gray-500">Pending verification</p>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Uploaded On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.uploadedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(doc.status)}
                      <span
                        className={`ml-2 text-xs font-medium ${
                          doc.status === "verified"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {getStatusText(doc.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upload Guidelines */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Document Upload Guidelines
          </h3>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Allowed formats: PDF, JPG, PNG (Max size: 5MB)</li>
            <li>• Ensure documents are clear and legible</li>
            <li>
              • Uploaded documents will be verified within 2-3 working days
            </li>
            <li>• Keep original documents ready for verification</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Documents;
