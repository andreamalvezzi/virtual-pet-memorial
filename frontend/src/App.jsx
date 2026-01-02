import { Routes, Route, useLocation } from "react-router-dom";
import MemorialPage from "./pages/MemorialPage.jsx";
import NewMemorialPage from "./pages/NewMemorialPage.jsx";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import EditMemorialPage from "./pages/EditMemorialPage";
import WelcomePage from "./pages/WelcomePage.jsx";
import { Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";

function App() {
  const location = useLocation();
  
  // Nasconde la navbar nei memoriali pubblici
  const hideNavbar =
    location.pathname.startsWith("/memorials/") ||
    location.pathname === "/welcome";


  return (
    <>
      {!hideNavbar && <Navbar />}

        {/* HOME PUBBLICA */}
        <Route
        path="/home"
        element={<HomePage />
        }
        /> 

      <Routes>
      {/* HOME */}
      <Route
        index
        element={<Navigate to="/welcome" replace />}
      />

        {/* WELCOME */}
        <Route
          path="/welcome"
          element={<WelcomePage />
          }
        /> 

        {/* DASHBOARD UTENTE */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* CREA MEMORIALE */}
        <Route
          path="/dashboard/memorials/new"
          element={
            <PrivateRoute>
              <NewMemorialPage />
            </PrivateRoute>
          }
        />

        {/* MODIFICA MEMORIALE */}
        <Route
          path="/dashboard/memorials/:id/edit"
          element={
            <PrivateRoute>
              <EditMemorialPage />
            </PrivateRoute>
          }
        />

        {/* MEMORIALE PUBBLICO */}
        <Route
          path="/memorials/:slug"
          element={<MemorialPage />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={<h1>Pagina non trovata</h1>}
        />
      </Routes>
    </>
  );
}

export default App;
