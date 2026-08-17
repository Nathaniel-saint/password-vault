import React, { useState } from "react";
import {
  FiUser,
  FiLock,
  FiCreditCard,
  FiSliders,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";
import "../../styles/page_styles/Settings.css";

function Setting() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    fullName: "Alex Johnson",
    email: "alex.j@example.com",
    organization: "Acme Corp",
  });

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h2>Settings</h2>
        <p className="breadcrumb">Home / Settings</p>
      </header>

      <div className="settings-tabs">
        <button
          className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <FiUser /> Profile Details
        </button>
        <button
          className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <FiLock /> Security
        </button>
        <button
          className={`tab-btn ${activeTab === "billing" ? "active" : ""}`}
          onClick={() => setActiveTab("billing")}
        >
          <FiCreditCard /> Billing & Subscription
        </button>
        <button
          className={`tab-btn ${activeTab === "preferences" ? "active" : ""}`}
          onClick={() => setActiveTab("preferences")}
        >
          <FiSliders /> Preferences
        </button>
      </div>

      <div className="settings-content">
        {activeTab === "profile" && (
          <section className="settings-panel">
            <h3>Profile Settings</h3>

            <div className="avatar-section">
              <div className="avatar-placeholder">AJ</div>
              <div className="avatar-actions">
                <button className="secondary-btn">
                  <FiUpload /> Change Avatar
                </button>
                <button className="danger-text-btn">
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>

            <form
              className="settings-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Organization</label>
                <input
                  type="text"
                  value={profile.organization}
                  onChange={(e) =>
                    setProfile({ ...profile, organization: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </form>
          </section>
        )}

        {activeTab === "security" && (
          <section className="settings-panel">
            <h3>Security Settings</h3>
            <div className="security-block">
              <h4>Change Password</h4>
              <p>Update your password regularly to keep your account secure.</p>
              <form
                className="settings-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <button type="submit" className="save-btn">
                  Update Password
                </button>
              </form>
            </div>
          </section>
        )}

        {activeTab === "billing" && (
          <section className="settings-panel">
            <h3>Billing & Subscription</h3>
            <div className="plan-card">
              <div>
                <span className="plan-label">Current Plan</span>
                <h4>Enterprise Plan</h4>
                <p>Unlimited domains, priority notification alerts.</p>
              </div>
              <button className="secondary-btn">Manage Plan</button>
            </div>
          </section>
        )}

        {activeTab === "preferences" && (
          <section className="settings-panel">
            <h3>Account Preferences</h3>
            <p>Notification and interface settings preferences panel.</p>
          </section>
        )}
      </div>
    </div>
  );
}

export default Setting;
