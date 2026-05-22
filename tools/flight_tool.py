import json
from langchain.tools import tool
from datetime import datetime

def load_flights():
    """Load flights data from JSON file."""
    with open("data/flights.json", "r") as f:
        return json.load(f)

@tool
def search_flights(query: str) -> str:
    """
    Search for flights. Input format: 'FROM to TO'
    Example: 'Hyderabad to Delhi'
    Returns cheapest and fastest flight options.
    """
    try:
        parts = query.lower().split(" to ")
        source = parts[0].strip().title()
        destination = parts[1].strip().title()

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
        def duration(f):
            dep = datetime.fromisoformat(f["departure_time"])
            arr = datetime.fromisoformat(f["arrival_time"])
            return (arr - dep).seconds

        fastest = sorted(matches, key=duration)[0]

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