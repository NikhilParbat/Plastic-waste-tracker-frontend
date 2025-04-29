import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SubmitReport from "./pages/SubmitReport";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import MyReports from "./pages/MyReports";
import ReportDetails from "./pages/ReportDetails";
import EditReport from "./pages/EditReport";
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
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/report/:id" element={<ReportDetails />} /> 
          <Route path="/report/edit-report/:id" element={<EditReport />} /> 
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
