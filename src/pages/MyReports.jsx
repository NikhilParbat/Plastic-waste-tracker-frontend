import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import useLocalStorage from "../hooks/useLocalStorage";
import { Link } from "react-router-dom"; // Import Link for routing

const MyReports = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [reports, setReports] = useState([]);
  const { getValue } = useLocalStorage();
  const user = getValue("userInfo");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reports/${user._id}`);
        setReports(res.data.reports);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };

    if (user?._id) fetchReports();
  }, [user]);

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">📜 My Waste Reports</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {reports.length === 0 ? (
            <p className="text-lg text-center">No reports submitted yet.</p>
          ) : (
            reports.map((report) => (
              <div
                key={report._id}
                className="bg-white dark:bg-white/70 p-4 rounded-xl shadow-md w-full max-w-sm"
              >
                <p className="text-sm text-gray-500 mb-1">📍 {report.location}</p>
                <p className="text-sm text-gray-500 mb-2">📝 {report.description}</p>
                <p className="text-sm text-gray-500 mb-2">🗑️ Type: {report.wasteType}</p>
                <img
                  src={`http://localhost:5000/uploads/${report.image}`}
                  alt="Waste"
                  className="w-full h-48 object-cover rounded"
                />
                <Link
                    to={`/report/${report._id}`} // Link to the detail page of the report
                    className="inline-block px-6 py-2 mt-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                    View Details
                    </Link>
              </div>
            ))
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-emerald-700 text-white text-center py-4 fixed bottom-0 left-0 right-0">
        <p>🌱 Working Together for a Cleaner Future 🌍</p>
      </footer>
    </div>
    
  );
};

export default MyReports;
