import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar" aria-label="Navigazione principale">
      {/* HOME PUBBLICA */}
      <Link
        to="/home"
        className="navbar-brand"
        aria-label="Vai alla homepage"
      >
        Home
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">
              Dashboard
            </Link>

            <span
              className="navbar-user"
              aria-hidden="true"
            >
              {user.email}
            </span>

            <button
              onClick={logout}
              className="navbar-logout"
              aria-label="Esci dal tuo account"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registrati</Link>
          </>
        )}
      </div>
    </nav>
  );
}
