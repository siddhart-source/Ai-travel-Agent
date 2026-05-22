import json
from langchain.tools import tool

def load_places():
    """Load places data from JSON file."""
    with open("data/places.json", "r") as f:
        return json.load(f)

@tool
def search_places(query: str) -> str:
    """
    Search for tourist attractions in a city.
    Input format: 'CITY' or 'CITY, TYPE'
    Example: 'Delhi' or 'Delhi, fort'
    Returns top rated places to visit.
    """
    try:
        parts = query.split(",")
        city = parts[0].strip().title()
        place_type = parts[1].strip().lower() if len(parts) > 1 else None

        places = load_places()

        # Filter by city
        matches = [p for p in places if p["city"] == city]

        # Filter by type if provided
        if place_type:
            matches = [p for p in matches if p["type"].lower() == place_type]

        if not matches:
            return f"No places found in {city}."

        # Sort by rating
        matches = sorted(matches, key=lambda x: x["rating"], reverse=True)
        top5 = matches[:5]

        result = f"Top places to visit in {city}:\n\n"
        for p in top5:
            result += f"- {p['name']} ({p['type']})\n  Rating: {p['rating']}⭐\n\n"

        return result.strip()

    except Exception as e:
        return f"Error searching places: {str(e)}"