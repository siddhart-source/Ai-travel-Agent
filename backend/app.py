import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import plan_trip_stream

app = FastAPI(title="AI Travel Agent")

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Travel Agent API is running"}

@app.websocket("/ws/chat")
async def chat_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # Wait for the client to send the initial query
        data = await websocket.receive_text()
        request = json.loads(data)
        query = request.get("query", "")
        
        if not query:
            await websocket.send_json({"type": "error", "message": "Query is required"})
            return
            
        # Iterate over the agent's async generator and send updates via websocket
        async for event in plan_trip_stream(query):
            await websocket.send_json(event)
            
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Websocket error: {e}")
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)

