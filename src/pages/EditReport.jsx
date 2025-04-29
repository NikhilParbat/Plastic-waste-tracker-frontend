import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";

const EditReport = () => {
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    city: "",
    area: "",
    wasteType: "Dry",
    description: "",
    status: "Pending",
    image: null, // For the image file input
  });
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the report details on component mount
  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reports/${id}`);
        setReport(res.data);
        // Pre-fill form with the fetched data
        setFormData({
          location: res.data.location || "",
          city: res.data.city || "",
          area: res.data.area || "",
          wasteType: res.data.wasteType || "Dry",
          description: res.data.description || "",
          status: res.data.status || "Pending",
          image: null, // Reset image field on fetch, user can re-upload
        });
        
      } catch (err) {
        console.error("Failed to fetch report details:", err);
      }
    };

    if (id) fetchReportDetails();
  }, [id]);

  // Handle changes in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file changes
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0], // Store the first selected image file
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedReportData = { ...formData };

    try {
      const form = new FormData();
      Object.keys(updatedReportData).forEach((key) => {
        if (updatedReportData[key]) {
          form.append(key, updatedReportData[key]);
        }
      });

      // Send updated data to the backend
      const res = await axios.put(`http://localhost:5000/api/reports/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Redirect to the updated report details page
      navigate(`/report/${id}`);
    } catch (err) {
      console.error("Error updating report:", err);
    }
  };

  // Loading state until report data is fetched
  if (!report) return <p className="text-center mt-10 text-lg text-gray-500">Loading...</p>;

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg mb-6 hover:bg-blue-700 transition"
        >
          &larr; Back
        </button>

        <h2 className="text-4xl font-bold text-center mb-10">✏️ Edit Report</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-lg font-medium mb-2">
              🏙️ City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Area */}
          <div>
            <label htmlFor="area" className="block text-lg font-medium mb-2">
              🛣️ Area
            </label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          {/* Waste Type */}
          <div>
            <label htmlFor="wasteType" className="block text-lg font-medium mb-2">
              🗑️ Waste Type
            </label>
            <select
              id="wasteType"
              name="wasteType"
              value={formData.wasteType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="Dry">Dry</option>
              <option value="Wet">Wet</option>
              <option value="Plastic">Plastic</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-lg font-medium mb-2">
              📝 Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3"
              rows="4"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-lg font-medium mb-2">
              📸 Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
      <footer className="bg-emerald-700 text-white text-center py-4 fixed bottom-0 left-0 right-0">
        <p>🌱 Working Together for a Cleaner Future 🌍</p>
      </footer>
    </div>
  );
};

export default EditReport;
