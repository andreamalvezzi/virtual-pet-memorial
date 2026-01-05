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
  const location = useLocation();

  // Focus management su cambio route (a11y)
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (main) {
      main.focus();
    }
  }, [location.pathname]);

  return (
    <>
      {/* SKIP LINK */}
      <a href="#main-content" className="skip-link">
        Vai al contenuto principale
      </a>

      {/* SEO FALLBACK GLOBALE */}
      <Helmet>
        <title>
          Virtual Pet Memorial – Un luogo per ricordare chi hai amato
        </title>
        <meta
          name="description"
          content="Crea un memoriale digitale per il tuo animale e custodisci il suo ricordo nel tempo."
        />
      </Helmet>

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENUTO PRINCIPALE */}
      <main id="main-content" tabIndex="-1">
        <div className="page-transition">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route index element={<Navigate to="/welcome" replace />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/memorials" element={<PublicMemorialsPage />} />
            <Route path="/memorials/:slug" element={<MemorialPage />} />

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

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<h1>Pagina non trovata</h1>} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;
