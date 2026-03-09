"use client";

import { CSS } from "@dnd-kit/utilities";
import type { KanbanTask } from "@/features/kanban/types";
import { Paperclip, MessageSquare, GripVertical, Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/core/lib/utils";
import { MOCK_BOARD_MEMBERS } from "@/features/kanban/mock/board-members";

interface KanbanCardProps {
  task: KanbanTask;
  priorityLabel: string;
  /** When true, render as static card for DragOverlay (no sortable). */
  isOverlay?: boolean;
  /** Called when user clicks the card (not the drag handle) to view/edit. */
  onOpenTask?: (task: KanbanTask) => void;
}

export function KanbanCard({
  task,
  priorityLabel,
  isOverlay = false,
  onOpenTask,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isOverlay });

  const isDone = task.columnId === "done";
  const membersById = new Map(MOCK_BOARD_MEMBERS.map((m) => [m.id, m]));
  const assigneeMembers = task.assignees
    .map((id) => membersById.get(id))
    .filter(Boolean) as typeof MOCK_BOARD_MEMBERS;

  const cardBody = (
    <>
      <h4 className='leading-tight font-semibold tracking-tight'>
        {task.title}
      </h4>
      <p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
        {task.description}
      </p>
      <div className='mt-3 flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          {assigneeMembers.length > 0 ? (
            <div className='flex -space-x-1.5'>
              {assigneeMembers.slice(0, 3).map((member) => (
                <Avatar
                  key={member.id}
                  className='border-card h-6 w-6 border-2'
                  title={member.name}
                >
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className='text-[10px]'>
                    {member.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {assigneeMembers.length > 3 && (
                <span className='border-card bg-muted text-muted-foreground inline-flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-medium'>
                  +{assigneeMembers.length - 3}
                </span>
              )}
            </div>
          ) : null}
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-medium",
              isDone
                ? "bg-green-500/15 text-green-700 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {(task.checklist?.length ?? 0) > 0
              ? `${(task.checklist ?? []).filter((i) => i.checked).length}/${(task.checklist ?? []).length}`
              : isDone
                ? "100%"
                : `${task.progress}%`}
          </span>
        </div>
        {!isDone && <Progress value={task.progress} className='h-1.5 w-12' />}
      </div>
      <div className='mt-3 flex items-center justify-between gap-2'>
        <span className='bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium'>
          {priorityLabel}
        </span>
        <div className='text-muted-foreground flex items-center gap-3'>
          {task.dueDate ? (
            <span
              className='flex items-center gap-0.5 text-xs'
              title={task.dueDate}
            >
              <Calendar className='h-3 w-3' />
              {new Date(task.dueDate + "T12:00:00").toLocaleDateString(
                undefined,
                {
                  day: "2-digit",
                  month: "short",
                }
              )}
            </span>
          ) : null}
          <span className='flex items-center gap-0.5 text-xs'>
            <Paperclip className='h-3 w-3' />
            {task.attachments?.length ?? task.attachmentsCount}
          </span>
          <span className='flex items-center gap-0.5 text-xs'>
            <MessageSquare className='h-3 w-3' />
            {task.commentsCount}
          </span>
        </div>
      </div>
    </>
  );

  const cardContent = <CardContent className='p-4'>{cardBody}</CardContent>;

  if (isOverlay) {
    return (
      <Card className='kanban-card bg-card text-card-foreground ring-primary/30 rotate-1 cursor-grabbing rounded-xl border shadow-lg ring-2'>
        {cardContent}
      </Card>
    );
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "kanban-card group bg-card text-card-foreground rounded-xl border shadow transition-all duration-200 hover:shadow-md",
        isDragging && "scale-[0.98] opacity-40 shadow-md"
      )}
    >
      <div className='flex items-start gap-1 pt-4 pr-4 pb-4 pl-2'>
        <button
          type='button'
          className='text-muted-foreground hover:bg-muted hover:text-foreground focus:ring-ring mt-0.5 shrink-0 cursor-grab rounded p-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-1 focus:outline-none active:cursor-grabbing'
          aria-label='Drag to reorder'
          {...attributes}
          {...listeners}
        >
          <GripVertical className='h-4 w-4' />
        </button>
        <div
          className='min-w-0 flex-1 cursor-pointer'
          role='button'
          tabIndex={0}
          onClick={() => onOpenTask?.(task)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenTask?.(task);
            }
          }}
          aria-label={`Open task: ${task.title}`}
        >
          {cardBody}
        </div>
      </div>
    </Card>
  );
}
