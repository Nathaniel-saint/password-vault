import React, { useState, useEffect } from "react";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import "../../styles/page_styles/AddDomain.css";
import { api } from "../../context/AuthContext";

function AddDomain({ isOpen, onClose, onAddDomain, domainToEdit }) {
  const [formData, setFormData] = useState({
    siteName: "",
    loginUrl: "",
    siteUsernameOrEmail: "",
    sitePassword: "",
    note: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (domainToEdit) {
      setFormData({
        siteName: domainToEdit.site_name || "",
        loginUrl: domainToEdit.login_url || "",
        siteUsernameOrEmail: domainToEdit.site_username_or_email || "",
        sitePassword: domainToEdit.site_password || "",
        note: domainToEdit.note || "",
      });
    } else {
      setFormData({
        siteName: "",
        loginUrl: "",
        siteUsernameOrEmail: "",
        sitePassword: "",
        note: "",
      });
    }
  }, [domainToEdit, isOpen]);

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

    const payload = {
      site_name: formData.siteName,
      login_url: formData.loginUrl,
      site_username_or_email: formData.siteUsernameOrEmail,
      site_password: formData.sitePassword,
      note: formData.note,
    };

    const isEdit = Boolean(domainToEdit);
    const domainId = domainToEdit?.id || domainToEdit?.pk;

    const requestPromise = isEdit
      ? api.patch(`api/domain/${domainId}/`, payload)
      : api.post("api/domain/", payload);

    toast
      .promise(requestPromise, {
        loading: isEdit ? "Updating credential..." : "Saving credential...",
        success: (response) => {
          if (onAddDomain) {
            onAddDomain(response.data);
          }
          onClose();
          return isEdit ? "Credential updated!" : "Credential added!";
        },
        error: (err) =>
          err.response?.data?.detail ||
          `Failed to ${isEdit ? "update" : "add"} credential.`,
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{domainToEdit ? "Edit Credential" : "Add New Credential"}</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

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
              {loading
                ? "Saving..."
                : domainToEdit
                  ? "Update Credential"
                  : "Save Credential"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDomain;
