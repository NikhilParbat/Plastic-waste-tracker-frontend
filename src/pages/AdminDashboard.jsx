import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { clearAll } = useLocalStorage();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reports/');
        setReports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    clearAll();
    navigate('/');
  };

  return (
    <div className={darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header className="bg-emerald-700 fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-white text-xl sm:text-2xl font-bold">♻️ CleanEarth Admin</h1>
        <div className="flex items-center gap-3">
          <button
            className="bg-white text-emerald-700 px-4 py-2 rounded-md font-medium hover:bg-emerald-100 transition"
            onClick={toggleDarkMode}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-16">
        <section>
          <h2 className="text-3xl font-bold text-center mb-6 text-emerald-800 dark:text-emerald-300">
            🧾 Waste Reports Overview
          </h2>

          <div className="max-h-[70vh] overflow-y-auto scrollbar-thin dark:scrollbar-thumb-emerald-600 scrollbar-thumb-emerald-500 scrollbar-track-emerald-100 pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white dark:bg-white border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-300"
                >
                  <img
                    src={`http://localhost:5000/uploads/${report.image}`}
                    alt="Waste"
                    className="w-full h-48 object-cover rounded-md mb-4 border dark:border-gray-600"
                  />
                  <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400 mb-1">{report.location}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    📝 {report.description || "No description provided."}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400 mb-1">
                    🗑️ Waste Type: <span className="font-medium">{report.wasteType}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    👤 Reported by: <span className="font-medium">{report.user?.name || "Unknown"}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                    {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-700 text-white text-center py-4 fixed bottom-0 left-0 right-0">
        <p>🌱 Working Together for a Cleaner Future 🌍</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
