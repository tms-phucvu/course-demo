"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/core/lib/utils";
import type { BoardMember } from "@/features/kanban/mock/board-members";

interface AssigneesMultiSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  members: BoardMember[];
  placeholder?: string;
  searchPlaceholder?: string;
  /** Used for aria-label on the trigger. */
  label?: string;
  disabled?: boolean;
}

/**
 * Searchable multi-select dropdown for choosing assignees.
 * Trigger shows selected avatars/badges; content has search input + checkbox list.
 */
export function AssigneesMultiSelect({
  value,
  onChange,
  members,
  placeholder = "Search assignees...",
  searchPlaceholder = "Search...",
  label = "Assignees",
  disabled = false,
}: AssigneesMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [members, query]);

  const t = useTranslations("kanban.addTaskModal");
  const selectedMembers = useMemo(
    () => members.filter((m) => value.includes(m.id)),
    [members, value]
  );

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((x) => x !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type='button'
          disabled={disabled}
          aria-label={label}
          aria-haspopup='listbox'
          aria-expanded={open}
          className={cn(
            "border-input bg-background flex min-h-9 w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm shadow-sm transition-colors",
            "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:bg-muted/50"
          )}
        >
          <div className='flex flex-1 flex-wrap items-center gap-1.5'>
            {selectedMembers.length > 0 ? (
              selectedMembers.map((m) => (
                <span
                  key={m.id}
                  className='bg-muted inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium'
                >
                  <Avatar className='h-4 w-4'>
                    <AvatarImage src={m.avatar} alt={m.name} />
                    <AvatarFallback className='text-[10px]'>
                      {m.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {m.name}
                </span>
              ))
            ) : (
              <span className='text-muted-foreground'>{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className='assignees-multi-select z-[110] w-(--radix-popover-trigger-width) min-w-[200px] p-0'
        align='start'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className='p-2'>
          <Input
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='h-8'
            autoComplete='off'
            aria-label={searchPlaceholder}
          />
        </div>
        <div
          className='max-h-[220px] overflow-auto border-t p-1'
          role='listbox'
          aria-multiselectable
          aria-label={label}
        >
          {filtered.length === 0 ? (
            <div className='text-muted-foreground py-4 text-center text-sm'>
              {t("assigneesNoResults")}
            </div>
          ) : (
            filtered.map((member) => (
              <button
                key={member.id}
                type='button'
                role='option'
                aria-selected={value.includes(member.id)}
                className={cn(
                  "hover:bg-muted/70 flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors",
                  value.includes(member.id) && "bg-muted/50"
                )}
                onClick={() => toggle(member.id)}
              >
                <Checkbox
                  checked={value.includes(member.id)}
                  onCheckedChange={() => toggle(member.id)}
                  aria-hidden
                  tabIndex={-1}
                  className='pointer-events-none'
                />
                <Avatar className='h-6 w-6'>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className='text-xs'>
                    {member.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{member.name}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
