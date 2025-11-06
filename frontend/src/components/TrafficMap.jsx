import { MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useEffect, useState } from "react";

// ✅ Helper: Smoothly move the map when coordinates change
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length === 2) {
      map.flyTo(coords, map.getZoom(), { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

const TrafficMap = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [city, setCity] = useState("Bangalore");
  const [coords, setCoords] = useState([12.9716, 77.5946]); // default
  const [isSearching, setIsSearching] = useState(false);

  // Fetch live traffic data from Flask
  const fetchTraffic = async (latitude = coords[0], longitude = coords[1]) => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/traffic", {
        params: { lat: latitude, lon: longitude },
      });
      const data = res.data;

      if (Array.isArray(data)) {
        setTrafficData(data);
      } else {
        setTrafficData([]);
        console.warn("Unexpected backend response:", data);
      }
    } catch (error) {
      console.error("Error fetching traffic data:", error);
      setTrafficData([]);
    }
  };

  // Auto-refresh every 10 seconds
  useEffect(() => {
    fetchTraffic();
    const interval = setInterval(() => fetchTraffic(), 10000);
    return () => clearInterval(interval);
  }, [coords]);

  // Handle city search
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city},India`
      );

      if (response.data.length > 0) {
        const lat = parseFloat(response.data[0].lat);
        const lon = parseFloat(response.data[0].lon);
        console.log(`Found city ${city}:`, lat, lon);

        setCoords([lat, lon]);
        await fetchTraffic(lat, lon);
      } else {
        alert("City not found. Try again!");
      }
    } catch (error) {
      console.error("Error searching city:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // ✅ Convert traffic data into heatmap-friendly format [lat, lon, intensity]
  const heatmapPoints = trafficData.map((p) => [
    p.lat,
    p.lon,
    (p.congestion_percent || 0) / 100, // intensity between 0-1
  ]);

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "10px 0" }}>
        🚦 Live Traffic Heatmap
      </h2>

      {/* 🔍 City Search Bar */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter a city (e.g., Delhi, Mumbai)"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid gray",
              width: "250px",
              marginRight: "10px",
            }}
          />
          <button
            type="submit"
            disabled={isSearching}
            style={{
              padding: "10px 15px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: isSearching ? "gray" : "dodgerblue",
              color: "white",
              cursor: isSearching ? "not-allowed" : "pointer",
            }}
          >
            {isSearching ? "Searching..." : "Search City"}
          </button>
        </form>
      </div>

      {/* 🗺️ Map Display */}
      <div style={{ height: "85vh", width: "100%" }}>
        <MapContainer
          center={coords}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <RecenterMap coords={coords} />

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🔥 Heatmap Layer */}
          {trafficData.length > 0 && (
            <HeatmapLayer
              fitBoundsOnLoad
              fitBoundsOnUpdate
              points={heatmapPoints}
              longitudeExtractor={(m) => m[1]}
              latitudeExtractor={(m) => m[0]}
              intensityExtractor={(m) => m[2]}
              radius={25}
              blur={20}
              maxZoom={17}
            />
          )}
        </MapContainer>
      </div>

      {/* 🧭 Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          right: "30px",
          background: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          fontSize: "13px",
        }}
      >
        <h4 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>Traffic Intensity</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          <span>🟢 Low / Smooth</span>
          <span>🟠 Moderate</span>
          <span>🔴 Heavy Congestion</span>
        </div>
      </div>

      {/* ℹ️ Message if no data */}
      {trafficData.length === 0 && (
        <p style={{ textAlign: "center", color: "gray", marginTop: "10px" }}>
          ⚠️ No traffic data available for this city or area.
        </p>
      )}
    </div>
  );
};

export default TrafficMap;
