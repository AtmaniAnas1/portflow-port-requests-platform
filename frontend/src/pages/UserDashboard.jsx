import React, { useEffect, useState } from "react";

export default function UserDashboard() {
  const [demandes, setDemandes] = useState([]);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  // Récupérer les demandes de l'utilisateur
  useEffect(() => {
    const fetchDemandes = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/user/demandes", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setDemandes(await res.json());
      }
    };
    fetchDemandes();
  }, []);

  // Créer une nouvelle demande
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/user/demandes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ description })
    });
    if (res.ok) {
      setMessage("Demande créée !");
      setDescription("");
      // Rafraîchir la liste
      const updated = await fetch("http://localhost:8080/api/user/demandes", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setDemandes(await updated.json());
    } else {
      setMessage("Erreur lors de la création");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Mes demandes portuaires</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description de la demande" required style={{ width: "70%" }} />
        <button type="submit" style={{ marginLeft: 8 }}>Créer</button>
      </form>
      {message && <p>{message}</p>}
      <ul>
        {demandes.map((d, i) => (
          <li key={i}>{d.description} - {d.etat}</li>
        ))}
      </ul>
    </div>
  );
} 