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
import { AddUserModal } from "@/features/user-management/components/add-user-modal";
import { DeleteConfirmModal } from "@/features/user-management/components/delete-confirm-modal";
import { EditUserModal } from "@/features/user-management/components/edit-user-modal";
import UserStatusSwitch from "@/features/user-management/components/user-status-switch";
import { useCreateUser } from "@/features/user-management/hooks/use-create-user";
import { useDeleteManyUsers } from "@/features/user-management/hooks/use-delete-many-users";
import { useDeleteUser } from "@/features/user-management/hooks/use-delete-user";
import { useUpdateUser } from "@/features/user-management/hooks/use-update-user";
import { useUsers } from "@/features/user-management/hooks/use-users";
import {
  formatCreatedAt,
  getInitials,
  getPageNumbers,
} from "@/features/user-management/lib/user.util";
import {
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UserStatus,
} from "@/features/user-management/types/user.types";
import { Pencil, Search, Trash2, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PER_PAGE = 10;

export function UserListTable() {
  const t = useTranslations("userManagement");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<
    { type: "one"; id: string } | { type: "selected" } | null
  >(null);

  const usersQuery = useUsers({
    page: currentPage,
    limit: PER_PAGE,
    name: searchQuery.trim(),
  });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const deleteManyUsersMutation = useDeleteManyUsers();

  const pageUsers = useMemo(
    () => usersQuery.data?.items ?? [],
    [usersQuery.data?.items]
  );
  const total = usersQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const startIndex = total === 0 ? 0 : (currentPage - 1) * PER_PAGE;
  const endIndex = Math.min(startIndex + PER_PAGE, total);
  const pageNumbers = getPageNumbers(totalPages, currentPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

    const closeModal = () => {
      setDeleteConfirm(null);
    };

    if (deleteConfirm.type === "one") {
      deleteUserMutation.mutate(deleteConfirm.id, {
        onSuccess: () => {
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(deleteConfirm.id);
            return next;
          });
          toast.success(t("deleteSuccess"));
        },
        onError: (error: Error) => {
          toast.error(error.message || t("deleteFailed"));
        },
      });

      closeModal();
      return;
    }

    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0) {
      closeModal();
      return;
    }

    deleteManyUsersMutation.mutate(idsToDelete, {
      onSuccess: () => {
        setSelectedIds(new Set());
        toast.success(t("deleteSuccess"));
      },
      onError: (error: Error) => {
        toast.error(error.message || t("deleteFailed"));
      },
    });

    closeModal();
  }, [
    deleteConfirm,
    selectedIds,
    deleteUserMutation,
    deleteManyUsersMutation,
    t,
  ]);

  const handleEditSave = useCallback(
    ({ id, updatedUser }: { id: string; updatedUser: UpdateUserPayload }) => {
      updateUserMutation.mutate(
        {
          id,
          data: updatedUser,
        },
        {
          onSuccess: () => {
            setEditUser(null);
            toast.success(t("editUserModal.saved"));
          },
          onError: (error: Error) => {
            toast.error(error.message || t("editUserModal.saveFailed"));
          },
        }
      );
    },
    [updateUserMutation, t]
  );

  const handleAddUserSuccess = useCallback(
    (user: CreateUserPayload) => {
      createUserMutation.mutate(user, {
        onSuccess: () => {
          setAddUserOpen(false);
          toast.success(t("addUser.created"));
        },
        onError: (error: Error) => {
          toast.error(error.message || t("addUser.createFailed"));
        },
      });
    },
    [createUserMutation, t]
  );

  const selectedCount = selectedIds.size;

  return (
    <div className='UserListTable flex w-full flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='relative max-w-lg min-w-50 flex-1'>
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
        <Table className='min-w-225'>
          <TableHeader>
            <TableRow>
              <TableHead
                className='bg-background group-hover:bg-muted/50 sticky left-0 z-20 w-13 min-w-13 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'
                aria-label={t("selectAll")}
              >
                <Checkbox
                  checked={allPageSelected}
                  onCheckedChange={() => handleSelectAllPage()}
                  aria-label={t("selectAll")}
                />
              </TableHead>
              <TableHead className='bg-background group-hover:bg-muted/50 sticky left-13 z-10 min-w-55 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
                {t("name")}
              </TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead>{t("activeStatus")}</TableHead>
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
                  <TableCell className='bg-background group-hover:bg-muted/50 sticky left-0 z-20 w-13 min-w-13 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
                    <Checkbox
                      checked={selectedIds.has(user.id)}
                      onCheckedChange={(checked) =>
                        toggleSelected(user.id, checked === true)
                      }
                      aria-label={t("selectUser", { name: user.name })}
                    />
                  </TableCell>
                  <TableCell className='bg-background group-hover:bg-muted/50 sticky left-13 z-10 min-w-55 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
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
                  <TableCell className='text-muted-foreground'>
                    {formatCreatedAt(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <UserStatusSwitch
                      id={user.id}
                      isActive={user.status === UserStatus.ACTIVE}
                      userName={user.name}
                    />
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
                name:
                  pageUsers.find((u) => u.id === deleteConfirm.id)?.name ?? "",
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
