import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifiedRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ attesa caricamento profilo
  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "white" }}>
        Caricamento...
      </div>
    );
  }

  // 🔒 non loggato
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ⚠️ loggato ma NON verificato
  if (!user.emailVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ verificato
  return children;
}
