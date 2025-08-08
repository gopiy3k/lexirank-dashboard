'use client';

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BrandChart } from "./BrandChart";
import { VisibilityTable } from "./VisibilityTable";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [brand, setBrand] = useState("LexiRank");
  const [results, setResults] = useState<any[]>([]);
console.log("📉 Results to render:", results);

 useEffect(() => {
  async function fetchData() {
    console.log("🔍 Brand value:", brand);


    const { data, error } = await supabase
      .from("visibility_results")
      .select("*")
      .order("run_at", { ascending: true }); // 👈 correct chaining

    if (error) {
      console.error("❌ Supabase error:", error.message);
    } else {
      console.log("✅ Fetched data from Supabase:", data);
      setResults(data);
console.log("📊 Updated results state:", data);
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
          <BrandChart brand={brand} results={results} />
        </TabsContent>

        <TabsContent value="responses">
          <VisibilityTable brand={brand} results={results} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
