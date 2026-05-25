import json
import os
from pathlib import Path
from langchain.tools import tool

def load_places():
    """Load places data from JSON file."""
    data_path = Path(__file__).parent.parent / "data" / "places.json"
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)

@tool
def search_places(location: str, category: str = None) -> str:
    """
    Search for tourist attractions, landmarks, and places to visit in a specific city.
    
    Args:
        location: The name of the city to search within (e.g., 'Delhi', 'Goa').
        category: Optional type of attraction to filter by (e.g., 'fort', 'beach', 'temple').
    """
    try:
        # Format the city name cleanly
        city = location.strip().title()
        
        # Format category safely if provided
        place_type = category.strip().lower() if category else None

        places = load_places()

        # Filter by city
        matches = [p for p in places if p["city"] == city]

        # Filter by type if provided
        if place_type:
            matches = [p for p in matches if p["type"].lower() == place_type]

        if not matches:
            filter_msg = f" with category '{place_type}'" if place_type else ""
            return f"No places found in {city}{filter_msg}."

        # Sort by rating (highest first)
        matches = sorted(matches, key=lambda x: x["rating"], reverse=True)
        top5 = matches[:5]

        result = f"Top places to visit in {city}:\n\n"
        for p in top5:
            result += f"- {p['name']} ({p['type']})\n  Rating: {p['rating']}⭐\n\n"

        return result.strip()

    except Exception as e:
        return f"Error searching places: {str(e)}"