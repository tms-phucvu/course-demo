import { LocaleSwitcher } from "@/shared/components/locale-switcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center py-4 lg:min-h-screen">
      <div className="absolute right-4 top-4">
        <LocaleSwitcher />
      </div>
      {children}
    </div>
  );
}
