import { Card, CardContent } from "@/components/ui/card";

// 1. Define a specific type for the objects in the 'results' array.
interface ResultRow {
  run_at: string;
  prompt: string;
  appears: boolean;
  ai_engine: string;
}

export function VisibilityTable({ results }: { results: ResultRow[] }) { // 2. Use the new type and remove the unused 'brand' prop.
  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-medium mb-2">Prompt Results</h2>
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Date</th>
              <th className="p-2">Prompt</th>
              <th className="p-2">Appears</th>
              <th className="p-2">Engine</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2 text-sm">
                  {new Date(r.run_at).toLocaleDateString()}
                </td>
                <td className="p-2 text-sm">{r.prompt}</td>
                <td className="p-2 text-sm">{r.appears ? "✅" : "❌"}</td>
                <td className="p-2 text-sm">{r.ai_engine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}