import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import DouaneDashboard from "./pages/DouaneDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  // Gestion de la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
    navigate("/login");
  };

  // Redirection automatique après login selon le rôle
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      if (window.location.pathname === "/login" || window.location.pathname === "/register") {
        if (role === "USER") navigate("/user-dashboard");
        else if (role === "DOUANE") navigate("/douane-dashboard");
        else if (role === "ADMIN") navigate("/admin-dashboard");
      }
    }
  }, [navigate]);

  // Met à jour le rôle si login/register réussit
  useEffect(() => {
    const onStorage = () => setRole(localStorage.getItem("role"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Router>
      <nav style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: 24 }}>
        <Link to="/">Accueil</Link>
        {!role && <Link to="/login">Connexion</Link>}
        {!role && <Link to="/register">Inscription</Link>}
        {role === "USER" && <Link to="/user-dashboard">Espace Client</Link>}
        {role === "DOUANE" && <Link to="/douane-dashboard">Espace Douane</Link>}
        {role === "ADMIN" && <Link to="/admin-dashboard">Espace Admin</Link>}
        {role && <button onClick={handleLogout} style={{ marginLeft: 16 }}>Déconnexion</button>}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/register" element={<Register setRole={setRole} />} />
        <Route path="/user-dashboard" element={<ProtectedRoute allowedRoles={["USER"]}><UserDashboard /></ProtectedRoute>} />
        <Route path="/douane-dashboard" element={<ProtectedRoute allowedRoles={["DOUANE"]}><DouaneDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
