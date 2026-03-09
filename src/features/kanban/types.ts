/** Column id used as droppable id in DnD. Predefined: backlog, in-progress, done; custom: col-* */
export type ColumnId = string;

export type Priority = "high" | "medium" | "low";

/** Single attachment on a task (image or file). */
export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "file";
}

/** Single item in a task checklist (todo list). */
export interface ChecklistItem {
  id: string;
  title: string;
  checked: boolean;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  priority: Priority;
  progress: number;
  assignees: string[];
  /** Todo-list style checklist. Progress can be derived from checked/total. */
  checklist: ChecklistItem[];
  /** When the task was created (ISO date string). */
  createdAt: string;
  /** Optional due date (ISO date string). */
  dueDate: string | null;
  /** Uploaded attachments (images, files). */
  attachments: TaskAttachment[];
  /** @deprecated Use attachments.length. Kept for backward compat. */
  attachmentsCount: number;
  commentsCount: number;
}

export interface KanbanColumn {
  id: ColumnId;
  titleKey: string;
  /** Optional custom title for new columns. */
  name?: string;
  taskIds: string[];
}

export interface KanbanState {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
}

/** Filter state for board search and filters (modal). */
export interface KanbanFilterState {
  /** Search in title and description. */
  search: string;
  /** Show only tasks with these priorities; empty = no filter. */
  priorities: Priority[];
  /** Show only tasks in these columns; empty = no filter. */
  columnIds: string[];
  /** Show only tasks assigned to at least one of these members; empty = no filter. */
  assigneeIds: string[];
  /** Due date range (YYYY-MM-DD); null = no filter. */
  dueDateFrom: string | null;
  dueDateTo: string | null;
  /** true = only with attachments, false = only without, null = no filter. */
  hasAttachments: boolean | null;
}

/** Default filter: no search, no criteria. */
export const DEFAULT_KANBAN_FILTER: KanbanFilterState = {
  search: "",
  priorities: [],
  columnIds: [],
  assigneeIds: [],
  dueDateFrom: null,
  dueDateTo: null,
  hasAttachments: null,
};

/** Returns true if task matches the current filter. */
export function taskMatchesFilter(
  task: KanbanTask,
  filter: KanbanFilterState
): boolean {
  const q = filter.search.trim().toLowerCase();
  if (q) {
    const matchSearch =
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q);
    if (!matchSearch) return false;
  }
  if (
    filter.priorities.length > 0 &&
    !filter.priorities.includes(task.priority)
  )
    return false;
  if (filter.columnIds.length > 0 && !filter.columnIds.includes(task.columnId))
    return false;
  if (filter.assigneeIds.length > 0) {
    const hasAssignee = task.assignees.some((id) =>
      filter.assigneeIds.includes(id)
    );
    if (!hasAssignee) return false;
  }
  if (filter.dueDateFrom ?? filter.dueDateTo) {
    const due = task.dueDate;
    if (!due) return false;
    if (filter.dueDateFrom && due < filter.dueDateFrom) return false;
    if (filter.dueDateTo && due > filter.dueDateTo) return false;
  }
  if (filter.hasAttachments !== null) {
    const hasAtt = (task.attachments?.length ?? task.attachmentsCount) > 0;
    if (hasAtt !== filter.hasAttachments) return false;
  }
  return true;
}
