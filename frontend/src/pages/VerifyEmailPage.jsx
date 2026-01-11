import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshMe } = useAuth();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  // VerifyEmailPage.jsx

useEffect(() => {
  const token = searchParams.get("token");
  if (!token) {
    setStatus("error");
    setMessage("Token mancante o non valido.");
    return;
  }

  async function verify() {
  try {
    await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify`,
      {
        params: { token },
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    setStatus("success");
    setMessage("Email verificata con successo 🎉");

    // 🔥 FORZA INVALIDAZIONE SESSIONE
    localStorage.removeItem("token");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2000);

  } catch (err) {
    setStatus("error");
    setMessage(
      err?.response?.data?.error || "Token non valido o scaduto."
    );
  }
}

  verify();
}, [searchParams, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {status === "loading" && <p>Verifica email in corso…</p>}

      {status === "success" && (
        <div>
          <h2>✅ Email verificata</h2>
          <p>{message}</p>
          <p>Verrai reindirizzato automaticamente…</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <h2>❌ Verifica fallita</h2>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
