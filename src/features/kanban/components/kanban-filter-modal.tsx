"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_BOARD_MEMBERS } from "@/features/kanban/mock/board-members";
import type {
  KanbanColumn as KanbanColumnType,
  KanbanFilterState,
  Priority,
} from "@/features/kanban/types";
import { DEFAULT_KANBAN_FILTER } from "@/features/kanban/types";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/core/lib/utils";
import { AssigneesMultiSelect } from "./assignees-multi-select";

const PRIORITIES: Priority[] = ["high", "medium", "low"];

export interface KanbanFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filter: KanbanFilterState;
  onApply: (filter: KanbanFilterState) => void;
  columns: KanbanColumnType[];
}

export function KanbanFilterModal({
  open,
  onOpenChange,
  filter,
  onApply,
  columns,
}: KanbanFilterModalProps) {
  const t = useTranslations("kanban");
  const tFilter = useTranslations("kanban.filterModal");
  const tPriority = useTranslations("kanban.priority");

  const [search, setSearch] = useState(filter.search);
  const [priorities, setPriorities] = useState<Priority[]>(filter.priorities);
  const [columnIds, setColumnIds] = useState<string[]>(filter.columnIds);
  const [assigneeIds, setAssigneeIds] = useState<string[]>(filter.assigneeIds);
  const [dueDateFrom, setDueDateFrom] = useState(filter.dueDateFrom ?? "");
  const [dueDateTo, setDueDateTo] = useState(filter.dueDateTo ?? "");
  const [hasAttachments, setHasAttachments] = useState<"all" | "yes" | "no">(
    filter.hasAttachments === null
      ? "all"
      : filter.hasAttachments
        ? "yes"
        : "no"
  );

  useEffect(() => {
    if (open) {
      setSearch(filter.search);
      setPriorities(filter.priorities);
      setColumnIds(filter.columnIds);
      setAssigneeIds(filter.assigneeIds);
      setDueDateFrom(filter.dueDateFrom ?? "");
      setDueDateTo(filter.dueDateTo ?? "");
      setHasAttachments(
        filter.hasAttachments === null
          ? "all"
          : filter.hasAttachments
            ? "yes"
            : "no"
      );
    }
  }, [open, filter]);

  const handleApply = () => {
    onApply({
      search: search.trim(),
      priorities: [...priorities],
      columnIds: [...columnIds],
      assigneeIds: [...assigneeIds],
      dueDateFrom: dueDateFrom.trim() || null,
      dueDateTo: dueDateTo.trim() || null,
      hasAttachments:
        hasAttachments === "all" ? null : hasAttachments === "yes",
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setSearch(DEFAULT_KANBAN_FILTER.search);
    setPriorities(DEFAULT_KANBAN_FILTER.priorities);
    setColumnIds(DEFAULT_KANBAN_FILTER.columnIds);
    setAssigneeIds(DEFAULT_KANBAN_FILTER.assigneeIds);
    setDueDateFrom(DEFAULT_KANBAN_FILTER.dueDateFrom ?? "");
    setDueDateTo(DEFAULT_KANBAN_FILTER.dueDateTo ?? "");
    setHasAttachments("all");
  };

  const togglePriority = (p: Priority) => {
    setPriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const toggleColumn = (id: string) => {
    setColumnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const activeCount = [
    search.trim() ? 1 : 0,
    priorities.length,
    columnIds.length,
    assigneeIds.length,
    dueDateFrom || dueDateTo ? 1 : 0,
    hasAttachments !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='kanban-filter-modal max-h-[85vh] w-[90vw] max-w-[480px] overflow-y-auto p-6'>
        <DialogHeader>
          <DialogTitle>{tFilter("title")}</DialogTitle>
          <DialogDescription>{tFilter("description")}</DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-5'>
          <div className='space-y-2'>
            <Label htmlFor='filter-search'>{tFilter("searchLabel")}</Label>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2' />
              <Input
                id='filter-search'
                type='search'
                placeholder={tFilter("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-8'
                aria-label={tFilter("searchLabel")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label>{tFilter("priorityLabel")}</Label>
            <div className='flex flex-wrap gap-3'>
              {PRIORITIES.map((p) => (
                <label
                  key={p}
                  className='flex cursor-pointer items-center gap-2 text-sm'
                >
                  <Checkbox
                    checked={priorities.includes(p)}
                    onCheckedChange={() => togglePriority(p)}
                    aria-label={tPriority(p)}
                  />
                  {tPriority(p)}
                </label>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <Label>{tFilter("columnLabel")}</Label>
            <div className='flex flex-wrap gap-3'>
              {columns.map((col) => (
                <label
                  key={col.id}
                  className='flex cursor-pointer items-center gap-2 text-sm'
                >
                  <Checkbox
                    checked={columnIds.includes(col.id)}
                    onCheckedChange={() => toggleColumn(col.id)}
                    aria-label={col.name ?? t(col.titleKey)}
                  />
                  {col.name ?? t(col.titleKey)}
                </label>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <Label>{tFilter("assigneesLabel")}</Label>
            <AssigneesMultiSelect
              value={assigneeIds}
              onChange={setAssigneeIds}
              members={MOCK_BOARD_MEMBERS}
              placeholder={tFilter("assigneesPlaceholder")}
              searchPlaceholder={t("addTaskModal.assigneesSearchPlaceholder")}
              label={tFilter("assigneesLabel")}
            />
          </div>

          <div className='space-y-2'>
            <Label>{tFilter("dueDateLabel")}</Label>
            <div className='flex flex-wrap items-center gap-2'>
              <Input
                type='date'
                value={dueDateFrom}
                onChange={(e) => setDueDateFrom(e.target.value)}
                className='max-w-[140px]'
                aria-label={tFilter("dueDateFrom")}
              />
              <span className='text-muted-foreground text-sm'>–</span>
              <Input
                type='date'
                value={dueDateTo}
                onChange={(e) => setDueDateTo(e.target.value)}
                className='max-w-[140px]'
                aria-label={tFilter("dueDateTo")}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='filter-attachments'>
              {tFilter("attachmentsLabel")}
            </Label>
            <select
              id='filter-attachments'
              value={hasAttachments}
              onChange={(e) =>
                setHasAttachments(e.target.value as "all" | "yes" | "no")
              }
              className={cn(
                "border-input flex h-9 max-w-[200px] rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
              aria-label={tFilter("attachmentsLabel")}
            >
              <option value='all'>{tFilter("attachmentsAll")}</option>
              <option value='yes'>{tFilter("attachmentsWith")}</option>
              <option value='no'>{tFilter("attachmentsWithout")}</option>
            </select>
          </div>
        </div>

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button type='button' variant='outline' onClick={handleReset}>
            {tFilter("reset")}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            {t("addTaskModal.cancel")}
          </Button>
          <Button type='button' onClick={handleApply}>
            {tFilter("apply")} {activeCount > 0 ? `(${activeCount})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
