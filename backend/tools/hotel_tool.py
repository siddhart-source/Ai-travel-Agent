import json
import os
from pathlib import Path
from langchain.tools import tool

def load_hotels():
    """Load hotels data from JSON file."""
    data_path = Path(__file__).parent.parent / "data" / "hotels.json"
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)

@tool
def search_hotels(location: str, min_stars: int = 0) -> str:
    """
    Search for hotels in a specific city with an optional minimum star rating filter.
    
    Args:
        location: The name of the city to search for hotels in (e.g., 'Delhi', 'Mumbai').
        min_stars: Optional minimum star rating required (e.g., 3, 4, 5). Defaults to 0.
    """
    try:
        # Format the city name cleanly
        city = location.strip().title()
        
        # Ensure min_stars is treated as an integer type
        rating_threshold = int(min_stars)

        hotels = load_hotels()

        # Filter by city and stars
        matches = [
            h for h in hotels
            if h["city"] == city and h["stars"] >= rating_threshold
        ]

        if not matches:
            star_msg = f" with a rating of {rating_threshold}+ stars" if rating_threshold > 0 else ""
            return f"No hotels found in {city}{star_msg}."

        # Sort by rating (highest stars first) then by price (lowest first)
        matches = sorted(matches, key=lambda x: (-x["stars"], x["price_per_night"]))
        top3 = matches[:3]

        result = f"Top hotels in {city}:\n\n"
        for h in top3:
            result += f"""- {h['name']}
  Stars: {'⭐' * h['stars']}
  Price: ₹{h['price_per_night']}/night
  Amenities: {', '.join(h['amenities'])}\n\n"""

        return result.strip()

    except Exception as e:
        return f"Error searching hotels: {str(e)}"