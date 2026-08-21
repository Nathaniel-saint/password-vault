import React, { useState, useEffect, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import {
  FiShield,
  FiKey,
  FiGlobe,
  FiPlus,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiEdit,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";
import toast from "react-hot-toast";
import "../../styles/page_styles/Dashboard.css";
import AddDomain from "./AddDomain";
import NoteModal from "./NoteModal";
import DeleteCredentialModal from "./DeleteCredentialModal";
import { api, useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { accessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [activeNoteModal, setActiveNoteModal] = useState({
    isOpen: false,
    id: null,
    note: "",
    siteName: "",
  });
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    item: null,
  });

  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (accessToken) {
      fetchDomains();
    }
  }, [accessToken]);

  const fetchDomains = async () => {
    setLoading(true);
    setError(null);
    try {
      let allDomains = [];
      let nextUrl = "api/domain/";

      while (nextUrl) {
        const endpoint = nextUrl.replace(/^https?:\/\/[^\/]+/, "");
        const response = await api.get(endpoint);

        if (response.data.results) {
          allDomains = [...allDomains, ...response.data.results];
          nextUrl = response.data.next;
        } else {
          allDomains = Array.isArray(response.data) ? response.data : [];
          nextUrl = null;
        }
      }

      setDomains(allDomains);
    } catch (err) {
      console.error("Fetch Items Error:", err);
      setError("Failed to fetch credentials from server.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = (text, label = "Item") => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    }
  };

  const handleOpenNote = (item) => {
    setActiveNoteModal({
      isOpen: true,
      id: item.id || item.pk,
      note: item.note || "",
      siteName: item.site_name || "Credential Note",
    });
  };

  const handleEdit = (item) => {
    setEditingDomain(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setDeleteModalState({
      isOpen: true,
      item: item,
    });
  };

  const handleConfirmDelete = async () => {
    const item = deleteModalState.item;
    if (!item) return;

    const itemId = item.id || item.pk;
    const deletePromise = api.delete(`api/domain/${itemId}/`);

    toast.promise(deletePromise, {
      loading: "Deleting credential...",
      success: () => {
        setDeleteModalState({ isOpen: false, item: null });
        fetchDomains();
        return "Credential deleted successfully";
      },
      error: "Failed to delete credential. Please try again.",
    });
  };

  const filteredDomains = useMemo(() => {
    return domains.filter((item) => {
      const siteName = item.site_name || "";
      const username = item.site_username_or_email || "";
      const loginUrl = item.login_url || "";

      const term = searchTerm.toLowerCase();
      return (
        siteName.toLowerCase().includes(term) ||
        username.toLowerCase().includes(term) ||
        loginUrl.toLowerCase().includes(term)
      );
    });
  }, [domains, searchTerm]);

  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleModalSubmit = () => {
    fetchDomains();
    setIsModalOpen(false);
    setEditingDomain(null);
  };

  const handleExportCSV = () => {
    if (filteredDomains.length === 0) return;

    const headers = ["Site Name", "Login URL", "Username/Email", "Notes"];
    const rows = filteredDomains.map((item) => [
      `"${item.site_name || ""}"`,
      `"${item.login_url || ""}"`,
      `"${item.site_username_or_email || ""}"`,
      `"${item.note || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `credentials_backup_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded!");
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDomains = filteredDomains.slice(startIndex, endIndex);

  return (
    <div className="dash-container">
      <header className="dash-header">
        <div>
          <h2>Dashboard</h2>
          <p className="breadcrumb">Home / Credentials Vault</p>
        </div>
        <button
          className="add-btn"
          onClick={() => {
            setEditingDomain(null);
            setIsModalOpen(true);
          }}
        >
          <FiPlus /> Add Credential
        </button>
      </header>

      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Saved Credentials</span>
            <span className="metric-icon primary-icon">
              <FiShield />
            </span>
          </div>
          <h3 className="metric-value">{domains.length}</h3>
          <span className="metric-sub text-positive">Encrypted & Secured</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Active Vault Items</span>
            <span className="metric-icon warning-icon">
              <FiKey />
            </span>
          </div>
          <h3 className="metric-value">{domains.length}</h3>
          <span className="metric-sub text-warning">Ready to use</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Websites Managed</span>
            <span className="metric-icon primary-icon">
              <FiGlobe />
            </span>
          </div>
          <h3 className="metric-value">
            {new Set(domains.map((d) => d.site_name).filter(Boolean)).size}
          </h3>
          <span className="metric-sub text-positive">Unique Sites</span>
        </div>
      </section>

      <section className="table-container">
        <div className="table-header">
          <h3>Credentials Vault</h3>
          <div className="table-actions">
            <div className="search-box">
              <CiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search site, email, URL..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <button
              className="secondary-btn"
              onClick={handleExportCSV}
              disabled={filteredDomains.length === 0}
            >
              <FiDownload /> Export CSV
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="domain-table">
            <thead>
              <tr>
                <th>Site Name</th>
                <th>Login URL</th>
                <th>Username / Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    Loading credential items...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    {error}
                  </td>
                </tr>
              ) : currentDomains.length > 0 ? (
                currentDomains.map((item, index) => {
                  const itemId = item.id || item.pk || index;
                  const isPasswordShown = !!visiblePasswords[itemId];

                  return (
                    <tr key={itemId}>
                      <td className="domain-name">{item.site_name}</td>
                      <td>
                        {item.login_url ? (
                          <a
                            href={
                              item.login_url.startsWith("http")
                                ? item.login_url
                                : `https://${item.login_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.login_url}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <div className="cell-content">
                          <span>{item.site_username_or_email}</span>
                          <button
                            className="icon-only-btn"
                            title="Copy Username"
                            onClick={() =>
                              handleCopy(
                                item.site_username_or_email,
                                "Username",
                              )
                            }
                          >
                            <FiCopy />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="cell-content">
                          <span style={{ fontFamily: "monospace" }}>
                            {isPasswordShown
                              ? item.site_password
                              : "••••••••••••"}
                          </span>
                          <button
                            className="icon-only-btn"
                            title={
                              isPasswordShown
                                ? "Hide Password"
                                : "Show Password"
                            }
                            onClick={() => togglePasswordVisibility(itemId)}
                          >
                            {isPasswordShown ? <FiEyeOff /> : <FiEye />}
                          </button>
                          <button
                            className="icon-only-btn"
                            title="Copy Password"
                            onClick={() =>
                              handleCopy(item.site_password, "Password")
                            }
                          >
                            <FiCopy />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons-wrapper">
                          <button
                            className="icon-only-btn"
                            title={item.note ? "View / Edit Note" : "Add Note"}
                            onClick={() => handleOpenNote(item)}
                          >
                            <FiFileText
                              style={{
                                color: item.note ? "#1a2e65" : "#94a3b8",
                              }}
                            />
                          </button>
                          <button
                            className="icon-only-btn"
                            title="Edit Credential"
                            onClick={() => handleEdit(item)}
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="icon-only-btn delete-btn"
                            title="Delete Credential"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No matching credentials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-wrapper">
          <span className="pagination-info">
            Showing {filteredDomains.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(endIndex, filteredDomains.length)} of{" "}
            {filteredDomains.length} results
          </span>

          <div className="pagination-controls">
            <button
              className="page-nav-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              <FiChevronLeft /> Previous
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`page-num-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                >
                  {page}
                </button>
              ),
            )}

            <button
              className="page-nav-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === totalPages || totalPages === 0 || loading
              }
            >
              Next <FiChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AddDomain
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDomain(null);
        }}
        onAddDomain={handleModalSubmit}
        domainToEdit={editingDomain}
      />

      <NoteModal
        isOpen={activeNoteModal.isOpen}
        onClose={() =>
          setActiveNoteModal({
            isOpen: false,
            id: null,
            note: "",
            siteName: "",
          })
        }
        domainId={activeNoteModal.id}
        note={activeNoteModal.note}
        siteName={activeNoteModal.siteName}
        onNoteUpdated={fetchDomains}
      />

      <DeleteCredentialModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, item: null })}
        onConfirm={handleConfirmDelete}
        siteName={deleteModalState.item?.site_name || ""}
      />
    </div>
  );
}

export default Dashboard;
