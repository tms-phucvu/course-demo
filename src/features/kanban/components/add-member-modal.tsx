"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { cn } from "@/core/lib/utils";

const ROLES = ["admin", "employee", "guest"] as const;
export type AddMemberRole = (typeof ROLES)[number];

const addMemberSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  role: z.enum(ROLES, { required_error: "Role is required" }),
});

export type AddMemberFormData = z.infer<typeof addMemberSchema>;

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddMemberFormData) => void;
}

export function AddMemberModal({
  open,
  onOpenChange,
  onSubmit,
}: AddMemberModalProps) {
  const t = useTranslations("kanban.addMemberModal");
  const form = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { email: "", role: "guest" },
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
      <DialogContent className='add-member-modal sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("emailLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder={t("emailPlaceholder")}
                      autoComplete='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("roleLabel")}</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className={cn(
                        "border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                      )}
                      aria-label={t("roleLabel")}
                    >
                      <option value='admin'>{t("roleAdmin")}</option>
                      <option value='employee'>{t("roleEmployee")}</option>
                      <option value='guest'>{t("roleGuest")}</option>
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
              <Button type='submit'>{t("submit")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
