'use client';

import { useEffect, useState } from "react";
// 1. Removed unused 'Card' and 'CardContent' imports
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BrandChart } from "./BrandChart";
import { VisibilityTable } from "./VisibilityTable";
import { supabase } from "@/lib/supabase";

// 2. Define a reusable type for your Supabase data.
// (Best practice: Move this interface to a central file like 'src/lib/types.ts' and import it here and in the other components)
export interface VisibilityResult {
  id: number;
  run_at: string;
  prompt: string;
  appears: boolean;
  ai_engine: string;
  brand: string;
}

export default function Dashboard() {
  // 3. Removed 'setBrand' as it was not being used.
  const [brand] = useState("LexiRank");
  // 4. Used the specific 'VisibilityResult' type instead of 'any'.
  const [results, setResults] = useState<VisibilityResult[]>([]);

  useEffect(() => {
    async function fetchData() {
      // In a real app, you might use the 'brand' variable to filter your query:
      // .eq('brand', brand)
      const { data, error } = await supabase
        .from("visibility_results")
        .select("*")
        .order("run_at", { ascending: true });

      if (error) {
        console.error("❌ Supabase error:", error.message);
      } else if (data) {
        setResults(data);
      }
    }

    fetchData();
  }, [brand]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">AI Visibility Dashboard</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="responses">Raw Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
            <BrandChart results={results} />
        </TabsContent>

        <TabsContent value="responses">
           <VisibilityTable results={results} />
        </TabsContent>
      </Tabs>
    </section>
  );
}