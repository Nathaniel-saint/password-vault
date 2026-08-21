import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Nav.css";

function Nav() {
  return (
    <>
      <nav className="nav-bar">
        <Link to="/" className="img-logo">
          <img src={logo} alt="logo" className="logo" />
          <h3 className="name">VAULt</h3>
        </Link>
        <nav className="nav-links">
          <Link className="s-in" to="/signin">
            Sign In
          </Link>
          <Link className="s-up" to="/register">
            Register
          </Link>
        </nav>
      </nav>
    </>
  );
}

export default Nav;
