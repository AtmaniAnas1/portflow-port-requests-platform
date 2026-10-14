import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [message, setMessage] = useState("");

  // Récupérer tous les utilisateurs et demandes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAll = async () => {
      const resUsers = await fetch("http://localhost:8080/api/admin/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (resUsers.ok) setUsers(await resUsers.json());
      const resDemandes = await fetch("http://localhost:8080/api/admin/demandes", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (resDemandes.ok) setDemandes(await resDemandes.json());
    };
    fetchAll();
  }, []);

  // Supprimer un utilisateur
  const handleDeleteUser = async (id) => {
    setMessage("");
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      setMessage("Utilisateur supprimé");
      setUsers(users.filter(u => u.id !== id));
    } else {
      setMessage("Erreur lors de la suppression utilisateur");
    }
  };

  // Supprimer une demande
  const handleDeleteDemande = async (id) => {
    setMessage("");
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/admin/demandes/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      setMessage("Demande supprimée");
      setDemandes(demandes.filter(d => d.id !== id));
    } else {
      setMessage("Erreur lors de la suppression demande");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>Gestion des utilisateurs</h2>
      {message && <p>{message}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleDeleteUser(u.id)} style={{ color: 'red' }}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Gestion des demandes</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {demandes.map((d, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td>{d.description}</td>
              <td>{d.etat}</td>
              <td>
                <button onClick={() => handleDeleteDemande(d.id)} style={{ color: 'red' }}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 