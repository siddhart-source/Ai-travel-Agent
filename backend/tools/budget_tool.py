from langchain.tools import tool

@tool
def estimate_budget(flight_price: float, hotel_price: float, days: int) -> str:
    """
    Estimate total trip budget breakdown based on flight cost, hotel cost, and duration.
    
    Args:
        flight_price: The cost of the roundtrip flight (e.g., 5000.0).
        hotel_price: The cost of the hotel stay per night (e.g., 2500.0).
        days: Total number of days for the trip (e.g., 3).
    """
    try:
        # Cast inputs cleanly in case the LLM passes values inside string quotes
        flights = float(flight_price)
        hotels_per_night = float(hotel_price)
        num_days = int(days)

        # Fixed daily estimates
        food_per_day = 800
        transport_per_day = 500
        activities_per_day = 300

        # Calculations
        hotel_total = hotels_per_night * num_days
        food_total = food_per_day * num_days
        transport_total = transport_per_day * num_days
        activities_total = activities_per_day * num_days
        grand_total = flights + hotel_total + food_total + transport_total + activities_total

        result = f"""
Budget Breakdown:

✈️  Flight:         ₹{flights:.0f}
🏨  Hotel:          ₹{hotels_per_night:.0f}/night x {num_days} days = ₹{hotel_total:.0f}
🍽️  Food:           ₹{food_per_day}/day x {num_days} days = ₹{food_total:.0f}
🚗  Transport:      ₹{transport_per_day}/day x {num_days} days = ₹{transport_total:.0f}
🎯  Activities:     ₹{activities_per_day}/day x {num_days} days = ₹{activities_total:.0f}

💰  Total:          ₹{grand_total:.0f}
        """
        return result.strip()

    except Exception as e:
        return f"Error estimating budget: {str(e)}"