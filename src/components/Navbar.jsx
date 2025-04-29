import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const Navbar = ({ darkMode, setDarkMode }) => {
  const { getValue, clearAll } = useLocalStorage();
  const user = getValue("userInfo");
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAll();
    navigate('/');
  };

  return (
    <header className="bg-green-600 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-white text-xl sm:text-2xl font-bold">♻️ CleanEarth</h1>
      <nav className="flex items-center gap-4">
        <Link to="/submit" className="text-white hover:underline">Add Report</Link>
        <Link to="/my-reports" className="text-white hover:underline">My Reports</Link>
        <span className="text-white font-medium hidden sm:inline">Hello, {user?.name || "User"}</span>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
