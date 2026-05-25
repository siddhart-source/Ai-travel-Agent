import React from 'react';
import { Terminal } from 'lucide-react';
import { Accordion, AccordionItem } from './ui/Accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

export function AgentConsole({ logs, isThinking }) {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Terminal className="h-4 w-4" />
          Agent Live Console
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-hide">
          {logs.length === 0 && !isThinking ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              System standing by. Enter a prompt to begin planning.
            </div>
          ) : (
            <Accordion>
              {logs.map((log, i) => (
                <AccordionItem
                  key={i}
                  title={
                    <span className="flex items-center gap-2">
                      <span className="text-primary font-mono text-xs">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="text-sm">
                        {log.type === 'tool_start' && `Executing ${log.tool}...`}
                        {log.type === 'tool_end' && `Finished ${log.tool}`}
                        {log.type === 'agent_thinking' && `Agent is thinking...`}
                      </span>
                    </span>
                  }
                  defaultOpen={log.type === 'tool_end'}
                >
                  {log.type === 'tool_start' && (
                    <div className="text-primary/80">Arguments: {JSON.stringify(log.args, null, 2)}</div>
                  )}
                  {log.type === 'tool_end' && (
                    <div className="text-foreground/80">{log.result}</div>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          )}
          
          {isThinking && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground pt-4 pl-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Agent is reasoning...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
