// components/LexiRankScoreCard.tsx
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Make sure this import is correct for your project structure

// Define the props for your component, extending standard div attributes
// This allows it to accept `className` and other standard HTML props.
type Props = {
  title: string;
  score: number | null | undefined;
} & React.HTMLAttributes<HTMLDivElement>;

export function LexiRankScoreCard({ title, score, className, ...props }: Props) {
  const roundedScore = score !== null && score !== undefined
    ? score.toFixed(3)
    : '—';

  return (
    // Use the `cn` utility to merge default styles with any passed in className
    <Card className={cn("rounded-2xl p-4 shadow-md", className)} {...props}>
      <CardContent className="flex flex-col space-y-2 p-0">
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </div>
        <div className="text-3xl font-semibold text-primary">
          {roundedScore}
        </div>
      </CardContent>
    </Card>
  );
}
