from tools.flight_tool import search_flights
from tools.hotel_tool import search_hotels
from tools.places_tool import search_places
from tools.weather_tool import get_weather
from tools.budget_tool import estimate_budget

print("=== FLIGHT SEARCH ===")
print(search_flights.invoke("Hyderabad to Delhi"))

print("\n=== HOTEL SEARCH ===")
print(search_hotels.invoke("Delhi, 4 stars"))

print("\n=== PLACES SEARCH ===")
print(search_places.invoke("Delhi"))

print("\n=== WEATHER SEARCH ===")
print(get_weather.invoke("Delhi, 3"))

print("\n=== BUDGET ESTIMATE ===")
print(estimate_budget.invoke("2907, 3650, 3"))