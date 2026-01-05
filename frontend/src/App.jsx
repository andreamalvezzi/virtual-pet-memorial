import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import PublicMemorialsPage from "./pages/PublicMemorialsPage.jsx";
import MemorialPage from "./pages/MemorialPage.jsx";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";
import NewMemorialPage from "./pages/NewMemorialPage.jsx";
import EditMemorialPage from "./pages/EditMemorialPage";

import PrivateRoute from "./components/PrivateRoute";
import SearchPage from "./pages/SearchPage";

function App() {
  const SITE_URL =
    import.meta.env.VITE_SITE_URL ||
    "https://virtual-pet-memorial-frontend.onrender.com";

  const location = useLocation();

  /* =========================
     FOCUS MANAGEMENT (A11Y)
     ========================= */
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (main) {
      main.focus();
    }
  }, [location.pathname]);

  return (
    <>
      {/* ================= SKIP LINK ================= */}
      <a href="#main-content" className="skip-link">
        Vai al contenuto principale
      </a>

      {/* ================= SEO FALLBACK GLOBALE ================= */}
      <Helmet>
        <title>
          Virtual Pet Memorial – Un luogo per ricordare chi hai amato
        </title>

        <meta
          name="description"
          content="Crea un memoriale digitale per il tuo animale e custodisci il suo ricordo nel tempo."
        />

        {/* ===== OPEN GRAPH FALLBACK ===== */}
        <meta property="og:site_name" content="Virtual Pet Memorial" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${SITE_URL}/og-default.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* ===== STRUCTURED DATA: WEBSITE ===== */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Virtual Pet Memorial",
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/#/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= CONTENUTO PRINCIPALE ================= */}
      <main id="main-content" tabIndex="-1">
        <div className="page-transition">
          <Routes>
            {/* HOME PUBBLICA */}
            <Route path="/home" element={<HomePage />} />

            {/* REDIRECT ROOT */}
            <Route index element={<Navigate to="/welcome" replace />} />

            {/* WELCOME */}
            <Route path="/welcome" element={<WelcomePage />} />

            {/* MEMORIALI PUBBLICI */}
            <Route path="/memorials" element={<PublicMemorialsPage />} />
            <Route path="/memorials/:slug" element={<MemorialPage />} />

            {/* DASHBOARD (PROTETTA) */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/memorials/new"
              element={
                <PrivateRoute>
                  <NewMemorialPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard/memorials/:id/edit"
              element={
                <PrivateRoute>
                  <EditMemorialPage />
                </PrivateRoute>
              }
            />

            {/* AUTH */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* SEARCH */}
            <Route path="/search" element={<SearchPage />} />

            {/* 404 */}
            <Route path="*" element={<h1>Pagina non trovata</h1>} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;
