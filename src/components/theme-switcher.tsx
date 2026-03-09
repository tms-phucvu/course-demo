"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Palette, Check, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/core/lib/utils";

const COLOR_THEME_KEY = "color-theme";

/** Tailwind-style palette (500 shade) for theme swatches - see https://tailwindcss.com/docs/colors */
const TAILWIND_COLORS = [
  { id: "zinc", name: "Zinc", hex: "#71717A" },
  { id: "red", name: "Red", hex: "#EF4444" },
  { id: "orange", name: "Orange", hex: "#F97316" },
  { id: "amber", name: "Amber", hex: "#F59E0B" },
  { id: "yellow", name: "Yellow", hex: "#EAB308" },
  { id: "lime", name: "Lime", hex: "#84CC16" },
  { id: "green", name: "Green", hex: "#22C55E" },
  { id: "emerald", name: "Emerald", hex: "#10B981" },
  { id: "teal", name: "Teal", hex: "#14B8A6" },
  { id: "cyan", name: "Cyan", hex: "#06B6D4" },
  { id: "sky", name: "Sky", hex: "#0EA5E9" },
  { id: "blue", name: "Blue", hex: "#3B82F6" },
  { id: "indigo", name: "Indigo", hex: "#6366F1" },
  { id: "violet", name: "Violet", hex: "#8B5CF6" },
  { id: "purple", name: "Purple", hex: "#A855F7" },
  { id: "fuchsia", name: "Fuchsia", hex: "#D946EF" },
  { id: "pink", name: "Pink", hex: "#EC4899" },
  { id: "rose", name: "Rose", hex: "#F43F5E" },
  { id: "slate", name: "Slate", hex: "#64748B" },
  { id: "gray", name: "Gray", hex: "#6B7280" },
  { id: "neutral", name: "Neutral", hex: "#737373" },
  { id: "stone", name: "Stone", hex: "#78716C" },
] as const;

type ColorThemeId = (typeof TAILWIND_COLORS)[number]["id"];

function getStoredColorTheme(): ColorThemeId {
  if (typeof window === "undefined") return "zinc";
  const stored = window.localStorage.getItem(COLOR_THEME_KEY);
  if (stored && TAILWIND_COLORS.some((c) => c.id === stored)) {
    return stored as ColorThemeId;
  }
  return "zinc";
}

function setColorTheme(id: ColorThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-color-theme", id);
  window.localStorage.setItem(COLOR_THEME_KEY, id);
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [colorTheme, setColorThemeState] = useState<ColorThemeId>("zinc");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredColorTheme();
    setColorThemeState(stored);
    setColorTheme(stored);
  }, []);

  const handleColorSelect = (id: ColorThemeId) => {
    setColorThemeState(id);
    setColorTheme(id);
  };

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' className='theme-switcher h-9 w-9'>
        <Palette className='size-4' />
        <span className='sr-only'>Theme</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='theme-switcher h-9 w-9'
          aria-label='Open theme and color menu'
        >
          <Palette className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64'>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme ?? "system"}
          onValueChange={(value) =>
            setTheme(value as "light" | "dark" | "system")
          }
        >
          <DropdownMenuRadioItem value='light'>
            <Sun className='mr-2 size-4' />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='dark'>
            <Moon className='mr-2 size-4' />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='system'>
            <Monitor className='mr-2 size-4' />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color</DropdownMenuLabel>
        <div className='grid grid-cols-6 gap-1.5 p-1'>
          {TAILWIND_COLORS.map((color) => (
            <button
              key={color.id}
              type='button'
              onClick={() => handleColorSelect(color.id)}
              style={{ backgroundColor: color.hex }}
              className={cn(
                "hover:ring-ring flex size-8 items-center justify-center rounded-md border-2 transition-colors hover:ring-2",
                colorTheme === color.id
                  ? "border-foreground ring-ring ring-2"
                  : "border-transparent"
              )}
              title={color.name}
              aria-label={`Select ${color.name} theme`}
            >
              {colorTheme === color.id ? (
                <Check className='size-4 text-white drop-shadow-md' />
              ) : null}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
