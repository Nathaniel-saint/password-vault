import React, { useState, useEffect } from "react";
import {
  FiX,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiCheck,
  FiShield,
  FiKey,
  FiLock,
  FiEdit3,
} from "react-icons/fi";
import "./DomainDetails.css";
import { api } from "../context/AuthContext";

function DomainDetails({ isOpen, onClose, domain }) {
  const [credentials, setCredentials] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    registrar_username: "",
    registrar_password: "",
    api_secret_key: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [showSecrets, setShowSecrets] = useState({
    registrarPass: false,
    apiSecretKey: false,
  });
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (isOpen && domain?.id) {
      setIsEditing(false);
      fetchDomainCredentials(domain.id);
    } else {
      setCredentials(null);
      setIsEditing(false);
      setError(null);
    }
  }, [isOpen, domain]);

  const fetchDomainCredentials = async (domainId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `domain/api/credentials/?domain=${domainId}`,
      );

      const rawData = response.data;
      const list = Array.isArray(rawData) ? rawData : rawData.results || [];

      const credsObj =
        list.find((c) => c.domain === domainId || c.domain?.id === domainId) ||
        list[0];

      if (credsObj && credsObj.id) {
        setCredentials(credsObj);
        setFormData({
          registrar_username: credsObj.registrar_username || "",
          registrar_password: credsObj.registrar_password || "",
          api_secret_key: credsObj.api_secret_key || "",
        });
      } else {
        setCredentials(null);
        setFormData({
          registrar_username: "",
          registrar_password: "",
          api_secret_key: "",
        });
      }
    } catch (err) {
      setCredentials(null);
      setFormData({
        registrar_username: "",
        registrar_password: "",
        api_secret_key: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        domain: domain.id,
        registrar_username: formData.registrar_username,
        registrar_password: formData.registrar_password,
        api_secret_key: formData.api_secret_key,
      };

      let response;
      if (credentials?.id) {
        response = await api.put(
          `domain/api/credentials/${credentials.id}/`,
          payload,
        );
      } else {
        response = await api.post("domain/api/credentials/", payload);
      }

      setCredentials(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Save credentials error payload:", err.response?.data);

      const apiError = err.response?.data;
      if (apiError && typeof apiError === "object") {
        const firstField = Object.keys(apiError)[0];
        const detail = Array.isArray(apiError[firstField])
          ? apiError[firstField][0]
          : apiError[firstField];
        setError(`${firstField}: ${detail}`);
      } else {
        setError("Failed to save credentials. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !domain) return null;

  const toggleVisibility = (field) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="vault-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vault-modal-header">
          <div className="vault-title-group">
            <span className="vault-icon">
              <FiShield />
            </span>
            <div>
              <h3>{domain.domain_name || domain.name}</h3>
              <p className="vault-subtitle">
                Domain Credentials & Secret Vault
              </p>
            </div>
          </div>
          <button
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

        <div className="vault-body">
          <div className="vault-info-strip">
            <div>
              <span className="strip-label">Registrar</span>
              <p className="strip-val">{domain.registrar}</p>
            </div>
            <div>
              <span className="strip-label">Expiry Date</span>
              <p className="strip-val">{domain.expiry_date || domain.expiry}</p>
            </div>
            <div>
              <span className="strip-label">Status</span>
              <span
                className={`status-pill ${(domain.status || "ACTIVE").toLowerCase().replace(/\s+/g, "-")}`}
              >
                {domain.status || "Active"}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="vault-loading">Loading credentials...</div>
          ) : isEditing ? (
            <form onSubmit={handleSaveCredentials} className="vault-edit-form">
              {error && <p className="error-msg">{error}</p>}

              <div className="vault-section">
                <div className="section-title">
                  <FiLock /> Account Details
                </div>
                <div className="vault-field-group">
                  <label>Registrar Username / Email</label>
                  <input
                    type="text"
                    name="registrar_username"
                    value={formData.registrar_username}
                    onChange={handleChange}
                    placeholder="e.g. admin@example.com"
                  />
                </div>

                <div className="vault-field-group">
                  <label>Registrar Password</label>
                  <input
                    type="password"
                    name="registrar_password"
                    value={formData.registrar_password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="vault-section">
                <div className="section-title">
                  <FiKey /> API Keys
                </div>
                <div className="vault-field-group">
                  <label>API Secret Key</label>
                  <input
                    type="text"
                    name="api_secret_key"
                    value={formData.api_secret_key}
                    onChange={handleChange}
                    placeholder="Enter API Secret Key"
                  />
                </div>
              </div>

              <div className="vault-action-row">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Credentials"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {!credentials && (
                <div className="vault-empty-state">
                  <p>No saved credentials found for this domain.</p>
                  <button
                    className="add-credentials-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    <FiEdit3 /> Add Credentials
                  </button>
                </div>
              )}

              {credentials && (
                <>
                  <div className="vault-section">
                    <div className="section-title">
                      <FiLock /> Registrar Account Details
                    </div>

                    <div className="vault-field-group">
                      <label>Registrar Username / Email</label>
                      <div className="field-input-box">
                        <input
                          type="text"
                          value={credentials.registrar_username || "Not set"}
                          readOnly
                        />
                        <button
                          className="copy-btn"
                          onClick={() =>
                            handleCopy(
                              credentials.registrar_username,
                              "registrarUser",
                            )
                          }
                          title="Copy Username"
                        >
                          {copiedField === "registrarUser" ? (
                            <FiCheck className="icon-success" />
                          ) : (
                            <FiCopy />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="vault-field-group">
                      <label>Registrar Password</label>
                      <div className="field-input-box">
                        <input
                          type={showSecrets.registrarPass ? "text" : "password"}
                          value={credentials.registrar_password || ""}
                          placeholder={
                            credentials.registrar_password ? "" : "Not set"
                          }
                          readOnly
                        />
                        <button
                          className="toggle-btn"
                          onClick={() => toggleVisibility("registrarPass")}
                          title="Toggle Password"
                        >
                          {showSecrets.registrarPass ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <button
                          className="copy-btn"
                          onClick={() =>
                            handleCopy(
                              credentials.registrar_password,
                              "registrarPass",
                            )
                          }
                          title="Copy Password"
                        >
                          {copiedField === "registrarPass" ? (
                            <FiCheck className="icon-success" />
                          ) : (
                            <FiCopy />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="vault-section">
                    <div className="section-title">
                      <FiKey /> API Keys & Secrets
                    </div>

                    <div className="vault-field-group">
                      <label>API Secret Key</label>
                      <div className="field-input-box">
                        <input
                          type={showSecrets.apiSecretKey ? "text" : "password"}
                          value={credentials.api_secret_key || ""}
                          placeholder={
                            credentials.api_secret_key ? "" : "Not set"
                          }
                          readOnly
                        />
                        <button
                          className="toggle-btn"
                          onClick={() => toggleVisibility("apiSecretKey")}
                          title="Toggle Key"
                        >
                          {showSecrets.apiSecretKey ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <button
                          className="copy-btn"
                          onClick={() =>
                            handleCopy(
                              credentials.api_secret_key,
                              "apiSecretKey",
                            )
                          }
                          title="Copy Key"
                        >
                          {copiedField === "apiSecretKey" ? (
                            <FiCheck className="icon-success" />
                          ) : (
                            <FiCopy />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="vault-action-row">
                    <button
                      className="edit-credentials-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      <FiEdit3 /> Edit Credentials
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="vault-modal-footer">
          <button className="close-vault-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DomainDetails;
