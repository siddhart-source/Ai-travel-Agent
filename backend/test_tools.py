from tools.flight_tool import search_flights
from tools.hotel_tool import search_hotels
from tools.places_tool import search_places
from tools.weather_tool import get_weather
from tools.budget_tool import estimate_budget

print("=== FLIGHT SEARCH ===")
print(search_flights.invoke({"source": "Hyderabad", "destination": "Delhi"}))

print("\n=== HOTEL SEARCH ===")
print(search_hotels.invoke({"location": "Delhi", "min_stars": "4"}))

print("\n=== PLACES SEARCH ===")
print(search_places.invoke({"location": "Delhi"}))

print("\n=== WEATHER SEARCH ===")
print(get_weather.invoke({"location": "Delhi", "days": "3"}))

print("\n=== BUDGET ESTIMATE ===")
print(estimate_budget.invoke({"flight_price": "2907", "hotel_price": "3650", "days": "3"}))