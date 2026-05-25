import React, { useState, useRef, useEffect } from 'react';
import { Search, Compass } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { AgentConsole } from './components/AgentConsole';
import { ItineraryTimeline } from './components/ItineraryTimeline';
import { Skeleton } from './components/ui/Skeleton';

function App() {
  const [query, setQuery] = useState('');
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
    if (!query.trim()) return;

    // Reset state
    setLogs([]);
    setItinerary(null);
    setIsPlanning(true);
    setIsAgentThinking(true);

    // Initialize WebSocket
    websocket.current = new WebSocket('ws://localhost:8000/ws/chat');
    
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
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl max-w-3xl bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
          Design Your Perfect Journey
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Enter your travel desires and watch our autonomous agent coordinate flights, hotels, weather, and budget to build your perfect itinerary.
        </p>

        {/* Input Command Center */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative mt-8 group animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-card rounded-xl border border-border shadow-2xl">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input 
              className="h-14 pl-12 pr-32 text-lg bg-transparent border-none glow-input rounded-xl"
              placeholder="e.g., Plan a 3 day trip from Hyderabad to Delhi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isPlanning}
            />
            <Button 
              type="submit" 
              className="absolute right-2 h-10 rounded-lg shadow-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isPlanning || !query.trim()}
            >
              {isPlanning ? 'Planning...' : 'Generate Trip'}
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
