import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ReportDetails = () => {
  const [report, setReport] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showSave, setShowSave] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reports/user/${id}`);
        setReport(res.data);
        setNewStatus(res.data.status); // Set initial value
      } catch (err) {
        console.error("Failed to fetch report details:", err);
      }
    };

    if (id) fetchReportDetails();
  }, [id]);

  if (!report) return <p className="text-center mt-10 text-lg text-gray-500">Loading...</p>;

  const { location, description, wasteType, image, city, area, status } = report;
  const [lat, lng] = location && location.split(",").map(Number);

  const customIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/reports/delete/${id}`);
      navigate("/my-reports");
    } catch (err) {
      console.error("Failed to delete report:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/report/edit-report/${id}`);
  };

  const handleStatusChange = (e) => {
    const selected = e.target.value;
    setNewStatus(selected);
    setShowSave(selected !== status); // Only show Save if it differs from current
  };

  const handleStatusSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/reports/${id}`, {
        status: newStatus,
      });
      setReport(res.data);
      console.log(res.data)
      setShowSave(false);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-10 pb-24 flex-grow">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg mb-6 hover:bg-blue-700 transition"
        >
          &larr; Back
        </button>

        <h2 className="text-4xl font-bold text-center mb-10">📋 Report Details</h2>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Section: Details & Image */}
          <div className="flex-1">
            <div className="space-y-4 text-lg">
              <p><strong>🏙️ City:</strong> {city}</p>
              <p><strong>🛣️ Area:</strong> {area}</p>
              <p><strong>🗑️ Waste Type:</strong> {wasteType}</p>
              <p><strong>📝 Description:</strong> {description}</p>
              <p><strong>📊 Status:</strong> {status}</p>
            </div>

            <div className="my-8">
              <img
                src={`http://localhost:5000/uploads/${image}`}
                alt="Waste"
                className="w-full h-[500px] object-cover rounded-xl shadow-md"
              />
            </div>
          </div>

          {/* Right Section: Map */}
          <div className="w-full lg:w-[30%]">
            <h3 className="text-xl font-semibold mb-4">📍 Location Map</h3>
            {lat && lng ? (
              <MapContainer
                center={[lat, lng]}
                zoom={15}
                className="rounded-xl overflow-hidden shadow-md"
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} icon={customIcon} />
              </MapContainer>
            ) : (
              <p className="text-red-500">Map not available for this report.</p>
            )}
          </div>
        </div>

        {/* Admin / User Buttons */}
        <div className="mt-10 flex flex-col items-center gap-6">
          {isAdmin ? (
            <div className="w-full max-w-sm text-center">
              <h3 className="text-xl font-semibold mb-3">Change Report Status</h3>
              <select
                value={newStatus}
                onChange={handleStatusChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              {showSave && (
                <button
                  onClick={handleStatusSave}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  💾 Save Status
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleEdit}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Footer (only sticks if content is short) */}
      <footer className="bg-emerald-700 text-white text-center py-4">
        <p>🌱 Working Together for a Cleaner Future 🌍</p>
      </footer>
    </div>
  );
};

export default ReportDetails;
