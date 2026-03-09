"use client";

import { PREFECTURE_EN_TO_JA } from "@/features/user-management/constants/prefecture-map";
import { getUsersByPrefectureCountMap } from "@/features/user-management/lib/dashboard-stats";
import type { ManagementUser } from "@/features/user-management/types";
import Japan from "@react-map/japan";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.15;

/** Interpolate count to hex color: 0 -> light gray, max -> primary blue */
function countToColor(count: number, max: number): string {
  if (max <= 0) return "#e2e8f0";
  const t = Math.min(1, count / max);
  const r = Math.round(226 + (37 - 226) * t);
  const g = Math.round(232 + (99 - 232) * t);
  const b = Math.round(240 + (235 - 240) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

interface JapanMapChartProps {
  users: ManagementUser[];
}

export function JapanMapChart({ users }: JapanMapChartProps) {
  const t = useTranslations("userManagement.dashboard");
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const preventScroll = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", preventScroll, { passive: false });
    return () => el.removeEventListener("wheel", preventScroll);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
    setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)));
  }, []);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        tx: translate.x,
        ty: translate.y,
      };
    },
    [translate.x, translate.y]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setTranslate({
        x: dragStart.current.tx + e.clientX - dragStart.current.x,
        y: dragStart.current.ty + e.clientY - dragStart.current.y,
      });
    },
    [isDragging]
  );

  const onMouseUp = useCallback(() => setIsDragging(false), []);
  const onMouseLeave = useCallback(() => setIsDragging(false), []);

  const resetView = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const cityColors = useMemo(() => {
    const countMap = getUsersByPrefectureCountMap(users);
    const maxCount = Math.max(1, ...Object.values(countMap));
    const colors: Record<string, string> = {};
    for (const en of Object.keys(PREFECTURE_EN_TO_JA)) {
      colors[en] = countToColor(countMap[en] ?? 0, maxCount);
    }
    colors["Hokkaido\x8d"] = colors["Hokkaido"] ?? "#e2e8f0";
    return colors;
  }, [users]);

  const countByPrefecture = useMemo(
    () => getUsersByPrefectureCountMap(users),
    [users]
  );

  const [hoveredPrefecture, setHoveredPrefecture] = useState<string | null>(
    null
  );
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = mapWrapperRef.current;
    if (!wrapper) return;
    const getPrefectureFromId = (id: string) => {
      const parts = id.split("-");
      if (parts.length < 2) return null;
      return parts.slice(0, -1).join("-") || null;
    };
    const onMouseOver = (e: Event) => {
      const me = e as MouseEvent;
      const path = (me.target as Element)?.closest?.("svg path[id]");
      if (!path) return;
      const prefecture = getPrefectureFromId((path as SVGPathElement).id);
      if (prefecture) {
        setHoveredPrefecture(prefecture);
        setTooltipPos({ x: me.clientX, y: me.clientY });
      }
    };
    const onMouseMove = (e: Event) => {
      const me = e as MouseEvent;
      const path = (me.target as Element)?.closest?.("svg path[id]");
      if (path) setTooltipPos({ x: me.clientX, y: me.clientY });
    };
    const onMouseLeave = () => setHoveredPrefecture(null);
    wrapper.addEventListener("mouseover", onMouseOver);
    wrapper.addEventListener("mousemove", onMouseMove);
    wrapper.addEventListener("mouseleave", onMouseLeave);
    return () => {
      wrapper.removeEventListener("mouseover", onMouseOver);
      wrapper.removeEventListener("mousemove", onMouseMove);
      wrapper.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [users]);

  return (
    <div className='JapanMapChart flex flex-col gap-3'>
      <div
        ref={containerRef}
        className='bg-muted/20 relative flex h-[600px] w-full cursor-grab items-center justify-center overflow-hidden rounded-lg border active:cursor-grabbing'
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{ touchAction: "none" }}
      >
        <div
          ref={mapWrapperRef}
          className='flex items-center justify-center transition-transform will-change-transform'
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          }}
        >
          <Japan
            type='select-single'
            size={600}
            mapColor='#e2e8f0'
            strokeColor='hsl(var(--border))'
            strokeWidth={1}
            hoverColor='#93c5fd'
            selectColor='#2563eb'
            hints={false}
            hintTextColor='hsl(var(--card-foreground))'
            hintBackgroundColor='hsl(var(--card))'
            hintPadding='8px 12px'
            hintBorderRadius={6}
            cityColors={cityColors}
            disableClick
            borderStyle='solid'
          />
        </div>
        {hoveredPrefecture && (
          <div
            className='bg-card pointer-events-none fixed z-[1000] rounded-md border px-3 py-2 text-sm shadow-md'
            style={{
              left: tooltipPos.x + 8,
              top: tooltipPos.y + 12,
              color: "hsl(var(--card-foreground))",
            }}
          >
            <div className='font-medium'>
              {PREFECTURE_EN_TO_JA[hoveredPrefecture] ?? hoveredPrefecture}
            </div>
            <div className='text-muted-foreground text-xs'>
              {t("mapUserCount", {
                count:
                  countByPrefecture[hoveredPrefecture] ??
                  countByPrefecture["Hokkaido"] ??
                  0,
              })}
            </div>
          </div>
        )}
        <button
          type='button'
          onClick={resetView}
          className='bg-background hover:bg-muted absolute right-3 bottom-3 rounded-md border px-3 py-1.5 text-xs font-medium shadow'
        >
          {t("mapResetView")}
        </button>
      </div>
    </div>
  );
}
