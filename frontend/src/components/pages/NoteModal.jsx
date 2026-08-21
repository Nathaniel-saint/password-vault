import React, { useState, useEffect } from "react";
import { FiX, FiFileText } from "react-icons/fi";
import toast from "react-hot-toast";
import { api } from "../../context/AuthContext";

function NoteModal({
  isOpen,
  onClose,
  note,
  siteName,
  domainId,
  onNoteUpdated,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedNote(note || "");
    setIsEditing(false);
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (editedNote) {
      navigator.clipboard.writeText(editedNote);
      toast.success("Note copied to clipboard!");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const savePromise = api.patch(`api/domain/${domainId}/`, {
      note: editedNote,
    });

    toast
      .promise(savePromise, {
        loading: "Saving note...",
        success: () => {
          setIsEditing(false);
          if (onNoteUpdated) onNoteUpdated();
          return "Note updated successfully!";
        },
        error: "Failed to save note.",
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    setLoading(true);
    const deletePromise = api.patch(`api/domain/${domainId}/`, {
      note: "",
    });

    toast
      .promise(deletePromise, {
        loading: "Deleting note...",
        success: () => {
          if (onNoteUpdated) onNoteUpdated();
          onClose();
          return "Note removed!";
        },
        error: "Failed to delete note.",
      })
      .finally(() => setLoading(false));
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
                Delete Note
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
                Copy
              </button>
            )}

            {isEditing ? (
              <button
                type="button"
                className="add-btn"
                onClick={handleSave}
                disabled={loading}
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                Edit
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
