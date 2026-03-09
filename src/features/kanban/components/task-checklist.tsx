"use client";

import { useState } from "react";
import { CheckSquare, Trash2, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/core/lib/utils";
import type { ChecklistItem } from "@/features/kanban/types";

interface TaskChecklistProps {
  value: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
  title?: string;
  hideCheckedLabel?: string;
  deleteLabel?: string;
  addPlaceholder?: string;
  addLabel?: string;
  cancelLabel?: string;
  assignLabel?: string;
  dueDateLabel?: string;
  noItemsLabel?: string;
  /** Optional: called when user clicks Delete (remove entire checklist). */
  onDeleteAll?: () => void;
}

export function TaskChecklist({
  value,
  onChange,
  title = "Checklist",
  hideCheckedLabel = "Hide checked items",
  deleteLabel = "Delete",
  addPlaceholder = "Add an item",
  addLabel = "Add",
  cancelLabel = "Cancel",
  assignLabel = "Assign",
  dueDateLabel = "Due date",
  noItemsLabel = "No items yet",
  onDeleteAll,
}: TaskChecklistProps) {
  const [hideChecked, setHideChecked] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const visibleItems = hideChecked ? value.filter((i) => !i.checked) : value;
  const checkedCount = value.filter((i) => i.checked).length;
  const total = value.length;
  const progressPercent =
    total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  const toggleItem = (id: string) => {
    onChange(
      value.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const addItem = () => {
    const title = newTitle.trim();
    if (!title) return;
    onChange([...value, { id: `ci-${Date.now()}`, title, checked: false }]);
    setNewTitle("");
    setIsAdding(false);
  };

  const removeItem = (id: string) => {
    onChange(value.filter((i) => i.id !== id));
  };

  return (
    <div className='TaskChecklist border-input bg-muted/20 space-y-3 rounded-lg border p-4'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <CheckSquare className='text-muted-foreground h-5 w-5' aria-hidden />
          <h4 className='font-medium'>{title}</h4>
        </div>
        <div className='flex items-center gap-1'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-muted-foreground hover:text-foreground h-8'
            onClick={() => setHideChecked((h) => !h)}
          >
            {hideCheckedLabel}
          </Button>
          {(onDeleteAll != null || value.length > 0) && (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='text-muted-foreground hover:text-destructive h-8'
              onClick={() =>
                onDeleteAll != null ? onDeleteAll() : onChange([])
              }
            >
              {deleteLabel}
            </Button>
          )}
        </div>
      </div>

      {total > 0 && (
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground text-sm font-medium'>
            {progressPercent}%
          </span>
          <Progress value={progressPercent} className='h-2 flex-1' />
        </div>
      )}

      <ul className='space-y-1' role='list'>
        {visibleItems.length === 0 ? (
          <li className='text-muted-foreground py-2 text-center text-sm'>
            {total === 0 ? noItemsLabel : "All items checked or hidden"}
          </li>
        ) : (
          visibleItems.map((item) => (
            <li
              key={item.id}
              className='group/item hover:bg-muted/50 flex items-center gap-2 rounded-md py-1.5'
            >
              <Checkbox
                id={`check-${item.id}`}
                checked={item.checked}
                onCheckedChange={() => toggleItem(item.id)}
                aria-label={item.title}
              />
              <label
                htmlFor={`check-${item.id}`}
                className={cn(
                  "flex-1 cursor-pointer text-sm",
                  item.checked && "text-muted-foreground line-through"
                )}
              >
                {item.title}
              </label>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-7 w-7 opacity-0 group-hover/item:opacity-100'
                onClick={() => removeItem(item.id)}
                aria-label='Remove item'
              >
                <Trash2 className='h-3.5 w-3.5' />
              </Button>
            </li>
          ))
        )}
      </ul>

      <div className='border-input space-y-2 border-t pt-3'>
        {isAdding ? (
          <div className='flex flex-wrap items-center gap-2'>
            <Input
              placeholder={addPlaceholder}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem();
                }
                if (e.key === "Escape") {
                  setNewTitle("");
                  setIsAdding(false);
                }
              }}
              className='h-9 min-w-[120px] flex-1'
              autoFocus
              aria-label={addPlaceholder}
            />
            <Button type='button' size='sm' onClick={addItem}>
              {addLabel}
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => {
                setNewTitle("");
                setIsAdding(false);
              }}
            >
              {cancelLabel}
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='gap-1'
              disabled
            >
              <User className='h-3.5 w-3.5' />
              {assignLabel}
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='gap-1'
              disabled
            >
              <Calendar className='h-3.5 w-3.5' />
              {dueDateLabel}
            </Button>
          </div>
        ) : (
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='text-muted-foreground w-full justify-start'
            onClick={() => setIsAdding(true)}
          >
            {addPlaceholder}
          </Button>
        )}
      </div>
    </div>
  );
}
