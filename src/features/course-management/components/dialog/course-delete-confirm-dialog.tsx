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

interface CourseDeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDeletingSelected: boolean;
  selectedCount: number;
  deletingCourseTitle: string;
  onConfirm: () => void;
}

export function CourseDeleteConfirmDialog({
  open,
  onOpenChange,
  isDeletingSelected,
  selectedCount,
  deletingCourseTitle,
  onConfirm,
}: CourseDeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm delete</DialogTitle>
          <DialogDescription>
            {isDeletingSelected ? (
              <>
                {`You are about to delete ${selectedCount} course
                ${selectedCount === 1 ? "" : "s"}. This action cannot be undone.`}
              </>
            ) : (
              <>
                {`Are you sure you want to delete "${deletingCourseTitle}"? This
                action cannot be undone.`}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
