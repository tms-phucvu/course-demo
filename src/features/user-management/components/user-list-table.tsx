"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/core/lib/utils";
import { AddUserModal } from "@/features/user-management/components/add-user-modal";
import { DeleteConfirmModal } from "@/features/user-management/components/delete-confirm-modal";
import { EditUserModal } from "@/features/user-management/components/edit-user-modal";
import { ManagementUser } from "@/features/user-management/types";
import { Pencil, Search, Trash2, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getMockManagementUsers, ROLES, STATUSES } from "../mock/users";

const PER_PAGE = 10;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatCreatedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Build page numbers for pagination: [1, 2, 3, 'ellipsis', 10] etc. */
function getPageNumbers(
  totalPages: number,
  currentPage: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export function UserListTable() {
  const t = useTranslations("userManagement");
  const [users, setUsers] = useState<ManagementUser[]>(() =>
    getMockManagementUsers()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<ManagementUser["role"] | "">("");
  const [filterStatus, setFilterStatus] = useState<
    ManagementUser["status"] | ""
  >("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUser, setEditUser] = useState<ManagementUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<
    { type: "one"; id: string } | { type: "selected" } | null
  >(null);

  const filteredUsers = useMemo(() => {
    let list = users;
    if (filterRole) {
      list = list.filter((u) => u.role === filterRole);
    }
    if (filterStatus) {
      list = list.filter((u) => u.status === filterStatus);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.trim().toLowerCase();
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }, [users, searchQuery, filterRole, filterStatus]);

  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  useEffect(() => {
    setCurrentPage((prev) => {
      if (prev > totalPages) return totalPages;
      return prev;
    });
  }, [totalPages]);

  const startIndex = total === 0 ? 0 : (currentPage - 1) * PER_PAGE;
  const endIndex = Math.min(startIndex + PER_PAGE, total);
  const pageNumbers = getPageNumbers(totalPages, currentPage);
  const pageUsers = useMemo(
    () => filteredUsers.slice(startIndex, endIndex),
    [filteredUsers, startIndex, endIndex]
  );

  const toggleSelected = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const allPageSelected =
    pageUsers.length > 0 && pageUsers.every((u) => selectedIds.has(u.id));
  const handleSelectAllPage = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageUsers.forEach((u) => next.delete(u.id));
      } else {
        pageUsers.forEach((u) => next.add(u.id));
      }
      return next;
    });
  }, [allPageSelected, pageUsers]);

  const handleDeleteSelected = useCallback(() => {
    setDeleteConfirm({ type: "selected" });
  }, []);

  const handleDeleteOne = useCallback((id: string) => {
    setDeleteConfirm({ type: "one", id });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "one") {
      setUsers((prev) => prev.filter((u) => u.id !== deleteConfirm.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteConfirm.id);
        return next;
      });
    } else {
      setUsers((prev) => prev.filter((u) => !selectedIds.has(u.id)));
      setSelectedIds(new Set());
    }
    setDeleteConfirm(null);
    toast.success(t("deleteSuccess"));
  }, [deleteConfirm, selectedIds, t]);

  const handleEditSave = useCallback(
    (updatedUser: ManagementUser) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setEditUser(null);
      toast.success(t("editUserModal.saved"));
    },
    [t]
  );

  const handleAddUserSuccess = useCallback(
    (user: ManagementUser) => {
      setUsers((prev) => [user, ...prev]);
      toast.success(t("addUser.created"));
    },
    [t]
  );

  const selectedCount = selectedIds.size;

  return (
    <div className='UserListTable flex w-full flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='relative max-w-sm min-w-[200px] flex-1'>
            <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
            <Input
              type='search'
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9'
              aria-label={t("searchPlaceholder")}
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) =>
              setFilterRole(
                (e.target.value || "") as ManagementUser["role"] | ""
              )
            }
            aria-label={t("filterRoleLabel")}
            className={cn(
              "border-input flex h-9 min-w-[120px] rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
              "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value=''>{t("filterAll")}</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {t(`role_${role.toLocaleLowerCase()}`)}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                (e.target.value || "") as ManagementUser["status"] | ""
              )
            }
            aria-label={t("filterStatusLabel")}
            className={cn(
              "border-input flex h-9 min-w-[140px] rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
              "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value=''>{t("filterAll")}</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`status_${status}`)}
              </option>
            ))}
          </select>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Button
            variant='default'
            size='sm'
            onClick={() => setAddUserOpen(true)}
            aria-label={t("addUser.addUser")}
          >
            <UserPlus className='size-4 shrink-0' aria-hidden />
            {t("addUser.addUser")}
          </Button>
          <Button
            variant='destructive'
            size='sm'
            disabled={selectedCount === 0}
            onClick={handleDeleteSelected}
            aria-label={t("deleteSelected")}
          >
            <Trash2 className='size-4 shrink-0' aria-hidden />
            {t("deleteSelected")}{" "}
            {selectedCount > 0 ? `(${selectedCount})` : ""}
          </Button>
        </div>
      </div>

      <div className='overflow-x-auto rounded-md border'>
        <Table className='min-w-[900px]'>
          <TableHeader>
            <TableRow>
              <TableHead
                className='bg-background group-hover:bg-muted/50 sticky left-0 z-20 w-[3.25rem] min-w-[3.25rem] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'
                aria-label={t("selectAll")}
              >
                <Checkbox
                  checked={allPageSelected}
                  onCheckedChange={() => handleSelectAllPage()}
                  aria-label={t("selectAll")}
                />
              </TableHead>
              <TableHead className='bg-background group-hover:bg-muted/50 sticky left-[3.25rem] z-10 min-w-[220px] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
                {t("name")}
              </TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead className='bg-background group-hover:bg-muted/50 sticky right-0 z-10 w-24 min-w-24 text-right shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
                <span className='sr-only'>{t("actions")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='text-muted-foreground py-8 text-center'
                >
                  {t("empty")}
                </TableCell>
              </TableRow>
            ) : (
              pageUsers.map((user) => (
                <TableRow key={user.id} className='group'>
                  <TableCell className='bg-background group-hover:bg-muted/50 sticky left-0 z-20 w-[3.25rem] min-w-[3.25rem] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
                    <Checkbox
                      checked={selectedIds.has(user.id)}
                      onCheckedChange={(checked) =>
                        toggleSelected(user.id, checked === true)
                      }
                      aria-label={t("selectUser", { name: user.name })}
                    />
                  </TableCell>
                  <TableCell className='bg-background group-hover:bg-muted/50 sticky left-[3.25rem] z-10 min-w-[220px] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='size-9 shrink-0'>
                        <AvatarImage src={user.avatarUrl ?? undefined} alt='' />
                        <AvatarFallback className='text-xs'>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='font-medium'>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className='text-muted-foreground tabular-nums'>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {t(`role_${user.role.toLocaleLowerCase()}`)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        user.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      )}
                      role='status'
                    >
                      {t(`status_${user.status}`)}
                    </span>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {formatCreatedAt(user.createdAt)}
                  </TableCell>
                  <TableCell className='bg-background group-hover:bg-muted/50 sticky right-0 z-10 w-24 min-w-24 text-right shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8'
                        onClick={() => setEditUser(user)}
                        aria-label={t("editUser", { name: user.name })}
                      >
                        <Pencil className='size-4' aria-hidden />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-destructive hover:text-destructive size-8'
                        onClick={() => handleDeleteOne(user.id)}
                        aria-label={t("deleteUser", { name: user.name })}
                      >
                        <Trash2 className='size-4' aria-hidden />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {total > 0 && (
        <div className='border-t pt-4'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <p className='text-muted-foreground text-sm'>
              {t("paginationLabel", {
                start: startIndex + 1,
                end: endIndex,
                total,
              })}
            </p>
            <Pagination className='mx-0 w-auto'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  >
                    {t("previous")}
                  </PaginationPrevious>
                </PaginationItem>
                {pageNumbers.map((page, i) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href='#'
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        aria-label={t("pageNumber", { page })}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  >
                    {t("next")}
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      <AddUserModal
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onSuccess={handleAddUserSuccess}
      />

      <EditUserModal
        open={editUser !== null}
        onOpenChange={(open) => !open && setEditUser(null)}
        user={editUser}
        onSave={handleEditSave}
      />

      <DeleteConfirmModal
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title={
          deleteConfirm?.type === "one"
            ? t("deleteConfirm.titleOne")
            : t("deleteConfirm.titleSelected")
        }
        description={
          deleteConfirm?.type === "one"
            ? t("deleteConfirm.descriptionOne", {
                name: users.find((u) => u.id === deleteConfirm.id)?.name ?? "",
              })
            : t("deleteConfirm.descriptionSelected", {
                count: selectedCount,
              })
        }
        cancelLabel={t("deleteConfirm.cancel")}
        confirmLabel={t("deleteConfirm.confirm")}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
