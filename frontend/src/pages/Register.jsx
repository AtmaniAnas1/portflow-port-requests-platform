import React, { useState } from "react";

export default function Register({ setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        if (setRole) setRole(data.role);
        setMessage("Inscription réussie !");
        // Redirection automatique gérée dans App.jsx
      } else {
        setMessage("Erreur lors de l'inscription");
      }
    } catch (err) {
      setMessage("Erreur serveur");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff'
    }}>
      <div style={{ minWidth: 320, maxWidth: 400, width: '100%', background: '#f9f9f9', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
        <h2 style={{ textAlign: 'center' }}>Inscription</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          </div>
          <div>
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          </div>
          <button type="submit" style={{ padding: 10, borderRadius: 4, background: '#4f46e5', color: '#fff', border: 'none', fontWeight: 'bold' }}>S'inscrire</button>
        </form>
        {message && <p style={{ color: 'red', marginTop: 12 }}>{message}</p>}
      </div>
    </div>
  );
} 