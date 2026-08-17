import React from "react";
import { Outlet } from "react-router-dom";
import auth_image from "../../assets/auth_screen_image.png";
import "../../styles/auth_styles/AuthLayout.css";

function AuthLayout() {
  return (
    <>
      <div className="auth-all">
        <aside className="auth-side">
          <img src={auth_image} alt="authentication image" />
          <h1>Secure Domain Portfolio Management</h1>
        </aside>

        <main className="signup-in-bg">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default AuthLayout;
