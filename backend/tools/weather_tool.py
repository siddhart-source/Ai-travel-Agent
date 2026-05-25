import requests
from langchain.tools import tool

# City coordinates mapping
CITY_COORDINATES = {
    "Delhi": (28.6139, 77.2090),
    "Mumbai": (19.0760, 72.8777),
    "Goa": (15.2993, 74.1240),
    "Hyderabad": (17.3850, 78.4867),
    "Bangalore": (12.9716, 77.5946),
    "Chennai": (13.0827, 80.2707),
    "Kolkata": (22.5726, 88.3639),
    "Jaipur": (26.9124, 75.7873),
}

@tool
def get_weather(location: str, days: int = 3) -> str:
    """
    Get weather forecast for a specific city over a certain number of days.
    
    Args:
        location: The name of the city to check weather for (e.g., 'Delhi', 'Goa')
        days: Optional number of forecast days needed. Defaults to 3.
    """
    try:
        # Format the location parameter cleanly
        city = location.strip().title()
        
        # Ensure days is treated as an integer type
        num_days = int(days)

        if city not in CITY_COORDINATES:
            return f"City '{city}' not found. Available: {', '.join(CITY_COORDINATES.keys())}"

        lat, lon = CITY_COORDINATES[city]

        # Call Open-Meteo API (free, no key needed)
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lon}"
            f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum"
            f"&timezone=auto&forecast_days={num_days}"
        )

        response = requests.get(url)
        data = response.json()

        daily = data["daily"]
        result = f"Weather forecast for {city} ({num_days} days):\n\n"

        for i in range(num_days):
            date = daily["time"][i]
            max_temp = daily["temperature_2m_max"][i]
            min_temp = daily["temperature_2m_min"][i]
            rain = daily["precipitation_sum"][i]

            result += f"Day {i+1} ({date}):\n"
            result += f"   🌡 Max: {max_temp}°C  Min: {min_temp}°C\n"
            result += f"   🌧 Rainfall: {rain}mm\n\n"

        return result.strip()

    except Exception as e:
        return f"Error fetching weather: {str(e)}"