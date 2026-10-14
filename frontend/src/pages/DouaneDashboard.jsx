import React, { useEffect, useState } from "react";

export default function DouaneDashboard() {
  const [demandes, setDemandes] = useState([]);
  const [message, setMessage] = useState("");

  // Récupérer toutes les demandes
  useEffect(() => {
    const fetchDemandes = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/douane/demandes", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setDemandes(await res.json());
      }
    };
    fetchDemandes();
  }, []);

  // Valider ou refuser une demande
  const handleAction = async (id, action) => {
    setMessage("");
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/douane/demandes/${id}/${action}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      setMessage(`Demande ${action === 'valider' ? 'validée' : 'refusée'} !`);
      // Rafraîchir la liste
      const updated = await fetch("http://localhost:8080/api/douane/demandes", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setDemandes(await updated.json());
    } else {
      setMessage("Erreur lors de l'action");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>Demandes à traiter</h2>
      {message && <p>{message}</p>}
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
                <button onClick={() => handleAction(d.id, 'valider')} style={{ marginRight: 8 }}>Valider</button>
                <button onClick={() => handleAction(d.id, 'refuser')}>Refuser</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 