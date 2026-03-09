"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/core/lib/utils";
import {
  BOARD_MEMBERS_VISIBLE,
  MOCK_BOARD_MEMBERS,
} from "@/features/kanban/mock/board-members";
import type {
  KanbanColumn as KanbanColumnType,
  KanbanFilterState,
  KanbanState,
  KanbanTask,
} from "@/features/kanban/types";
import {
  DEFAULT_KANBAN_FILTER,
  taskMatchesFilter,
} from "@/features/kanban/types";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  defaultDropAnimation,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Filter,
  GripVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { AddMemberModal, type AddMemberFormData } from "./add-member-modal";
import { AddTaskModal, type AddTaskFormData } from "./add-task-modal";
import { EditColumnModal } from "./edit-column-modal";
import { KanbanCard } from "./kanban-card";
import { NewBoardModal } from "./new-board-modal";
import { KanbanFilterModal } from "./kanban-filter-modal";
import { NewColumnModal } from "./new-column-modal";
import { TaskDetailModal } from "./task-detail-modal";

function isOverColumn(overId: string, columns: KanbanColumnType[]): boolean {
  return columns.some((c) => c.id === overId);
}

/** Wraps KanbanColumn with useSortable so columns can be reordered by dragging the handle. */
function SortableColumnWrapper({
  column,
  tasks,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onOpenTask,
  filter,
}: {
  column: KanbanColumnType;
  tasks: KanbanState["tasks"];
  onAddTask: (columnId: KanbanColumnType["id"]) => void;
  onEditColumn: (column: KanbanColumnType) => void;
  onDeleteColumn: (column: KanbanColumnType) => void;
  onOpenTask?: (task: KanbanTask) => void;
  filter: KanbanFilterState;
}) {
  const t = useTranslations("kanban");
  const { setNodeRef, listeners, attributes, transform, transition } =
    useSortable({ id: column.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const dragHandle = (
    <Button
      variant='ghost'
      size='icon'
      className='h-8 w-8 cursor-grab active:cursor-grabbing'
      aria-label={t("columnDragHandle")}
      {...listeners}
      {...attributes}
    >
      <GripVertical className='h-4 w-4' />
    </Button>
  );
  return (
    <KanbanColumn
      column={column}
      tasks={tasks}
      onAddTask={onAddTask}
      onEditColumn={onEditColumn}
      onDeleteColumn={onDeleteColumn}
      onOpenTask={onOpenTask}
      filter={filter}
      sortableRef={setNodeRef}
      sortableStyle={style}
      dragHandle={dragHandle}
    />
  );
}

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanState["tasks"];
  onAddTask: (columnId: KanbanColumnType["id"]) => void;
  onEditColumn?: (column: KanbanColumnType) => void;
  onDeleteColumn?: (column: KanbanColumnType) => void;
  onOpenTask?: (task: KanbanTask) => void;
  filter?: KanbanFilterState;
  /** For column reorder: sortable ref and style from useSortable. */
  sortableRef?: (node: HTMLElement | null) => void;
  sortableStyle?: React.CSSProperties;
  /** Drag handle to reorder column (replaces column options button). */
  dragHandle?: React.ReactNode;
}

function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onOpenTask,
  filter = DEFAULT_KANBAN_FILTER,
  sortableRef,
  sortableStyle,
  dragHandle,
}: KanbanColumnProps) {
  const t = useTranslations("kanban");
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
  });
  const mergeRef = (node: HTMLDivElement | null) => {
    setDroppableRef(node);
    sortableRef?.(node);
  };
  const taskItems = column.taskIds
    .map((id) => tasks[id])
    .filter((task): task is NonNullable<typeof task> => {
      if (!task) return false;
      return taskMatchesFilter(task, filter);
    });

  return (
    <div
      ref={mergeRef}
      style={sortableStyle}
      className={cn(
        "kanban-column bg-muted/30 flex min-w-[320px] flex-1 flex-col rounded-lg border p-3 transition-colors",
        isOver && "bg-muted/60"
      )}
    >
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h3 className='font-semibold'>{column.name ?? t(column.titleKey)}</h3>
          <span className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium'>
            {taskItems.length}
          </span>
        </div>
        <div className='flex items-center gap-1'>
          {dragHandle ?? (
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 cursor-grab active:cursor-grabbing'
              aria-label={t("columnDragHandle")}
            >
              <GripVertical className='h-4 w-4' />
            </Button>
          )}
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            onClick={() => onAddTask(column.id)}
            aria-label={t("addTask")}
          >
            <Plus className='h-4 w-4' />
          </Button>
          {onEditColumn != null && (
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => onEditColumn(column)}
              aria-label={t("editColumn")}
            >
              <Pencil className='h-4 w-4' />
            </Button>
          )}
          {onDeleteColumn != null && (
            <Button
              variant='ghost'
              size='icon'
              className='text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8'
              onClick={() => onDeleteColumn(column)}
              aria-label={t("deleteColumn")}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          )}
        </div>
      </div>
      <SortableContext
        items={taskItems.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col gap-3'>
          {taskItems.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              priorityLabel={t(`priority.${task.priority}`)}
              onOpenTask={onOpenTask}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

interface KanbanBoardProps {
  state: KanbanState;
  onStateChange: (state: KanbanState) => void;
  boards: { id: string; nameKey?: string; name?: string }[];
  currentBoardId: string;
  onSwitchBoard: (id: string) => void;
  onCreateBoard: (name: string) => void;
  onDeleteBoard: () => void;
}

export function KanbanBoard({
  state,
  onStateChange,
  boards,
  currentBoardId,
  onSwitchBoard,
  onCreateBoard,
  onDeleteBoard,
}: KanbanBoardProps) {
  const t = useTranslations("kanban");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newBoardOpen, setNewBoardOpen] = useState(false);
  const [addColumnOpen, setAddColumnOpen] = useState(false);
  const [deleteBoardOpen, setDeleteBoardOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [addTaskColumnId, setAddTaskColumnId] = useState<string | null>(null);
  const [editColumnModalOpen, setEditColumnModalOpen] = useState(false);
  const [columnToEdit, setColumnToEdit] = useState<KanbanColumnType | null>(
    null
  );
  const [deleteColumnModalOpen, setDeleteColumnModalOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<KanbanColumnType | null>(
    null
  );
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<KanbanTask | null>(null);
  const [filter, setFilter] = useState<KanbanFilterState>(
    DEFAULT_KANBAN_FILTER
  );
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const activeTask = activeId ? state.tasks[activeId] : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Column reorder: active and over are column ids
    const isColumnDrag = state.columns.some((c) => c.id === activeId);
    if (isColumnDrag && state.columns.some((c) => c.id === overId)) {
      const from = state.columns.findIndex((c) => c.id === activeId);
      const to = state.columns.findIndex((c) => c.id === overId);
      if (from === -1 || to === -1 || from === to) return;
      const newColumns = arrayMove(state.columns, from, to);
      onStateChange({ ...state, columns: newColumns });
      return;
    }

    const task = state.tasks[activeId];
    if (!task) return;

    const activeColumn = state.columns.find((c) =>
      c.taskIds.includes(activeId)
    );
    if (!activeColumn) return;

    const activeIndex = activeColumn.taskIds.indexOf(activeId);

    if (isOverColumn(overId, state.columns)) {
      const targetColumn = state.columns.find((c) => c.id === overId);
      if (!targetColumn || targetColumn.id === activeColumn.id) return;
      const newTaskIds = activeColumn.taskIds.filter((id) => id !== activeId);
      const newTargetIds = [...targetColumn.taskIds, activeId];
      const newColumns = state.columns.map((c) => {
        if (c.id === activeColumn.id) return { ...c, taskIds: newTaskIds };
        if (c.id === overId) return { ...c, taskIds: newTargetIds };
        return c;
      });
      onStateChange({
        ...state,
        columns: newColumns,
        tasks: {
          ...state.tasks,
          [activeId]: { ...task, columnId: overId },
        },
      });
      return;
    }

    const overColumn = state.columns.find((c) => c.taskIds.includes(overId));
    if (!overColumn) return;

    const overIndex = overColumn.taskIds.indexOf(overId);
    if (activeColumn.id === overColumn.id) {
      const newTaskIds = arrayMove(
        activeColumn.taskIds,
        activeIndex,
        overIndex
      );
      onStateChange({
        ...state,
        columns: state.columns.map((c) =>
          c.id === activeColumn.id ? { ...c, taskIds: newTaskIds } : c
        ),
      });
    } else {
      const newSourceIds = activeColumn.taskIds.filter((id) => id !== activeId);
      const insertIndex = overColumn.taskIds.indexOf(overId);
      const newTargetIds = [...overColumn.taskIds];
      newTargetIds.splice(insertIndex, 0, activeId);
      onStateChange({
        ...state,
        columns: state.columns.map((c) => {
          if (c.id === activeColumn.id) return { ...c, taskIds: newSourceIds };
          if (c.id === overColumn.id) return { ...c, taskIds: newTargetIds };
          return c;
        }),
        tasks: {
          ...state.tasks,
          [activeId]: { ...task, columnId: overColumn.id },
        },
      });
    }
  };

  const handleAddTask = (columnId: KanbanColumnType["id"]) => {
    setAddTaskColumnId(columnId);
    setAddTaskModalOpen(true);
  };

  const handleCreateTask = (data: AddTaskFormData) => {
    const columnId = addTaskColumnId;
    if (!columnId) return;
    const column = state.columns.find((c) => c.id === columnId);
    if (!column) return;
    const checklist = data.checklist ?? [];
    const checkedCount = checklist.filter((i) => i.checked).length;
    const progress =
      checklist.length > 0
        ? Math.round((checkedCount / checklist.length) * 100)
        : 0;
    const newId = `t${Date.now()}`;
    const attachments = data.attachments ?? [];
    const newTask = {
      id: newId,
      title: data.title,
      description: data.description ?? "",
      columnId,
      priority: data.priority,
      progress,
      assignees: data.assignees ?? [],
      checklist,
      createdAt: new Date().toISOString(),
      dueDate: data.dueDate ?? null,
      attachments,
      attachmentsCount: attachments.length,
      commentsCount: 0,
    };
    onStateChange({
      ...state,
      columns: state.columns.map((c) =>
        c.id === columnId ? { ...c, taskIds: [...c.taskIds, newId] } : c
      ),
      tasks: { ...state.tasks, [newId]: newTask },
    });
    setAddTaskColumnId(null);
  };

  const handleAddMember = (data: AddMemberFormData) => {
    // TODO: integrate with API to add member to board
    toast.success(
      `${t("addMemberModal.memberAdded")}: ${data.email} (${data.role})`
    );
  };

  const handleAddColumn = (name: string) => {
    const newId = `col-${Date.now()}`;
    onStateChange({
      ...state,
      columns: [
        ...state.columns,
        { id: newId, titleKey: "customColumn", name, taskIds: [] },
      ],
    });
  };

  const handleConfirmDeleteBoard = () => {
    onDeleteBoard();
    setDeleteBoardOpen(false);
  };

  const handleEditColumn = (column: KanbanColumnType) => {
    setColumnToEdit(column);
    setEditColumnModalOpen(true);
  };

  const handleSaveEditColumn = (columnId: string, name: string) => {
    onStateChange({
      ...state,
      columns: state.columns.map((c) =>
        c.id === columnId ? { ...c, name } : c
      ),
    });
    setColumnToEdit(null);
  };

  const handleDeleteColumn = (column: KanbanColumnType) => {
    setColumnToDelete(column);
    setDeleteColumnModalOpen(true);
  };

  const handleConfirmDeleteColumn = () => {
    if (!columnToDelete) return;
    const taskIdsToRemove = columnToDelete.taskIds;
    const newTasks = { ...state.tasks };
    taskIdsToRemove.forEach((id) => delete newTasks[id]);
    onStateChange({
      ...state,
      columns: state.columns.filter((c) => c.id !== columnToDelete.id),
      tasks: newTasks,
    });
    setColumnToDelete(null);
    setDeleteColumnModalOpen(false);
  };

  const handleOpenTask = (task: KanbanTask) => {
    setTaskToEdit(task);
    setTaskDetailOpen(true);
  };

  const handleSaveTask = (updated: KanbanTask) => {
    onStateChange({
      ...state,
      tasks: { ...state.tasks, [updated.id]: updated },
    });
    setTaskToEdit(null);
    setTaskDetailOpen(false);
  };

  return (
    <div className='kanban-board flex flex-col gap-6'>
      <header className='flex flex-col gap-4'>
        <h1 className='text-2xl font-bold tracking-tight'>{t("boardTitle")}</h1>
        <div className='flex flex-wrap items-center gap-2 border-b pb-2'>
          {boards.map((board) => (
            <Button
              key={board.id}
              variant={currentBoardId === board.id ? "default" : "ghost"}
              size='sm'
              onClick={() => onSwitchBoard(board.id)}
            >
              {board.name ?? (board.nameKey ? t(board.nameKey) : board.id)}
            </Button>
          ))}
          <Button
            variant='outline'
            size='sm'
            className='gap-1'
            onClick={() => setNewBoardOpen(true)}
            aria-label={t("newBoardModal.title")}
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <div className='flex -space-x-2'>
              {MOCK_BOARD_MEMBERS.slice(0, BOARD_MEMBERS_VISIBLE).map(
                (member) => (
                  <Avatar
                    key={member.id}
                    className='border-background ring-background h-8 w-8 border-2 ring-2'
                    title={member.name}
                  >
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className='text-xs'>
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )
              )}
              {MOCK_BOARD_MEMBERS.length > BOARD_MEMBERS_VISIBLE && (
                <span
                  className='border-background bg-muted inline-flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium'
                  title={`+${MOCK_BOARD_MEMBERS.length - BOARD_MEMBERS_VISIBLE} more`}
                >
                  +{MOCK_BOARD_MEMBERS.length - BOARD_MEMBERS_VISIBLE}
                </span>
              )}
            </div>
            <Button
              variant='outline'
              size='sm'
              className='gap-1.5'
              onClick={() => setAddMemberOpen(true)}
            >
              <UserPlus className='h-4 w-4' />
              {t("addMember")}
            </Button>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2' />
              <Input
                type='search'
                placeholder={t("searchPlaceholder")}
                className='w-48 pl-8'
                value={filter.search}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, search: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setFilter((prev) => ({ ...prev, search: "" }));
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                aria-label={t("searchPlaceholder")}
              />
            </div>
            <Button
              variant='outline'
              size='sm'
              className='gap-1.5'
              onClick={() => setFilterModalOpen(true)}
              aria-label={t("filters")}
            >
              <Filter className='h-4 w-4' />
              {t("filters")}
            </Button>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='gap-1.5'
              onClick={() => setAddColumnOpen(true)}
            >
              <Plus className='h-4 w-4' />
              {t("addColumn")}
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5'
              onClick={() => setDeleteBoardOpen(true)}
            >
              <Trash2 className='h-4 w-4' />
              {t("deleteBoard")}
            </Button>
          </div>
        </div>
      </header>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={state.columns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className='flex gap-4 overflow-x-auto pb-4'>
            {state.columns.map((column) => (
              <SortableColumnWrapper
                key={column.id}
                column={column}
                tasks={state.tasks}
                onAddTask={handleAddTask}
                onEditColumn={handleEditColumn}
                onDeleteColumn={handleDeleteColumn}
                onOpenTask={handleOpenTask}
                filter={filter}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay
          dropAnimation={{
            ...defaultDropAnimation,
            duration: 200,
          }}
        >
          {activeTask ? (
            <KanbanCard
              task={activeTask}
              priorityLabel={t(`priority.${activeTask.priority}`)}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      <AddMemberModal
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        onSubmit={handleAddMember}
      />
      <NewBoardModal
        open={newBoardOpen}
        onOpenChange={setNewBoardOpen}
        onSubmit={(name) => {
          onCreateBoard(name);
          setNewBoardOpen(false);
        }}
      />
      <NewColumnModal
        open={addColumnOpen}
        onOpenChange={setAddColumnOpen}
        onSubmit={(name) => handleAddColumn(name)}
      />
      <AddTaskModal
        open={addTaskModalOpen}
        onOpenChange={setAddTaskModalOpen}
        onSubmit={handleCreateTask}
      />
      <KanbanFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filter={filter}
        onApply={setFilter}
        columns={state.columns}
      />
      <EditColumnModal
        open={editColumnModalOpen}
        onOpenChange={setEditColumnModalOpen}
        column={columnToEdit}
        onSubmit={handleSaveEditColumn}
      />
      <TaskDetailModal
        open={taskDetailOpen}
        onOpenChange={setTaskDetailOpen}
        task={taskToEdit}
        onSave={handleSaveTask}
      />
      <Dialog open={deleteBoardOpen} onOpenChange={setDeleteBoardOpen}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>{t("deleteBoardModal.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteBoardModal.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteBoardOpen(false)}>
              {t("deleteBoardModal.cancel")}
            </Button>
            <Button variant='destructive' onClick={handleConfirmDeleteBoard}>
              {t("deleteBoardModal.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={deleteColumnModalOpen}
        onOpenChange={setDeleteColumnModalOpen}
      >
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>{t("deleteColumnModal.title")}</DialogTitle>
            <DialogDescription>
              {columnToDelete
                ? t("deleteColumnModal.description", {
                    name:
                      columnToDelete.name ??
                      (columnToDelete.titleKey
                        ? t(columnToDelete.titleKey)
                        : columnToDelete.id),
                  })
                : t("deleteColumnModal.descriptionGeneric")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setColumnToDelete(null);
                setDeleteColumnModalOpen(false);
              }}
            >
              {t("deleteColumnModal.cancel")}
            </Button>
            <Button variant='destructive' onClick={handleConfirmDeleteColumn}>
              {t("deleteColumnModal.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
