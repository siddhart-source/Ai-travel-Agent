import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Cloud, Sun, CloudRain } from 'lucide-react';

export function WeatherCard({ days = [] }) {
  if (!days.length) return null;
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm mt-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-primary">Weather Forecast</h3>
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {days.map((day, i) => (
            <div key={i} className="min-w-[120px] rounded-lg border border-border/50 bg-background/50 p-4 text-center">
              <div className="text-sm text-muted-foreground mb-2">{day.date}</div>
              <div className="flex justify-center mb-2">
                {day.condition === 'Sunny' ? <Sun className="h-6 w-6 text-yellow-500" /> : 
                 day.condition === 'Rain' ? <CloudRain className="h-6 w-6 text-blue-400" /> : 
                 <Cloud className="h-6 w-6 text-gray-400" />}
              </div>
              <div className="text-lg font-medium">{day.temp}°C</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
