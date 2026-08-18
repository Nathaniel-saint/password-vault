import React, { useState, useEffect } from "react";
import {
  FiX,
  FiFileText,
  FiCopy,
  FiEdit,
  FiTrash2,
  FiSave,
} from "react-icons/fi";
import { api } from "../../context/AuthContext";

function NoteModal({
  isOpen,
  onClose,
  note,
  siteName,
  domainId,
  onNoteUpdated,
}) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setEditedNote(note || "");
    setIsEditing(false);
    setError(null);
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (editedNote) {
      navigator.clipboard.writeText(editedNote);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.patch(`api/domain/${domainId}/`, {
        note: editedNote,
      });
      setIsEditing(false);
      if (onNoteUpdated) onNoteUpdated();
    } catch (err) {
      console.error("Failed to update note:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // if (!window.confirm("Are you sure you want to clear this note?")) return;

    setLoading(true);
    setError(null);
    try {
      await api.patch(`api/domain/${domainId}/`, {
        note: "",
      });
      if (onNoteUpdated) onNoteUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to delete note:", err);
      setError("Failed to delete note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FiFileText className="modal-title-icon" /> Note:- {siteName}
          </h3>
          <button
            className="close-modal-btn"
            onClick={onClose}
            disabled={loading}
          >
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <p
              style={{
                color: "#dc2626",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              {error}
            </p>
          )}
          <textarea
            className="note-textarea"
            readOnly={!isEditing || loading}
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
            placeholder="Type your note here..."
            rows="6"
          />
        </div>

        <div
          className="modal-actions"
          style={{ justifyContent: "space-between" }}
        >
          <div>
            {note && (
              <button
                type="button"
                className="secondary-btn"
                onClick={handleDelete}
                disabled={loading}
                style={{ color: "#dc2626", borderColor: "#fca5a5" }}
              >
                {loading ? "Deleting..." : "Delete Note"}
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {editedNote && !isEditing && (
              <button
                type="button"
                className="secondary-btn"
                onClick={handleCopy}
                disabled={loading}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}

            {isEditing ? (
              <button
                type="button"
                className="add-btn"
                onClick={handleSave}
                disabled={loading}
              >
                <FiSave /> {loading ? "Saving..." : "Save"}
              </button>
            ) : (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                <FiEdit /> Edit
              </button>
            )}

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;
