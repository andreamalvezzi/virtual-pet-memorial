import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        padding: "10px",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <span>{user.email}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registrati</Link>
        </>
      )}
    </nav>
  );
}
