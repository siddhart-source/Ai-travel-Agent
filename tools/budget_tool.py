from langchain.tools import tool

@tool
def estimate_budget(query: str) -> str:
    """
    Estimate total trip budget.
    Input format: 'FLIGHT_PRICE, HOTEL_PRICE, DAYS'
    Example: '2907, 3650, 3'
    Returns complete budget breakdown.
    """
    try:
        parts = query.split(",")
        flight_price = float(parts[0].strip())
        hotel_price = float(parts[1].strip())
        days = int(parts[2].strip())

        # Fixed daily estimates
        food_per_day = 800
        transport_per_day = 500
        activities_per_day = 300

        # Calculations
        hotel_total = hotel_price * days
        food_total = food_per_day * days
        transport_total = transport_per_day * days
        activities_total = activities_per_day * days
        grand_total = flight_price + hotel_total + food_total + transport_total + activities_total

        result = f"""
Budget Breakdown:

✈️  Flight:        ₹{flight_price:.0f}
🏨  Hotel:         ₹{hotel_price:.0f}/night x {days} days = ₹{hotel_total:.0f}
🍽️  Food:          ₹{food_per_day}/day x {days} days = ₹{food_total:.0f}
🚗  Transport:     ₹{transport_per_day}/day x {days} days = ₹{transport_total:.0f}
🎯  Activities:    ₹{activities_per_day}/day x {days} days = ₹{activities_total:.0f}

💰  Total:         ₹{grand_total:.0f}
        """
        return result.strip()

    except Exception as e:
        return f"Error estimating budget: {str(e)}"