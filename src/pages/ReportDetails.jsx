import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom"; // For handling route params
import { MapContainer, TileLayer, Marker } from "react-leaflet"; // Leaflet components
import L from "leaflet"; // Leaflet for custom marker icon
import "leaflet/dist/leaflet.css"; // Include Leaflet CSS

const ReportDetails = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [report, setReport] = useState(null);
  const { id } = useParams(); // Get the report id from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reports/user/${id}`);
        setReport(res.data); // Assuming the response returns the full report
      } catch (err) {
        console.error("Failed to fetch report details:", err);
      }
    };

    if (id) fetchReportDetails();
  }, [id]);

  if (!report) return <p>Loading...</p>;

  const { location, description, wasteType, image, city, area, status } = report;

  // Ensure location is correctly split into lat/lng
  const [lat, lng] = location && location.split(",").map(Number);

  // Custom icon for the marker
  const customIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/submit")} // This takes you to the submit page
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700"
        >
          &larr; Back
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">Report Details</h2>
        <div className="bg-white dark:bg-white/70 p-4 rounded-xl shadow-md w-full max-w-3xl mx-auto">
          {/* <p className="text-sm text-gray-500 mb-1">📍 Location: {location}</p> */}
          <p className="text-sm text-gray-500 mb-1">🏙️ City: {city}</p>
          <p className="text-sm text-gray-500 mb-1">🛣️ Area: {area}</p>
          <p className="text-sm text-gray-500 mb-1">🗑️ Waste Type: {wasteType}</p>
          <p className="text-sm text-gray-500 mb-2">📝 Description: {description}</p>
          <p className="text-sm text-gray-500 mb-2">📊 Status: {status}</p>

          <img
            src={`http://localhost:5000/uploads/${image}`}
            alt="Waste"
            className="w-full h-64 object-cover rounded mb-4"
          />

          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">📍 Static Map</h3>
            {/* Leaflet map */}
            {lat && lng ? (
              <MapContainer center={[lat, lng]} zoom={15} style={{ height: "400px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} icon={customIcon} />
              </MapContainer>
            ) : (
              <p>Map not available for this report.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportDetails;
