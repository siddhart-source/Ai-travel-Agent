import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

from tools.flight_tool import search_flights
from tools.hotel_tool import search_hotels
from tools.places_tool import search_places
from tools.weather_tool import get_weather
from tools.budget_tool import estimate_budget

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0
)

# Bind tools to LLM
llm_with_tools = llm.bind_tools([search_flights, search_hotels, search_places, get_weather, estimate_budget])

def plan_trip(query):
    """Run the travel planning agent manually."""
    messages = [
        SystemMessage(content="""You are an expert AI travel planning assistant for India.
Use the available tools to search flights, hotels, places, weather and estimate budget.
Present a complete day-wise itinerary."""),
        HumanMessage(content=query)
    ]

    # Agent loop
    while True:
        response = llm_with_tools.invoke(messages)
        messages.append(response)

        if not response.tool_calls:
            break

        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_input = tool_call["args"]["query"]

            tool_map = {
                "search_flights": search_flights,
                "search_hotels": search_hotels,
                "search_places": search_places,
                "get_weather": get_weather,
                "estimate_budget": estimate_budget,
            }

            tool_result = tool_map[tool_name].invoke(tool_input)
            from langchain_core.messages import ToolMessage
            messages.append(ToolMessage(content=str(tool_result), tool_call_id=tool_call["id"]))

    return response.content

if __name__ == "__main__":
    print(plan_trip("Plan a 3 day trip from Hyderabad to Delhi"))