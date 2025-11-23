import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("ID_PROOF");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token, navigate]);

  async function loadMyDocs() {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/user/my-docs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocs(res.data);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  }

  useEffect(() => {
    loadMyDocs();
    // eslint-disable-next-line
  }, [token]);

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 5MB" });
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage({ type: "error", text: "Only JPG, PNG, and PDF files are allowed" });
      return;
    }

    setFile(selectedFile);
    setMessage({ type: "", text: "" });
  }

  async function handleUpload() {
    if (!file) {
      setMessage({ type: "error", text: "Please select a file" });
      return;
    }

    setUploading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("document", file);
    formData.append("document_type", docType);

    try {
      await axios.post(
        "http://localhost:5000/user/upload-document",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage({ type: "success", text: "Document uploaded successfully!" });
      setFile(null);
      // Reset file input
      document.querySelector('input[type="file"]').value = "";
      loadMyDocs();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function getStatusBadge(status) {
    const styles = {
      VERIFIED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  }

  function getDocTypeIcon(type) {
    switch (type) {
      case "ID_PROOF":
        return (
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        );
      case "ADDRESS_PROOF":
        return (
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "SELFIE":
        return (
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to access your dashboard</p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                KYC Portal
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              {user && (
                <div className="flex items-center space-x-5">
                  <div className="text-right hidden sm:block">
                    <p className="text-base font-bold text-gray-900 leading-tight">{user.name || "User"}</p>
                    <p className="text-sm text-gray-500 leading-tight mt-1">{user.email}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {(user.name || user.email || "U")[0].toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900 px-6 py-3 rounded-xl text-base font-semibold transition-all hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-16">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">KYC Dashboard</h1>
              <p className="text-lg text-gray-600 font-normal">Upload and manage your verification documents</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12 mb-16">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Upload New Document</h2>
          </div>
          
          {message.text && (
            <div className={`mb-10 p-6 rounded-2xl flex items-start ${
              message.type === "error" 
                ? "bg-red-50 border-2 border-red-200 text-red-700" 
                : "bg-green-50 border-2 border-green-200 text-green-700"
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${
                message.type === "error" ? "bg-red-100" : "bg-green-100"
              }`}>
                <svg className={`w-6 h-6 ${message.type === "error" ? "text-red-600" : "text-green-600"}`} fill="currentColor" viewBox="0 0 20 20">
                  {message.type === "error" ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  )}
                </svg>
              </div>
              <span className="text-base font-semibold leading-relaxed pt-1">{message.text}</span>
            </div>
          )}

          <div className="space-y-8">
            <div>
              <label className="block text-base font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-semibold bg-white text-base"
              >
                <option value="ID_PROOF">ID Proof</option>
                <option value="ADDRESS_PROOF">Address Proof</option>
                <option value="SELFIE">Selfie</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Select File
              </label>
              <div className="mt-2 flex justify-center px-12 pt-16 pb-16 border-2 border-gray-300 border-dashed rounded-3xl hover:border-blue-500 transition-all bg-gradient-to-br from-gray-50 to-blue-50/30 cursor-pointer group">
                <div className="space-y-4 text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors shadow-lg">
                    <svg className="w-12 h-12 text-blue-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex text-base text-gray-700 justify-center items-center font-semibold">
                    <label className="relative cursor-pointer bg-white rounded-xl font-bold text-blue-600 hover:text-blue-700 focus-within:outline-none px-6 py-3 hover:bg-blue-50 transition-all shadow-md hover:shadow-lg">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                      />
                    </label>
                    <p className="pl-3 text-gray-600">or drag and drop</p>
                  </div>
                  <p className="text-sm text-gray-500 font-semibold">PNG, JPG, PDF up to 5MB</p>
                  {file && (
                    <div className="mt-6 bg-white px-6 py-4 rounded-2xl shadow-md inline-block">
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-base text-gray-900 font-bold">{file.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </button>
          </div>
        </div>

        {/* Documents List */}
        <div>
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">My Documents</h2>
          </div>
          
          {docs.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-20 text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-800 text-2xl font-bold mb-3">No documents uploaded yet</p>
              <p className="text-gray-500 text-base">Upload your first document to get started with KYC verification</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {docs.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-3xl shadow-md border-2 border-gray-200 p-8 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${
                      doc.document_type === "ID_PROOF" ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white" :
                      doc.document_type === "ADDRESS_PROOF" ? "bg-gradient-to-br from-green-400 to-green-600 text-white" :
                      doc.document_type === "SELFIE" ? "bg-gradient-to-br from-purple-400 to-purple-600 text-white" :
                      "bg-gradient-to-br from-gray-400 to-gray-600 text-white"
                    }`}>
                      <div className="w-10 h-10">
                        {getDocTypeIcon(doc.document_type)}
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold border-2 ${getStatusBadge(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">{doc.document_type.replace(/_/g, " ")}</h3>
                  <p className="text-sm text-gray-600 mb-4 truncate font-semibold">{doc.original_name}</p>
                  <div className="flex items-center text-xs text-gray-500 mb-6 font-medium">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Uploaded: {new Date(doc.upload_time).toLocaleDateString()}
                  </div>
                  
                  <a
                    href={`http://localhost:5000/uploads/${doc.file_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full text-base text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    View Document
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
