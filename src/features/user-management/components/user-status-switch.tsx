import { Switch } from "@/components/ui/switch";
import { useUpdateUserStatus } from "@/features/user-management/hooks/use-update-user-status";
import { UserStatus } from "@/features/user-management/types/user.types";
import { toast } from "sonner";

interface UserStatusSwitchProps {
  id: string;
  isActive: boolean;
}

export default function UserStatusSwitch({
  id,
  isActive,
}: UserStatusSwitchProps) {
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();
  const handleChange = (checked: boolean) => {
    updateStatus(
      {
        id,
        data: { status: checked ? UserStatus.ACTIVE : UserStatus.INACTIVE },
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
  };

  return (
    <Switch
      checked={isActive}
      disabled={isPending}
      onCheckedChange={handleChange}
      className='data-[state=unchecked]:bg-muted-foreground data-[state=checked]:bg-emerald-500'
    />
  );
}
