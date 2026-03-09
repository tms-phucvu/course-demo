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
import type { Priority } from "@/features/kanban/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AssigneesMultiSelect } from "./assignees-multi-select";
import { TaskAttachmentUpload } from "./task-attachment-upload";
import { TaskChecklist } from "./task-checklist";
import { TiptapDescriptionEditor } from "./tiptap-description-editor";

const PRIORITIES: Priority[] = ["high", "medium", "low"];

const addTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  assignees: z.array(z.string()),
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

export type AddTaskFormData = z.infer<typeof addTaskSchema>;

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddTaskFormData) => void;
}

export function AddTaskModal({
  open,
  onOpenChange,
  onSubmit,
}: AddTaskModalProps) {
  const t = useTranslations("kanban.addTaskModal");
  const tPriority = useTranslations("kanban.priority");
  const form = useForm<AddTaskFormData>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assignees: [],
      dueDate: null,
      checklist: [],
      attachments: [],
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset();
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='add-task-modal flex h-[80vh] max-h-[95vh] w-[70vw] max-w-[70vw] flex-col gap-4 overflow-hidden p-6'>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
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
                  <FormLabel>{t("attachmentsLabel")}</FormLabel>
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
              <Button type='submit'>{t("create")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
