import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from './ui/Card';
import { MapPin } from 'lucide-react';

export function ItineraryTimeline({ content }) {
  if (!content) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <MapPin className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Your Final Itinerary</h2>
      </div>
      
      <Card className="border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6 prose prose-invert prose-blue max-w-none">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-foreground mt-6 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-primary mt-8 mb-4 flex items-center gap-2 before:content-[''] before:block before:w-2 before:h-2 before:bg-primary before:rounded-full" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-medium text-foreground mt-4 mb-2" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 text-muted-foreground my-4" {...props} />,
              li: ({node, ...props}) => <li className="text-muted-foreground" {...props} />,
              p: ({node, ...props}) => <p className="text-muted-foreground leading-relaxed my-4" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}
