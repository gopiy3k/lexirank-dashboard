'use client';

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BrandChart } from "./BrandChart";
import { VisibilityTable } from "./VisibilityTable";
import { ScoreCard } from "./ScoreCard"; // ✅ import ScoreCard
import { supabase } from "@/lib/supabase";

export interface VisibilityResult {
  id: number;
  run_at: string;
  prompt: string;
  appears: boolean;
  ai_engine: string;
  brand: string;
}

interface LexiRankScore {
  ai_engine: string;
  brand: string;
  lexi_rank_score: number;
}

export default function Dashboard() {
  const [brand] = useState("LexiRank");
  const [results, setResults] = useState<VisibilityResult[]>([]);
  const [scores, setScores] = useState<LexiRankScore[]>([]); // ✅ State for API score

  // Fetch visibility results from Supabase
  useEffect(() => {
    async function fetchData() {
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

  // ✅ Fetch LexiRank scores from your API
  useEffect(() => {
    async function fetchScore() {
      try {
        const res = await fetch("/api/lexi-rank-score");
        const json = await res.json();
        setScores(json.scores || []);
      } catch (err) {
        console.error("❌ Error fetching LexiRank score:", err);
      }
    }

    fetchScore();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">AI Visibility Dashboard</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="responses">Raw Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* ✅ Score cards */}
          <div className="flex flex-wrap gap-4">
            {scores.map((score) => (
              <ScoreCard
                key={score.ai_engine}
                aiEngine={score.ai_engine}
                brand={score.brand}
                score={score.lexi_rank_score}
              />
            ))}
          </div>

          {/* 👇 Existing chart */}
          <BrandChart results={results} />
        </TabsContent>

        <TabsContent value="responses">
          <VisibilityTable results={results} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
