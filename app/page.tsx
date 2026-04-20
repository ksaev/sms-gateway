"use client";

import { useState } from "react";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const sendPayment = async () => {
    await fetch("/api/payments", {
      method: "POST",
      body: JSON.stringify({
        name,
        phone,
        amount: Number(amount),
      }),
    });

    alert("Paiement enregistré + SMS en attente");
  };

  return (
    <div className="p-10">
      <h1 className="text-xl mb-5">Créer un paiement</h1>

      <input
        placeholder="Nom"
        className="border p-2 block mb-2"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Téléphone"
        className="border p-2 block mb-2"
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        placeholder="Montant"
        className="border p-2 block mb-2"
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={sendPayment} className="bg-green-600 text-white p-2">
        Valider paiement
      </button>
    </div>
  );
}
