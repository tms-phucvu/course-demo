"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { KanbanColumn } from "@/features/kanban/types";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, "Column name is required"),
});

type FormData = z.infer<typeof schema>;

interface EditColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  column: KanbanColumn | null;
  onSubmit: (columnId: string, name: string) => void;
}

export function EditColumnModal({
  open,
  onOpenChange,
  column,
  onSubmit,
}: EditColumnModalProps) {
  const t = useTranslations("kanban.editColumnModal");
  const tColumn = useTranslations("kanban");
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (open && column) {
      const displayName =
        column.name ?? (column.titleKey ? tColumn(column.titleKey) : "");
      form.reset({ name: displayName });
    }
  }, [open, column, form, tColumn]);

  const handleSubmit = form.handleSubmit((data) => {
    if (column) {
      onSubmit(column.id, data.name);
      form.reset();
      onOpenChange(false);
    }
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset();
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='edit-column-modal sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nameLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("namePlaceholder")}
                      autoComplete='off'
                      {...field}
                    />
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
              <Button type='submit'>{t("save")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
