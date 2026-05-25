import React, { useState, useRef, useEffect } from 'react';
import { Search, Compass } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { AgentConsole } from './components/AgentConsole';
import { ItineraryTimeline } from './components/ItineraryTimeline';
import { Skeleton } from './components/ui/Skeleton';

const BACKEND_URL = (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "http://localhost:8000" : "") || import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const API_ENDPOINT = `${BACKEND_URL}/plan`;
const WS_ENDPOINT = BACKEND_URL.startsWith("https") 
  ? BACKEND_URL.replace("https://", "wss://") + "/ws/plan" 
  : BACKEND_URL.replace("http://", "ws://") + "/ws/plan";

const CITIES = ["Delhi", "Mumbai", "Goa", "Hyderabad", "Bangalore", "Chennai", "Kolkata", "Jaipur"];

function App() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const websocket = useRef(null);

  useEffect(() => {
    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!source || !destination || !days) return;

    const query = `Plan a ${days} day trip from ${source} to ${destination}`;

    // Reset state
    setLogs([]);
    setItinerary(null);
    setIsPlanning(true);
    setIsAgentThinking(true);

    // Initialize WebSocket
    websocket.current = new WebSocket(WS_ENDPOINT);
    
    websocket.current.onopen = () => {
      websocket.current.send(JSON.stringify({ query }));
    };

    websocket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'agent_thinking') {
        setIsAgentThinking(true);
      } else if (data.type === 'tool_start' || data.type === 'tool_end') {
        setLogs((prev) => [...prev, { ...data, timestamp: new Date().toISOString() }]);
        setIsAgentThinking(true); // Still thinking after tool actions
      } else if (data.type === 'final_result') {
        setItinerary(data.content);
        setIsAgentThinking(false);
        setIsPlanning(false);
        websocket.current.close();
      } else if (data.type === 'error') {
        setLogs((prev) => [...prev, { type: 'tool_end', tool: 'System Error', result: data.message, timestamp: new Date().toISOString() }]);
        setIsAgentThinking(false);
        setIsPlanning(false);
      }
    };

    websocket.current.onerror = () => {
      setLogs((prev) => [...prev, { type: 'tool_end', tool: 'Connection Error', result: 'Could not connect to the agent backend. Ensure FastAPI is running on port 8000.', timestamp: new Date().toISOString() }]);
      setIsAgentThinking(false);
      setIsPlanning(false);
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-secondary/20">
      {/* Header / Hero Section */}
      <header className="pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-700">
          <Compass className="h-4 w-4" />
          <span className="text-sm font-medium">Llama 3.3 Powered AI Agent</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
          Design Your Perfect Journey
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl">
          Enter your travel desires and watch our autonomous agent coordinate flights, hotels, weather, and budget to build your perfect itinerary.
        </p>

        {/* Input Command Center */}
        <form onSubmit={handleSearch} className="w-full max-w-4xl relative mt-8 group animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col md:flex-row items-center bg-card rounded-xl border border-border shadow-2xl p-2 gap-2">
            <select
              className="flex h-14 w-full md:flex-1 items-center justify-between rounded-lg border border-input bg-background px-4 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              disabled={isPlanning}
              required
            >
              <option value="" disabled>Select Source</option>
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              className="flex h-14 w-full md:flex-1 items-center justify-between rounded-lg border border-input bg-background px-4 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={isPlanning}
              required
            >
              <option value="" disabled>Select Destination</option>
              {CITIES.map(city => (
                <option 
                  key={city} 
                  value={city} 
                  disabled={city === source}
                  className={city === source ? "text-muted-foreground bg-muted" : ""}
                >
                  {city}
                </option>
              ))}
            </select>

            <select
              className="flex h-14 w-full md:w-32 items-center justify-between rounded-lg border border-input bg-background px-4 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              disabled={isPlanning}
              required
            >
              <option value="" disabled>Days</option>
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <Button 
              type="submit" 
              className="h-14 w-full md:w-auto rounded-lg shadow-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground px-8 text-lg"
              disabled={isPlanning || !source || !destination || !days}
            >
              {isPlanning ? 'Planning...' : 'GENERATE TRIP'}
            </Button>
          </div>
        </form>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Agent Logs Sidebar / Console */}
        <div className={`lg:col-span-5 transition-all duration-500 ${(logs.length > 0 || isPlanning) ? 'opacity-100' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <AgentConsole logs={logs} isThinking={isAgentThinking} />
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7">
          {isPlanning && !itinerary && (
            <div className="space-y-4 animate-in fade-in duration-700">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          )}
          
          {itinerary && (
            <ItineraryTimeline content={itinerary} />
          )}
        </div>
        
      </main>
    </div>
  );
}

export default App;
