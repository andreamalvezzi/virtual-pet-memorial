import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        padding: "10px 16px",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
        display: "flex",
        gap: "14px",
        alignItems: "center",
      }}
    >
      {/* HOME PUBBLICA */}
      <Link to="/home">Home</Link>

      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <span style={{ marginLeft: "auto" }}>
            {user.email}
          </span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Registrati</Link>
        </div>
      )}
    </nav>
  );
}
