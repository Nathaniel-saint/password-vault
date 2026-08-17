import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import NextHero from "./components/NextHero";
import Footer from "./components/Footer";
import AuthLayout from "./components/auth/AuthLayout";
import Register from "./components/auth/Register";
import SignIn from "./components/auth/SignIn";
import DashLayout from "./components/pages/DashLayout";
import Notifications from "./components/pages/Notifications";
import Dashboard from "./components/pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Nav /> <Hero /> <NextHero /> <Footer />
            </>
          }
        />

        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="notification" element={<Notifications />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
