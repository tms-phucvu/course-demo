import { LucideIcon } from "lucide-react";

interface MetaItemProps {
  icon: LucideIcon;
  value: string | number;
  label?: string;
}

export function MetaItem({ icon: Icon, value, label }: MetaItemProps) {
  return (
    <div className='flex items-center gap-1.5'>
      <Icon className='h-4 w-4' />
      <span>
        {value}
        {label && ` ${label}`}
      </span>
    </div>
  );
}
