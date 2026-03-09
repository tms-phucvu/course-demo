"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/core/lib/utils";
import {
  BOOKING_GRID_HOURS,
  MOCK_BOOKING_GRID_ROOMS,
} from "@/features/hotel/mock/booking-grid-data";
import type { BookingGridRoom } from "@/features/hotel/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const newBookingSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    date: z.string().min(1, "Date is required"),
    room: z.string().min(1, "Room is required"),
    timeSlot: z.string().optional(),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    phone: z.string().optional(),
    status: z.enum(["pending", "paid", "partial"]).optional(),
  })
  .refine(
    (data) => {
      const [sh, sm] = data.startTime.split(":").map(Number);
      const [eh, em] = data.endTime.split(":").map(Number);
      const startM = (sh ?? 0) * 60 + (sm ?? 0);
      const endM = (eh ?? 0) * 60 + (em ?? 0);
      return endM > startM;
    },
    { message: "End time must be after start time.", path: ["endTime"] }
  );

export type NewBookingFormValues = z.infer<typeof newBookingSchema>;

export interface NewBookingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRoomId?: string | null;
  defaultStartTime?: string | null;
  defaultDate?: Date | null;
  /** Return true to close sheet and reset form, false to keep sheet open (e.g. validation failed). */
  onSave?: (values: NewBookingFormValues) => boolean | Promise<boolean>;
}

const selectClassName = cn(
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors",
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive"
);

export function NewBookingSheet({
  open,
  onOpenChange,
  defaultRoomId,
  defaultStartTime,
  defaultDate,
  onSave,
}: NewBookingSheetProps) {
  const t = useTranslations("hotel.booking");

  const form = useForm<NewBookingFormValues>({
    resolver: zodResolver(newBookingSchema),
    defaultValues: {
      name: "",
      date: "",
      room: "",
      timeSlot: "",
      startTime: "",
      endTime: "",
      phone: "",
      status: "pending",
    },
  });

  useEffect(() => {
    if (!open) return;
    const dateStr = defaultDate
      ? `${defaultDate.getFullYear()}-${String(defaultDate.getMonth() + 1).padStart(2, "0")}-${String(defaultDate.getDate()).padStart(2, "0")}`
      : "";
    form.reset({
      name: "",
      date: dateStr,
      room: defaultRoomId ?? "",
      timeSlot: "",
      startTime: defaultStartTime ?? "",
      endTime: "",
      phone: "",
      status: "pending",
    });
  }, [open, defaultRoomId, defaultStartTime, defaultDate, form]);

  const handleSubmit = async (values: NewBookingFormValues) => {
    const ok = await Promise.resolve(onSave?.(values) ?? true);
    if (ok) {
      onOpenChange(false);
      form.reset();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='NewBookingSheet flex w-full flex-col sm:max-w-md'
      >
        <SheetHeader className='text-left'>
          <SheetTitle>{t("newBookingTitle")}</SheetTitle>
          <SheetDescription>{t("newBookingDescription")}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex flex-1 flex-col gap-4 overflow-auto px-2 py-6'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("formName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholderName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("formDate")}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input type='date' {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='room'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("formRoom")}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <select
                        className={selectClassName}
                        aria-invalid={!!form.formState.errors.room}
                        {...field}
                      >
                        <option value=''>{t("placeholderRoom")}</option>
                        {MOCK_BOOKING_GRID_ROOMS.map(
                          (room: BookingGridRoom) => (
                            <option key={room.id} value={room.id}>
                              {room.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='timeSlot'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("formTimeSlot")}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <select
                        className={selectClassName}
                        {...field}
                        value={field.value ?? ""}
                      >
                        <option value=''>{t("placeholderTimeSlot")}</option>
                        <option value='1'>1 hour</option>
                        <option value='2'>2 hours</option>
                        <option value='3'>3 hours</option>
                      </select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='startTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("formStartTime")}</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <select
                          className={selectClassName}
                          aria-invalid={!!form.formState.errors.startTime}
                          {...field}
                        >
                          <option value=''>{t("placeholderStart")}</option>
                          {BOOKING_GRID_HOURS.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("formEndTime")}</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <select
                          className={selectClassName}
                          aria-invalid={!!form.formState.errors.endTime}
                          {...field}
                        >
                          <option value=''>{t("placeholderEnd")}</option>
                          {BOOKING_GRID_HOURS.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("formPhone")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholderPhone")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("formStatus")}</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <select
                        className={selectClassName}
                        {...field}
                        value={field.value ?? ""}
                      >
                        <option value=''>{t("placeholderStatus")}</option>
                        <option value='pending'>{t("paymentPending")}</option>
                        <option value='paid'>{t("paymentPaid")}</option>
                        <option value='partial'>{t("paymentPartial")}</option>
                      </select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className='mt-auto gap-2 sm:gap-0'>
              <Button type='button' variant='outline' onClick={handleCancel}>
                {t("cancel")}
              </Button>
              <Button
                type='submit'
                className='bg-black hover:bg-black/90 dark:bg-black dark:hover:bg-black/90'
              >
                {t("save")}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
