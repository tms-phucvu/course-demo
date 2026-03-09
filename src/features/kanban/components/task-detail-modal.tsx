"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/core/lib/utils";
import { MOCK_BOARD_MEMBERS } from "@/features/kanban/mock/board-members";
import type { KanbanTask, Priority } from "@/features/kanban/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AssigneesMultiSelect } from "./assignees-multi-select";
import { TaskAttachmentUpload } from "./task-attachment-upload";
import { TaskChecklist } from "./task-checklist";
import { TiptapDescriptionEditor } from "./tiptap-description-editor";

const PRIORITIES: Priority[] = ["high", "medium", "low"];

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  assignees: z.array(z.string()),
  createdAt: z.string(),
  dueDate: z.string().nullable(),
  checklist: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      checked: z.boolean(),
    })
  ),
  attachments: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      type: z.enum(["image", "file"]),
    })
  ),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

function taskToFormData(task: KanbanTask): TaskFormData {
  return {
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    assignees: task.assignees ?? [],
    createdAt: task.createdAt ?? new Date().toISOString(),
    dueDate: task.dueDate ?? null,
    checklist: task.checklist ?? [],
    attachments: task.attachments ?? [],
  };
}

function formDataToTask(
  data: TaskFormData,
  taskId: string,
  columnId: string
): KanbanTask {
  const checkedCount = data.checklist.filter((i) => i.checked).length;
  const progress =
    data.checklist.length > 0
      ? Math.round((checkedCount / data.checklist.length) * 100)
      : 0;
  const attachments = data.attachments ?? [];
  return {
    id: taskId,
    title: data.title,
    description: data.description,
    columnId,
    priority: data.priority,
    progress,
    assignees: data.assignees,
    checklist: data.checklist,
    createdAt: data.createdAt,
    dueDate: data.dueDate,
    attachments,
    attachmentsCount: attachments.length,
    commentsCount: 0,
  };
}

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: KanbanTask | null;
  onSave: (task: KanbanTask) => void;
}

export function TaskDetailModal({
  open,
  onOpenChange,
  task,
  onSave,
}: TaskDetailModalProps) {
  const t = useTranslations("kanban.addTaskModal");
  const tDetail = useTranslations("kanban.taskDetailModal");
  const tPriority = useTranslations("kanban.priority");
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: taskToFormData({
      id: "",
      title: "",
      description: "",
      columnId: "",
      priority: "medium",
      progress: 0,
      assignees: [],
      checklist: [],
      createdAt: new Date().toISOString(),
      dueDate: null,
      attachments: [],
      attachmentsCount: 0,
      commentsCount: 0,
    }),
  });

  useEffect(() => {
    if (open && task) {
      form.reset(taskToFormData(task));
    }
  }, [open, task, form]);

  const handleSubmit = form.handleSubmit((data) => {
    if (!task) return;
    const updated = formDataToTask(data, task.id, task.columnId);
    updated.commentsCount = task.commentsCount;
    onSave(updated);
    onOpenChange(false);
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) onOpenChange(false);
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='add-task-modal flex h-[80vh] max-h-[95vh] w-[70vw] max-w-[70vw] flex-col gap-4 overflow-hidden p-6'>
        <DialogHeader>
          <DialogTitle>{tDetail("title")}</DialogTitle>
          <DialogDescription>{tDetail("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className='flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("titleLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("titlePlaceholder")}
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='checklist'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TaskChecklist
                      value={field.value}
                      onChange={field.onChange}
                      title={t("checklistLabel")}
                      hideCheckedLabel={t("checklistHideChecked")}
                      deleteLabel={t("checklistDelete")}
                      addPlaceholder={t("checklistAddPlaceholder")}
                      addLabel={t("checklistAdd")}
                      cancelLabel={t("cancel")}
                      assignLabel={t("checklistAssign")}
                      dueDateLabel={t("checklistDueDate")}
                      noItemsLabel={t("checklistNoItems")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("descriptionLabel")}</FormLabel>
                  <FormControl>
                    <TiptapDescriptionEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t("descriptionPlaceholder")}
                      syncContent={open}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='assignees'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("assigneesLabel")}</FormLabel>
                  <FormControl>
                    <AssigneesMultiSelect
                      value={field.value}
                      onChange={field.onChange}
                      members={MOCK_BOARD_MEMBERS}
                      placeholder={t("assigneesPlaceholder")}
                      searchPlaceholder={t("assigneesSearchPlaceholder")}
                      label={t("assigneesLabel")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='createdAt'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tDetail("createdLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      value={
                        field.value
                          ? new Date(field.value).toLocaleDateString(
                              undefined,
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : ""
                      }
                      readOnly
                      disabled
                      aria-label={tDetail("createdLabel")}
                      className='bg-muted max-w-[200px]'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dueDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dueDateLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      aria-label={t("dueDateLabel")}
                      className='max-w-[200px]'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='attachments'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TaskAttachmentUpload
                      value={field.value}
                      onChange={field.onChange}
                      label={t("attachmentsLabel")}
                      dropzoneLabel={t("attachmentsDropzoneLabel")}
                      dropzoneHint={t("attachmentsDropzoneHint")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("priorityLabel")}</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className={cn(
                        "border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                      )}
                      aria-label={t("priorityLabel")}
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {tPriority(p)}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleOpenChange(false)}
              >
                {t("cancel")}
              </Button>
              <Button type='submit'>{tDetail("save")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
