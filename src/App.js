import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SubmitReport, AdminDashboard, Login, NotFound } from "./pages";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./authContext";
// src/main.jsx or App.jsx
import "./styles/main.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <SubmitReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
