import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from './ui/Card';
import { MapPin, Calendar } from 'lucide-react';

export function ItineraryTimeline({ content }) {
  if (!content) return null;

  // Split the content into sections based on Markdown headers (## or ###)
  const sections = content.split(/(?=\n#{2,3} )/g).filter(Boolean);

  const renderMarkdownContent = (markdownText) => (
    <ReactMarkdown
      components={{
        h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-foreground mb-6" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-primary mb-4" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-lg font-medium text-foreground mt-4 mb-2" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 text-muted-foreground my-4" {...props} />,
        li: ({node, ...props}) => <li className="text-muted-foreground" {...props} />,
        p: ({node, ...props}) => <p className="text-muted-foreground leading-relaxed my-3 text-base" {...props} />,
        strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
      }}
    >
      {markdownText}
    </ReactMarkdown>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <MapPin className="h-7 w-7 text-primary animate-bounce" />
        <h2 className="text-3xl font-bold tracking-tight">Your Custom Itinerary</h2>
      </div>
      
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {sections.map((section, index) => {
          const isMainHeader = !section.trim().startsWith('##');
          
          if (isMainHeader) {
            return (
              <div key={index} className="prose prose-invert max-w-none px-4 pb-4 relative z-10 bg-background/80 backdrop-blur-sm rounded-xl">
                {renderMarkdownContent(section)}
              </div>
            );
          }

          return (
            <div key={index} className="relative z-10 flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              {/* Timeline marker node */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shadow-primary/40 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 md:mx-auto">
                <Calendar className="w-4 h-4 text-primary-foreground" />
              </div>
              
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] border-border/50 bg-card/60 backdrop-blur-xl hover:bg-card/80 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-primary/10 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="prose prose-invert prose-blue max-w-none">
                    {renderMarkdownContent(section)}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
