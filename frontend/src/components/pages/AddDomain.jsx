import React, { useState } from "react";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import "../../styles/page_styles/AddDomain.css";
import { api } from "../../context/AuthContext";

function AddDomain({ isOpen, onClose, onAddDomain }) {
  const [formData, setFormData] = useState({
    siteName: "",
    loginUrl: "",
    siteUsernameOrEmail: "",
    sitePassword: "",
    note: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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
        site_name: formData.siteName,
        login_url: formData.loginUrl,
        site_username_or_email: formData.siteUsernameOrEmail,
        site_password: formData.sitePassword,
        note: formData.note,
      };

      const response = await api.post("api/domain/", payload);

      if (onAddDomain) {
        onAddDomain(response.data);
      }

      setFormData({
        siteName: "",
        loginUrl: "",
        siteUsernameOrEmail: "",
        sitePassword: "",
        note: "",
      });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to add credential item. Please check your details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Credential</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Site Name *</label>
            <input
              type="text"
              name="siteName"
              placeholder="e.g. GitHub"
              value={formData.siteName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Login URL</label>
            <input
              type="url"
              name="loginUrl"
              placeholder="https://example.com/login"
              value={formData.loginUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Username or Email *</label>
            <input
              type="text"
              name="siteUsernameOrEmail"
              placeholder="e.g. user@example.com"
              value={formData.siteUsernameOrEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <div
              className="password-input-wrapper"
              style={{ position: "relative" }}
            >
              <input
                type={showPassword ? "text" : "password"}
                name="sitePassword"
                placeholder="Enter password"
                value={formData.sitePassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Additional Note</label>
            <textarea
              name="note"
              rows="3"
              placeholder="Optional notes or security answers..."
              value={formData.note}
              onChange={handleChange}
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
              {loading ? "Saving..." : "Save Credential"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDomain;
