"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive } from "lucide-react";

interface StorageRemainingCardProps {
  title: string;
  remainingGb: number;
  ofTotalLabel: string;
}

export function StorageRemainingCard({
  title,
  remainingGb,
  ofTotalLabel,
}: StorageRemainingCardProps) {
  return (
    <Card
      data-slot='card'
      className='StorageRemainingCard bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6'
    >
      <CardHeader className='space-y-0 pb-0'>
        <div className='flex flex-row items-center justify-between'>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          <HardDrive
            className='text-muted-foreground size-5 shrink-0'
            aria-hidden
          />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-4 pt-0'>
        <div className='text-2xl font-bold tabular-nums'>
          {Math.max(0, remainingGb).toFixed(1)} GB
        </div>
        <p className='text-muted-foreground text-xs'>{ofTotalLabel}</p>
      </CardContent>
    </Card>
  );
}
