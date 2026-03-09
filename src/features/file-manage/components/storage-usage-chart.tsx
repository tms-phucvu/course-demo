"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/core/lib/utils";
import * as echarts from "echarts";
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";

/** Tree node for ECharts treemap (disk usage style) */
interface DiskTreeNode {
  name: string;
  value: number;
  children?: DiskTreeNode[];
}

function getLevelOption() {
  return [
    { itemStyle: { borderWidth: 0, gapWidth: 5 } },
    { itemStyle: { gapWidth: 1 } },
    {
      colorSaturation: [0.35, 0.5],
      itemStyle: { gapWidth: 1, borderColorSaturation: 0.6 },
    },
  ];
}

/** Mock disk tree: root with children (Documents, Images, Videos, Others, Remaining). Values in GB. */
function getMockDiskTree(
  usedGb: number,
  totalGb: number,
  labels: {
    documents: string;
    images: string;
    videos: string;
    others: string;
    remaining: string;
  }
): DiskTreeNode {
  const remainingGb = Math.max(0, totalGb - usedGb);
  return {
    name: "Storage",
    value: totalGb,
    children: [
      { name: labels.documents, value: Math.round(usedGb * 0.28 * 100) / 100 },
      { name: labels.images, value: Math.round(usedGb * 0.38 * 100) / 100 },
      { name: labels.videos, value: Math.round(usedGb * 0.22 * 100) / 100 },
      { name: labels.others, value: Math.round(usedGb * 0.12 * 100) / 100 },
      ...(remainingGb > 0
        ? [{ name: labels.remaining, value: remainingGb }]
        : []),
    ],
  };
}

interface StorageUsageChartProps {
  cardTitle: string;
  cardDescription: string;
  usedGb: number;
  totalGb: number;
  usedLabel: string;
  totalLabel: string;
  labels: {
    documents: string;
    images: string;
    videos: string;
    others: string;
    remaining: string;
  };
  /** Template string with "{value}" or function that receives value and returns label */
  tooltipUnitLabel: string | ((value: number) => string);
}

export function StorageUsageChart({
  cardTitle,
  cardDescription,
  usedGb,
  totalGb,
  usedLabel,
  totalLabel,
  labels,
  tooltipUnitLabel,
}: StorageUsageChartProps) {
  const percent = totalGb > 0 ? Math.min(100, (usedGb / totalGb) * 100) : 0;
  const diskData = useMemo(
    () => getMockDiskTree(usedGb, totalGb, labels),
    [usedGb, totalGb, labels]
  );

  const option = useMemo(() => {
    const formatUtil = echarts.format;
    return {
      tooltip: {
        formatter(info: unknown) {
          const params = info as {
            value?: number;
            treePathInfo?: { name: string }[];
          };
          const value = params.value ?? 0;
          const treePathInfo = params.treePathInfo ?? [];
          const treePath: string[] = [];
          for (let i = 1; i < treePathInfo.length; i++) {
            treePath.push(treePathInfo[i].name);
          }
          const label =
            typeof tooltipUnitLabel === "function"
              ? tooltipUnitLabel(value)
              : tooltipUnitLabel.replace(
                  "{value}",
                  formatUtil.addCommas(value)
                );
          return [
            '<div class="tooltip-title">' +
              formatUtil.encodeHTML(treePath.join("/")) +
              "</div>",
            label,
          ].join("");
        },
      },
      series: [
        {
          name: cardTitle,
          type: "treemap",
          visibleMin: 300,
          label: {
            show: true,
            formatter: "{b}",
          },
          itemStyle: {
            borderColor: "#fff",
          },
          levels: getLevelOption(),
          data: [diskData],
        },
      ],
    };
  }, [cardTitle, diskData, tooltipUnitLabel]);

  return (
    <Card
      data-slot='card'
      className='StorageUsageChart bg-card text-card-foreground flex w-full flex-col gap-6 rounded-xl border py-6'
    >
      <CardHeader className='space-y-0 pb-0'>
        <CardTitle className='text-sm font-medium'>{cardTitle}</CardTitle>
        <CardDescription className='text-xs'>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4 pt-0'>
        <div className='space-y-1.5'>
          <div className='bg-muted relative h-3 w-full overflow-hidden rounded-full'>
            <div
              className={cn("bg-primary h-full rounded-full transition-all")}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className='text-muted-foreground flex items-center justify-between text-sm'>
            <span>
              {usedGb} GB {usedLabel}
            </span>
            <span>
              {totalGb} GB {totalLabel}
            </span>
          </div>
        </div>
        <div className='StorageUsageChart-treemap mt-5 h-[280px] w-full'>
          <ReactECharts
            option={option}
            style={{ height: "100%", width: "100%" }}
            notMerge
          />
        </div>
      </CardContent>
    </Card>
  );
}
