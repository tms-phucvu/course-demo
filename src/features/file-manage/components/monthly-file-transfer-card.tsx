"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMonthlyTransferData } from "@/features/file-manage/lib/file-stats";
import type { MonthlyTransferItem } from "@/features/file-manage/types";
import ReactECharts from "echarts-for-react";
import { Calendar } from "lucide-react";
import { useMemo } from "react";

const TYPE_KEYS = ["document", "image", "video", "other"] as const;
const TYPE_COLORS: Record<(typeof TYPE_KEYS)[number], string> = {
  document: "#3b82f6",
  image: "#22c55e",
  video: "#ef4444",
  other: "#f59e0b",
};

interface MonthlyFileTransferCardProps {
  title: string;
  subtitle: string;
  dateRangeLabel: string;
  documentLabel: string;
  imageLabel: string;
  videoLabel: string;
  otherLabel: string;
}

export function MonthlyFileTransferCard({
  title,
  subtitle,
  dateRangeLabel,
  documentLabel,
  imageLabel,
  videoLabel,
  otherLabel,
}: MonthlyFileTransferCardProps) {
  const data = useMemo(() => getMonthlyTransferData(), []);

  const labels = useMemo(
    () => [documentLabel, imageLabel, videoLabel, otherLabel],
    [documentLabel, imageLabel, videoLabel, otherLabel]
  );

  const chartOption = useMemo(
    () => ({
      tooltip: {
        trigger: "axis" as const,
        axisPointer: { type: "shadow" as const },
        formatter(params: unknown) {
          const items = params as {
            name: string;
            value: number;
            seriesName: string;
          }[];
          if (!items?.length) return "";
          const total = items.reduce((s, p) => s + (p.value ?? 0), 0);
          const lines = items
            .filter((p) => (p.value ?? 0) > 0)
            .map(
              (p) =>
                `${p.seriesName}: ${p.value} (${total > 0 ? Math.round((Number(p.value) / total) * 100) : 0}%)`
            );
          return `<div class="font-medium">${items[0]?.name ?? ""}</div>${lines.join("<br/>")}<br/><span class="text-muted-foreground">Total: ${total}</span>`;
        },
      },
      legend: {
        data: labels,
        bottom: 0,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "18%",
        top: "8%",
        containLabel: true,
      },
      xAxis: {
        type: "category" as const,
        data: data.map((d: MonthlyTransferItem) => d.monthShort),
        axisLabel: { rotate: 45 },
      },
      yAxis: { type: "value" as const, name: "Files" },
      series: TYPE_KEYS.map((key, i) => ({
        name: labels[i],
        type: "bar" as const,
        stack: "total",
        data: data.map((d: MonthlyTransferItem) => d[key]),
        itemStyle: { color: TYPE_COLORS[key] },
      })),
    }),
    [data, labels]
  );

  return (
    <Card
      data-slot='card'
      className='MonthlyFileTransferCard bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6'
    >
      <CardHeader className='space-y-0 pb-0'>
        <div className='flex flex-row flex-wrap items-start justify-between gap-2'>
          <div>
            <CardTitle className='text-base font-medium'>{title}</CardTitle>
            <CardDescription className='text-xs'>{subtitle}</CardDescription>
          </div>
          <div className='bg-muted/50 text-muted-foreground inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm'>
            <Calendar className='size-4 shrink-0' aria-hidden />
            {dateRangeLabel}
          </div>
        </div>
      </CardHeader>
      <CardContent className='min-h-[440px] pt-0'>
        <ReactECharts
          option={chartOption}
          style={{ height: "100%", minHeight: 240, width: "100%" }}
          notMerge
        />
      </CardContent>
    </Card>
  );
}
