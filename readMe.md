# 🌍 GeoSense – Traffic & Environmental Intelligence Dashboard
### 🚦 Code 304: Traffic & Environmental Impact

**GeoSense** is an intelligent dashboard that visualizes how traffic congestion impacts air quality, fuel use, and emissions — empowering cities to plan cleaner, smarter mobility systems.

---

## 🚀 Core Features
- 🗺️ **Live Traffic Heatmap** – Real-time or simulated congestion visualization.  
- 🌫️ **Air Quality Overlay** – Displays PM2.5, PM10, NO₂, and CO data from APIs like OpenAQ/CPCB.  
- 📊 **Correlation Analysis** – Shows how slower speeds increase pollution levels.  
- ⛽ **Fuel & Emission Estimation** – Calculates CO₂ and fuel waste from congestion.  
- 🏙️ **City-wide AQI Ranking** – Lists the most polluted or congested routes.  
- ⏱️ **Time-based Trends** – Charts AQI and traffic over time.  
- 🔮 **Predictive Analytics (ML)** – Forecasts traffic and AQI a few hours ahead.

---

## 🌟 Innovative Highlights
- 🌿 **Environmental Stress Zones (ESZ)** – Detects areas with both high traffic and pollution.  
- 🧭 **AI-Based Green Route Suggestions** – Recommends low-emission routes.  
- 🧮 **Carbon Footprint Calculator** – Estimates CO₂ output and savings.  
- 🧠 **Smart Prediction Alerts** – Warns of upcoming AQI spikes.  
- 🤝 **Civic Collaboration Mode** – Citizens can report congestion or pollution.  
- 🪐 **Satellite & Open Data Integration (Future)** – Combine Sentinel imagery and heat mapping.

---

## 🧩 Tech Stack
**Frontend:** React.js, Leaflet, Chart.js, TailwindCSS  
**Backend:** Node.js, Express, MongoDB / PostgreSQL  
**ML Layer:** Python (Flask, Scikit-learn, XGBoost)

---

## ⚙️ Setup
```bash
git clone https://github.com/nirwaniadhau/GeoSense-Traffic-Environmental-Impact-Dashboard.git
cd GeoSense-Traffic-Environmental-Impact-Dashboard
# Backend
cd backend && pip install -r requirements.txt && python app.py
# Frontend
cd ../frontend && npm install && npm start
