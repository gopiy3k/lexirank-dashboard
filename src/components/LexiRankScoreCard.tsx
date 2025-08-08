// components/LexiRankScoreCard.tsx
import * as React from "react"
// We only need CardContent, as the Card component itself is causing issues.
import { CardContent } from "@/components/ui/card";
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

  // We create our own "Card" with a div, applying the necessary styles.
  // This avoids passing props to the problematic <Card> component.
  return (
    <div 
      className={cn(
        "rounded-2xl p-4 shadow-md border bg-card text-card-foreground", // Combining user styles with default card styles
        className ?? '' // FIX: Provide an empty string fallback for className
      )} 
      {...props}
    >
      <CardContent className="flex flex-col space-y-2 p-0">
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </div>
        <div className="text-3xl font-semibold text-primary">
          {roundedScore}
        </div>
      </CardContent>
    </div>
  );
}
