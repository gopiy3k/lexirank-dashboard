import React from "react";

type ScoreCardProps = {
  aiEngine: string;
  brand: string;
  score: number;
};

export const ScoreCard = ({ aiEngine, brand, score }: ScoreCardProps) => {
  return (
    <div className="border rounded-xl p-4 shadow-sm w-full md:w-1/3">
      <h3 className="text-sm text-muted-foreground mb-1 uppercase tracking-wide">
        {aiEngine}
      </h3>
      <p className="text-lg font-semibold text-gray-800">{brand}</p>
      <p className="text-3xl font-bold text-blue-600 mt-2">
        {(score * 100).toFixed(0)}%
      </p>
    </div>
  );
};
