"use client";

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

// 1. Define a specific type for the objects in the 'results' array.
interface ResultItem {
  run_at: string; // Assuming run_at is a date string
  appears: boolean;
}

export function BrandChart({ results }: { results: ResultItem[] }) { // 2. Use the new type and remove the unused 'brand' prop.
  const chartData = results.map((r) => ({
    date: new Date(r.run_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    appears: r.appears ? 1 : 0,
  }));

  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-medium">Visibility Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="appears"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}