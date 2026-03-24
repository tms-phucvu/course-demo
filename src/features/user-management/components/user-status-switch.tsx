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
import { Switch } from "@/components/ui/switch";
import { useUpdateUserStatus } from "@/features/user-management/hooks/use-update-user-status";
import { UserStatus } from "@/features/user-management/types/user.types";
import { useState } from "react";
import { toast } from "sonner";

interface UserStatusSwitchProps {
  id: string;
  isActive: boolean;
  userName: string;
}

export default function UserStatusSwitch({
  id,
  isActive,
  userName,
}: UserStatusSwitchProps) {
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();
  const [open, setOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);

  const handleChange = (checked: boolean) => {
    setPendingStatus(checked);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (pendingStatus === null) return;

    updateStatus(
      {
        id,
        data: {
          status: pendingStatus ? UserStatus.ACTIVE : UserStatus.INACTIVE,
        },
      },
      {
        onSuccess: () => {
          toast.success("User status updated successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update user status");
        },
      }
    );
    setOpen(false);
  };

  return (
    <>
      <Switch
        checked={isActive}
        disabled={isPending}
        onCheckedChange={handleChange}
        className='data-[state=unchecked]:bg-muted-foreground data-[state=checked]:bg-emerald-500'
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className='gap-3'>
            <DialogTitle>Confirm status change</DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {pendingStatus ? "activate" : "inactivate"} the user{" "}
              {<span className='font-bold'>{userName}</span>}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
