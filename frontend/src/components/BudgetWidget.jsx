import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Wallet } from 'lucide-react';

export function BudgetWidget({ expenses = {} }) {
  if (!Object.keys(expenses).length) return null;
  const total = Object.values(expenses).reduce((acc, val) => acc + val, 0);

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm mt-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">Estimated Budget</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(expenses).map(([category, amount]) => (
            <div key={category} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground capitalize">{category}</span>
              <span className="font-medium font-mono">₹{amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="pt-3 mt-3 border-t border-border/50 flex justify-between items-center font-semibold">
            <span>Total</span>
            <span className="text-primary font-mono text-lg">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
