import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  const isLogged = !!user;
  const isVerified = user?.emailVerified;

  return (
    <nav className="navbar" aria-label="Navigazione principale">
      {/* BRAND */}
      <Link to="/home" className="navbar-brand">
        Virtual Pet Memorial
      </Link>
      <Link to="/piani" className="navbar-link-secondary">
        Piani
      </Link>

      <div className="navbar-links">
        {/* =========================
            UTENTE NON LOGGATO
           ========================= */}
        {!isLogged && (
          <>
            <Link to="/login">Accedi</Link>
            <Link to="/register" className="navbar-cta">
              Registrati
            </Link>
          </>
        )}

        {/* =========================
            LOGGATO MA NON VERIFICATO
           ========================= */}
        {isLogged && !isVerified && (
          <>
            <Link to="/dashboard">Dashboard</Link>

            <span className="navbar-warning">
              ⚠ Email non verificata
            </span>

            <button
              onClick={logout}
              className="navbar-logout"
            >
              Esci
            </button>
          </>
        )}

        {/* =========================
            LOGGATO E VERIFICATO
           ========================= */}
        {isLogged && isVerified && (
          <>
            <Link to="/dashboard">
              I tuoi memoriali
            </Link>

            <Link to="/dashboard/memorials/new">
              Crea memoriale
            </Link>

            <span className="navbar-user">
              {user.email}
            </span>

            <button
              onClick={logout}
              className="navbar-logout"
            >
              Esci
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

