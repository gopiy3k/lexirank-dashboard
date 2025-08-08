// components/LexiRankScoreCard.tsx
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  score: number | null | undefined;
};

export function LexiRankScoreCard({ title, score }: Props) {
  const roundedScore = score !== null && score !== undefined
    ? score.toFixed(3)
    : '—';

  return (
    <Card className="rounded-2xl p-4 shadow-md">
      <CardContent className="flex flex-col space-y-2">
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
