import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SubmitReport from "./pages/SubmitReport";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

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
          <Route path="/register" element={
              <Register />}/>
          <Route
            path="/admin"
            element={
                <AdminDashboard />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
