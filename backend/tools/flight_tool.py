import json
import os
from pathlib import Path
from langchain.tools import tool
from datetime import datetime

def load_flights():
    """Load flights data from JSON file."""
    data_path = Path(__file__).parent.parent / "data" / "flights.json"
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)

@tool
def search_flights(source: str, destination: str) -> str:
    """
    Search for available flights between an origin city and a destination city.
    
    Args:
        source: The city name where the flight originates (e.g., 'Hyderabad').
        destination: The target city name (e.g., 'Delhi').
    """
    try:
        # Format strings safely
        source = source.strip().title()
        destination = destination.strip().title()

        flights = load_flights()

        # Filter matching flights
        matches = [
            f for f in flights
            if f["from"] == source and f["to"] == destination
        ]

        if not matches:
            return f"No flights found from {source} to {destination}."

        # Sort by price to get cheapest
        cheapest = sorted(matches, key=lambda x: x["price"])[0]

        # Sort by duration to get fastest
        def get_duration(f):
            dep = datetime.fromisoformat(f["departure_time"])
            arr = datetime.fromisoformat(f["arrival_time"])
            return (arr - dep).total_seconds()  # using total_seconds() accounts for crossing midnights safely

        fastest = sorted(matches, key=get_duration)[0]

        result = f"""
Flights from {source} to {destination}:

Cheapest Option:
- Airline: {cheapest['airline']}
- Price: ₹{cheapest['price']}
- Departure: {cheapest['departure_time']}
- Arrival: {cheapest['arrival_time']}

Fastest Option:
- Airline: {fastest['airline']}
- Price: ₹{fastest['price']}
- Departure: {fastest['departure_time']}
- Arrival: {fastest['arrival_time']}

Total matches found: {len(matches)}
        """
        return result.strip()

    except Exception as e:
        return f"Error searching flights: {str(e)}"