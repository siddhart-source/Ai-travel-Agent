import json
from langchain.tools import tool

def load_hotels():
    """Load hotels data from JSON file."""
    with open("data/hotels.json", "r") as f:
        return json.load(f)

@tool
def search_hotels(query: str) -> str:
    """
    Search for hotels in a city.
    Input format: 'CITY' or 'CITY, STARS stars'
    Example: 'Delhi' or 'Delhi, 4 stars'
    Returns top rated hotels.
    """
    try:
        parts = query.split(",")
        city = parts[0].strip().title()
        min_stars = 0

        if len(parts) > 1:
            stars_part = parts[1].lower().replace("stars", "").strip()
            min_stars = int(stars_part)

        hotels = load_hotels()

        # Filter by city and stars
        matches = [
            h for h in hotels
            if h["city"] == city and h["stars"] >= min_stars
        ]

        if not matches:
            return f"No hotels found in {city}."

        # Sort by rating (stars) then price
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