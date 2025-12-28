import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // ⏳ mentre AuthContext legge localStorage
  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "white" }}>
        Caricamento...
      </div>
    );
  }

  // 🔒 non autenticato
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ autenticato
  return children;
}
