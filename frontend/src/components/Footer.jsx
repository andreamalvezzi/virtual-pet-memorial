import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-copy">
          © 2026 Virtual Pet Memorial – Progetto personale indipendente
        </p>

        <nav
          className="footer-links"
          aria-label="Link legali"
        >
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
          <Link to="/contatti">Contatti</Link>
        </nav>
      </div>
    </footer>
  );
}
