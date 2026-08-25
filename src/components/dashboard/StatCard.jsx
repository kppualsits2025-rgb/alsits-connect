import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ icon: Icon, label, value, subtitle, color = "primary" }) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    chart3: "bg-emerald-50 text-emerald-600",
    chart4: "bg-red-50 text-red-500",
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
            <p className="font-heading font-bold text-3xl text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}