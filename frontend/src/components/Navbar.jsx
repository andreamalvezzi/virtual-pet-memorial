import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      className="navbar"
      aria-label="Navigazione principale"
    >
      {/* BRAND / HOME */}
      <Link
        to="/home"
        className="navbar-brand"
        aria-label="Vai alla homepage di Virtual Pet Memorial"
      >
        Virtual Pet Memorial
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">
              I tuoi memoriali
            </Link>

            <span
              className="navbar-user"
              aria-hidden="true"
              title="Account attivo"
            >
              {user.email}
            </span>

            <button
              onClick={logout}
              className="navbar-logout"
              aria-label="Esci dal tuo account"
            >
              Esci
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Accedi
            </Link>

            <Link
              to="/register"
              className="navbar-cta"
            >
              Crea un memoriale
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
