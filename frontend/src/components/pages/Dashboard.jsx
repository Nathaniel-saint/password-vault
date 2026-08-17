import React, { useState, useEffect, useMemo } from "react";
import { CiSearch, CiFilter } from "react-icons/ci";
import {
  FiGlobe,
  FiClock,
  FiAlertTriangle,
  FiPlus,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "../../styles/page_styles/Dashboard.css";
import AddDomain from "./AddDomain";
import DomainDetails from "./DomainDetails";
import { api, useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { accessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [registrarFilter, setRegistrarFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);

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
      let nextUrl = "domain/api/";

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
      console.error("Fetch Domains Error:", err);
      setError("Failed to fetch domain portfolio from server.");
    } finally {
      setLoading(false);
    }
  };

  const getDomainStatus = (domain) => {
    if (domain.status && domain.status !== "ACTIVE") {
      return domain.status;
    }

    const expiryStr = domain.expiry_date || domain.expiry;
    if (!expiryStr) return "ACTIVE";

    const today = new Date();
    const expiry = new Date(expiryStr);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "EXPIRED";
    if (diffDays <= 30) return "EXPIRING_SOON";
    return "ACTIVE";
  };

  const expiringSoonCount = useMemo(
    () => domains.filter((d) => getDomainStatus(d) === "EXPIRING_SOON").length,
    [domains],
  );

  const expiredCount = useMemo(
    () => domains.filter((d) => getDomainStatus(d) === "EXPIRED").length,
    [domains],
  );

  const uniqueRegistrars = useMemo(
    () => [
      "ALL",
      ...Array.from(new Set(domains.map((d) => d.registrar).filter(Boolean))),
    ],
    [domains],
  );

  const filteredDomains = useMemo(() => {
    return domains.filter((item) => {
      const status = getDomainStatus(item);
      const name = item.domain_name || item.name || "";
      const registrar = item.registrar || "";

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registrar.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || status === statusFilter;
      const matchesRegistrar =
        registrarFilter === "ALL" || registrar === registrarFilter;

      return matchesSearch && matchesStatus && matchesRegistrar;
    });
  }, [domains, searchTerm, statusFilter, registrarFilter]);

  const totalPages = Math.ceil(filteredDomains.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddDomainSubmit = () => {
    fetchDomains();
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (filteredDomains.length === 0) return;

    const headers = ["Domain Name", "Registrar", "Expiry Date", "Status"];
    const rows = filteredDomains.map((item) => [
      `"${item.domain_name || item.name || ""}"`,
      `"${item.registrar || ""}"`,
      `"${item.expiry_date || item.expiry || ""}"`,
      `"${getDomainStatus(item)}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `domain_portfolio_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDomains = filteredDomains.slice(startIndex, endIndex);

  return (
    <div className="dash-container">
      <header className="dash-header">
        <div>
          <h2>Dashboard</h2>
          <p className="breadcrumb">Home / Dashboard</p>
        </div>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Add New Domain
        </button>
      </header>

      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Domains</span>
            <span className="metric-icon primary-icon">
              <FiGlobe />
            </span>
          </div>
          <h3 className="metric-value">{domains.length}</h3>
          <span className="metric-sub text-positive">Active portfolio</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Expiring Soon (30 days)</span>
            <span className="metric-icon warning-icon">
              <FiClock />
            </span>
          </div>
          <h3 className="metric-value">{expiringSoonCount}</h3>
          <span className="metric-sub text-warning">Action required</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Expired</span>
            <span className="metric-icon danger-icon">
              <FiAlertTriangle />
            </span>
          </div>
          <h3 className="metric-value">{expiredCount}</h3>
          <span className="metric-sub text-danger">Action required</span>
        </div>
      </section>

      <section className="table-container">
        <div className="table-header">
          <h3>Domain Portfolio</h3>
          <div className="table-actions">
            <div className="search-box">
              <CiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search domains..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="filter-select-wrapper">
              <CiFilter className="filter-icon" />
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRING_SOON">Expiring Soon</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            <div className="filter-select-wrapper">
              <CiFilter className="filter-icon" />
              <select
                className="filter-select"
                value={registrarFilter}
                onChange={(e) => {
                  setRegistrarFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {uniqueRegistrars.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg === "ALL" ? "All Registrars" : reg}
                  </option>
                ))}
              </select>
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
                <th>
                  <input type="checkbox" />
                </th>
                <th>Domain Name</th>
                <th>Registrar</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    Loading domain portfolio...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    {error}
                  </td>
                </tr>
              ) : currentDomains.length > 0 ? (
                currentDomains.map((item, index) => {
                  const statusDisplay = getDomainStatus(item);
                  return (
                    <tr key={item.id || item.pk || index}>
                      <td>{Math.floor(Math.random(1, 1000) * 1000)}</td>
                      <td className="domain-name">
                        {item.domain_name || item.name}
                      </td>
                      <td>{item.registrar}</td>
                      <td>{item.expiry_date || item.expiry}</td>
                      <td>
                        <span
                          className={`status-pill ${statusDisplay
                            .toLowerCase()
                            .replace(/_/g, "-")}`}
                        >
                          {statusDisplay.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td>
                        <button
                          className="manage-btn"
                          onClick={() => setSelectedDomain(item)}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No domains found.
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

      <AddDomain
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddDomain={handleAddDomainSubmit}
      />

      <DomainDetails
        isOpen={!!selectedDomain}
        onClose={() => setSelectedDomain(null)}
        domain={selectedDomain}
      />
    </div>
  );
}

export default Dashboard;
