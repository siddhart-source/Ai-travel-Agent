import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
import json
import asyncio

# Import custom tools
from tools.flight_tool import search_flights
from tools.hotel_tool import search_hotels
from tools.places_tool import search_places
from tools.weather_tool import get_weather
from tools.budget_tool import estimate_budget

# Bulletproof .env loading relative to the script location
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Initialize Groq LLM with slight temperature for robust formatting stability
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0.1
)

# Bind multi-parameter tools to LLM
llm_with_tools = llm.bind_tools([search_flights, search_hotels, search_places, get_weather, estimate_budget])

def plan_trip(query: str) -> str:
    """Run the travel planning agent manually via a ReAct loop."""
    messages = [
        SystemMessage(content="""You are an expert AI travel planning assistant for India.
Use the available tools to search flights, hotels, places, weather and estimate budget.
CRITICAL INSTRUCTION FOR TOOL USE:
When calling a tool, you must use native tool calling syntax. 
DO NOT wrap your tool calls in custom text tags like '<function=...>' or '</function>'.
Provide a clean tool call response only."""),
        HumanMessage(content=query)
    ]

    # Agent Loop
    while True:
        response = llm_with_tools.invoke(messages)
        messages.append(response)

        # If the LLM didn't request any more tools, the itinerary is finished
        if not response.tool_calls:
            break

        # Execute requested tools
        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]  # Extract the rich keyword arguments dict

            tool_map = {
                "search_flights": search_flights,
                "search_hotels": search_hotels,
                "search_places": search_places,
                "get_weather": get_weather,
                "estimate_budget": estimate_budget,
            }

            try:
                # Dynamically unpack the structured arguments into the selected tool function
                tool_result = tool_map[tool_name].invoke(tool_args)
            except Exception as e:
                tool_result = f"Error executing tool '{tool_name}': {str(e)}"
            
            # Append the structured response back into the history context window
            messages.append(ToolMessage(content=str(tool_result), tool_call_id=tool_call["id"]))

    return response.content

async def plan_trip_stream(query: str):
    """Run the travel planning agent asynchronously and yield events."""
    messages = [
        SystemMessage(content="""You are an expert AI travel planning assistant for India.
Use the available tools to search flights, hotels, places, weather and estimate budget.
CRITICAL INSTRUCTION FOR TOOL USE:
When calling a tool, you must use native tool calling syntax. 
DO NOT wrap your tool calls in custom text tags like '<function=...>' or '</function>'.
Provide a clean tool call response only."""),
        HumanMessage(content=query)
    ]

    # Agent Loop
    while True:
        # Yield an indicator that the agent is thinking
        yield {"type": "agent_thinking"}
        
        response = await llm_with_tools.ainvoke(messages)
        messages.append(response)

        # If the LLM didn't request any more tools, the itinerary is finished
        if not response.tool_calls:
            yield {"type": "final_result", "content": response.content}
            break

        # Execute requested tools
        for tool_call in response.tool_calls:
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]  # Extract the rich keyword arguments dict
            
            yield {"type": "tool_start", "tool": tool_name, "args": tool_args}

            tool_map = {
                "search_flights": search_flights,
                "search_hotels": search_hotels,
                "search_places": search_places,
                "get_weather": get_weather,
                "estimate_budget": estimate_budget,
            }

            try:
                # Use asyncio.to_thread to run synchronous tools without blocking
                tool_result = await asyncio.to_thread(tool_map[tool_name].invoke, tool_args)
            except Exception as e:
                tool_result = f"Error executing tool '{tool_name}': {str(e)}"
            
            yield {"type": "tool_end", "tool": tool_name, "result": tool_result}

            # Append the structured response back into the history context window
            messages.append(ToolMessage(content=str(tool_result), tool_call_id=tool_call["id"]))

if __name__ == "__main__":
    print("Starting Travel Planning Agent...\n")
    itinerary = plan_trip("Plan a 3 day trip from Hyderabad to Delhi")
    print(itinerary)