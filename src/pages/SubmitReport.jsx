import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Navbar from "../components/Navbar";
import useLocalStorage from "../hooks/useLocalStorage";

const customIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation(`${lat}, ${lng}`);
    },
  });
  return null;
};

const SubmitReport = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState("");
  const [userLocation, setUserLocation] = useState([18.4926, 74.0245]);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [wasteType, setWasteType] = useState("Wet");
  const [city, setCity] = useState(""); // New field for city
  const [area, setArea] = useState(""); // New field for area
  const { getValue } = useLocalStorage();
  const user = getValue("userInfo");

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setLocation(`${latitude}, ${longitude}`);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !image || !user?._id || !city || !area) {
      return alert("Missing required fields.");
    }

    const formData = new FormData();
    formData.append("user", user._id);
    formData.append("location", location);
    formData.append("image", image);
    formData.append("description", description);
    formData.append("wasteType", wasteType);
    formData.append("city", city); // Append city field
    formData.append("area", area); // Append area field
    formData.append("status", "Pending"); // Default status

    try {
      await axios.post("http://localhost:5000/api/reports/", formData);
      alert("Report submitted!");
      setLocation("");
      setImage(null);
      setDescription("");
      setWasteType("Wet");
      setCity(""); // Reset city
      setArea(""); // Reset area
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit report.");
    }
  };

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8 ">
          <h2 className="text-2xl font-semibold mb-4 text-center">📍 Select Waste Location</h2>
          <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
            <MapContainer center={userLocation} zoom={13} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker setLocation={setLocation} />
              {location && <Marker position={location.split(",").map(Number)} icon={customIcon} />}
            </MapContainer>
          </div>
          <p className="mt-2 font-medium">Selected Location: <b>{location}</b></p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">📝 Report Waste</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded" />
            <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} className="w-full p-2 border rounded">
              <option value="Wet">Wet Waste</option>
              <option value="Dry">Dry Waste</option>
              <option value="Plastic">Plastic</option>
            </select>
            <textarea
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Enter City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Enter Area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition ">
              Submit Report
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default SubmitReport;
