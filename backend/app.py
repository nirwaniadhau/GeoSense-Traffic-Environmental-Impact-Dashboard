from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Read the TomTom API key
TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY")

@app.route('/traffic', methods=['GET'])
def get_city_traffic():
    lat = float(request.args.get('lat', 12.9716))
    lon = float(request.args.get('lon', 77.5946))

    # Define a bounding box (around 10 km area)
    delta = 0.05
    north = lat + delta
    south = lat - delta
    east = lon + delta
    west = lon - delta

    url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key={TOMTOM_API_KEY}&point={lat},{lon}"

    try:
        # We'll query a few sample points around the bounding box
        offsets = [-0.04, -0.02, 0, 0.02, 0.04]
        results = []

        for dx in offsets:
            for dy in offsets:
                point_url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key={TOMTOM_API_KEY}&point={lat+dx},{lon+dy}"
                r = requests.get(point_url)
                data = r.json()
                flow = data.get("flowSegmentData", {})
                if not flow:
                    continue

                current_speed = flow.get("currentSpeed", 0)
                free_flow_speed = flow.get("freeFlowSpeed", 1)
                congestion = 100 - int((current_speed / (free_flow_speed or 1)) * 100)
                if congestion < 0:
                    congestion = 0

                traffic_level = "Low"
                if congestion > 50:
                    traffic_level = "High"
                elif congestion > 25:
                    traffic_level = "Medium"

                results.append({
                    "lat": lat + dx,
                    "lon": lon + dy,
                    "traffic_level": traffic_level,
                    "congestion_percent": congestion,
                    "current_speed": current_speed,
                    "free_flow_speed": free_flow_speed
                })

        # ✅ Always return a list — even if empty
        return jsonify(results)

    except Exception as e:
        print("Error fetching TomTom data:", e)
        return jsonify([])  # empty list instead of error object

    except Exception as e:
        print(f"Error fetching bounding box data: {e}")
        return jsonify({"error": str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
