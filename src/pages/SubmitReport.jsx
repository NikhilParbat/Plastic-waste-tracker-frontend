import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./SubmitReport.css";
import useLocalStorage from "../hooks/useLocalStorage";

const customIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
});

function LocationPicker({ setLocation }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setLocation(`${lat}, ${lng}`);
        },
    });
    return null;
}

function SubmitReport() {
    const [location, setLocation] = useState("");
    const [userLocation, setUserLocation] = useState([20, 78]);
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [wasteType, setWasteType] = useState("wet");
    const [reports, setReports] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const { getValue } = useLocalStorage();
    const user = getValue("userInfo");

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setLocation(`${latitude}, ${longitude}`);
                },
                (error) => console.error("Error getting location:", error),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    useEffect(() => {
        if (user?._id) {
            axios.get(`http://localhost:5000/api/reports/${user._id}`)
                .then(response => setReports(response.data.reports))
                .catch(error => console.error("Error fetching reports:", error));
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!location || !image || !user?._id) {
            alert("Please select a location, upload an image, and ensure you're logged in.");
            return;
        }

        const formData = new FormData();
        formData.append("user", user._id);
        formData.append("location", location);
        formData.append("image", image);
        formData.append("description", description);
        formData.append("wasteType", wasteType);

        try {
            await axios.post("http://localhost:5000/api/reports/", formData);
            alert("Report submitted successfully!");
            setLocation("");
            setImage(null);
            setDescription("");
            setWasteType("Wet");
            window.location.reload();
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Failed to submit report.");
        }
    };

    return (
        <div className={darkMode ? "dark-mode" : ""}>
            <header>
                <h1>🌍 Plastic Waste Reporter</h1>
                <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
                </button>
            </header>

            <main>
                <section className="map-section">
                    <h2>📍 Select Waste Location</h2>
                    <MapContainer center={userLocation} zoom={13} className="map-container">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker setLocation={setLocation} />
                        {location && <Marker position={location.split(",").map(Number)} icon={customIcon} />}
                    </MapContainer>
                    <p className="location-text">Selected Location: <b>{location || "Click on the map to select"}</b></p>
                </section>

                <section className="form-section">
                    <h2>📝 Report Waste</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="file-input"
                        />
                        <select
                            value={wasteType}
                            onChange={(e) => setWasteType(e.target.value)}
                        >
                            <option value="Wet">Wet Waste</option>
                            <option value="Dry">Dry Waste</option>
                            <option value="Plastic">Plastic</option>
                        </select>
                        <textarea
                            placeholder="Enter description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="text-area"
                        />
                        <button type="submit" className="submit-btn">Submit Report</button>
                    </form>
                </section>

                <section className="reports-section">
                    <h2>📜 Reported Waste</h2>
                    {/* <div className="reports-container">
                        {reports.map((report) => (
                            <div key={report[0]} className="report-card">
                                <p><b>📍 {report[1]}</b></p>
                                <p>📝 {report[3]}</p>
                                <p>🗑️ Type: {report[4]}</p>
                            </div>
                        ))}
                    </div> */}
                </section>
            </main>

            <footer>
                <p>🌱 Keep the environment clean! 🚮</p>
            </footer>
        </div>
    );
}

export default SubmitReport;
