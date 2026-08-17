import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import "../../styles/page_styles/DashLayout.css";
import { useAuth } from "../../context/AuthContext";

function DashLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="side-links-layout">
        <div className="logo-head-dashlayout">
          <img src={logo} alt="logo" className="dash-logo" />
          <span>Domain Guard</span>
        </div>
        <aside className="side-bar">
          <nav className="side-links">
            <NavLink to="/dashboard" end>
              <LuLayoutDashboard />
              Dashboard
            </NavLink>
            <NavLink to="notification">
              <IoIosNotificationsOutline />
              Notifications
            </NavLink>
          </nav>
          <button
            type="button"
            className="last-dash-link logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </aside>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default DashLayout;
