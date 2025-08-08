import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export function BrandChart({
  brand,
  results
}: {
  brand: string;
  results: any[];
}) {
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
