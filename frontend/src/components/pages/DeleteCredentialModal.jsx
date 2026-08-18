import React, { useState, useEffect } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import "../../styles/page_styles/Dashboard.css";

function DeleteCredentialModal({ isOpen, onClose, onConfirm, siteName }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatched = inputValue.trim() === siteName;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isMatched) {
      onConfirm();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <div className="modal-header">
          <div className="modal-title-danger">
            <FiAlertTriangle className="danger-icon" />
            <h3>Delete Credential</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p>
              This action <strong>cannot</strong> be undone. This will
              permanently delete the credential for <strong>{siteName}</strong>.
            </p>
            <p className="prompt-text">
              Please type <strong>{siteName}</strong> to confirm.
            </p>
            <input
              type="text"
              className="confirm-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={siteName}
              autoFocus
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="danger-btn" disabled={!isMatched}>
              I understand the consequences, delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteCredentialModal;
