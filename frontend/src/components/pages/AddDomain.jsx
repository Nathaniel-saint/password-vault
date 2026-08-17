import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import "../../styles/page_styles/AddDomain.css";
import { api } from "../../context/AuthContext";

function AddDomain({ isOpen, onClose, onAddDomain }) {
  const [formData, setFormData] = useState({
    domainName: "",
    registrar: "",
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        domain_name: formData.domainName,
        registrar: formData.registrar,
        expiry_date: formData.expiryDate,
      };

      const response = await api.post("domain/api/", payload);

      if (onAddDomain) {
        onAddDomain(response.data);
      }

      setFormData({ domainName: "", registrar: "", expiryDate: "" });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to add domain. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Domain</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Domain Name *</label>
            <input
              type="text"
              name="domainName"
              placeholder="e.g. mycompany.com"
              value={formData.domainName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Registrar *</label>
            <input
              type="text"
              name="registrar"
              placeholder="e.g. GoDaddy, Namecheap"
              value={formData.registrar}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-domain-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Domain"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDomain;
