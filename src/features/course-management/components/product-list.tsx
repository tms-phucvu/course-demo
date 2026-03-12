// "use client";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { cn } from "@/core/lib/utils";
// import { AddProductModal } from "@/features/product/components/modal/add-product-modal";
// import { DeleteProductConfirmModal } from "@/features/product/components/modal/delete-product-confirm-modal";
// import { EditProductModal } from "@/features/product/components/modal/edit-product-modal";
// import {
//   CATEGORIES,
//   PER_PAGE,
//   SORT_OPTIONS,
//   STATUSES,
// } from "@/features/product/constants/product.constants";
// import { PRODUCTS } from "@/features/product/mock/products";
// import type {
//   Category,
//   IProduct,
//   ProductStatus,
//   SortOption,
// } from "@/features/product/types/product.types";
// import {
//   formatDate,
//   formatPrice,
//   getPageNumbers,
// } from "@/features/product/utils/product.utils";
// import { PackagePlus, Pencil, Search, Trash2 } from "lucide-react";
// import { useLocale, useTranslations } from "next-intl";
// import Image from "next/image";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { toast } from "sonner";

// export function ProductList() {
//   const t = useTranslations("product.list");
//   const locale = useLocale();
//   const [products, setProducts] = useState<IProduct[]>(() => PRODUCTS);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterCategory, setFilterCategory] = useState<Category | "">("");
//   const [filterStatus, setFilterStatus] = useState<ProductStatus | "">("");
//   const [sortBy, setSortBy] = useState<SortOption>("default");
//   const [addOpen, setAddOpen] = useState(false);
//   const [editProduct, setEditProduct] = useState<IProduct | null>(null);
//   const [deleteConfirm, setDeleteConfirm] = useState<
//     { type: "one"; id: string } | { type: "selected" } | null
//   >(null);

//   const filteredProducts = useMemo(() => {
//     let list = [...products];
//     if (filterCategory) {
//       list = list.filter((p) => p.category === filterCategory);
//     }
//     if (filterStatus) {
//       list = list.filter((p) => p.status === filterStatus);
//     }
//     if (searchQuery.trim()) {
//       const q = searchQuery.trim().toLowerCase();
//       list = list.filter((p) => {
//         return (
//           p.id.toLowerCase().includes(q) ||
//           p.product_name.toLowerCase().includes(q) ||
//           p.sku.toLowerCase().includes(q) ||
//           p.category.toLowerCase().includes(q) ||
//           p.status.toLowerCase().includes(q)
//         );
//       });
//     }

//     switch (sortBy) {
//       case "priceAsc":
//         list.sort((a, b) => a.price - b.price);
//         break;
//       case "priceDesc":
//         list.sort((a, b) => b.price - a.price);
//         break;
//       case "stockAsc":
//         list.sort((a, b) => a.stock - b.stock);
//         break;
//       case "stockDesc":
//         list.sort((a, b) => b.stock - a.stock);
//         break;
//       default:
//         break;
//     }
//     return list;
//   }, [products, searchQuery, filterCategory, filterStatus, sortBy]);

//   const total = filteredProducts.length;
//   const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

//   useEffect(() => {
//     setCurrentPage((prev) => {
//       if (prev > totalPages) return totalPages;
//       return prev;
//     });
//   }, [totalPages]);

//   const startIndex = total === 0 ? 0 : (currentPage - 1) * PER_PAGE;
//   const endIndex = Math.min(startIndex + PER_PAGE, total);
//   const pageNumbers = getPageNumbers(totalPages, currentPage);
//   const pageProducts = useMemo(
//     () => filteredProducts.slice(startIndex, endIndex),
//     [filteredProducts, startIndex, endIndex]
//   );

//   const toggleSelected = useCallback((id: string, checked: boolean) => {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       if (checked) next.add(id);
//       else next.delete(id);
//       return next;
//     });
//   }, []);

//   const allPageSelected =
//     pageProducts.length > 0 && pageProducts.every((p) => selectedIds.has(p.id));
//   const handleSelectAllPage = useCallback(() => {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       if (allPageSelected) {
//         pageProducts.forEach((p) => next.delete(p.id));
//       } else {
//         pageProducts.forEach((p) => next.add(p.id));
//       }
//       return next;
//     });
//   }, [allPageSelected, pageProducts]);

//   const selectedProduct =
//     deleteConfirm?.type === "one"
//       ? (products.find((p) => p.id === deleteConfirm.id)?.product_name ?? "")
//       : "";
//   const selectedCount = selectedIds.size;

//   const openDeleteSelected = useCallback(() => {
//     if (selectedCount === 0) return;
//     setDeleteConfirm({ type: "selected" });
//   }, [selectedCount]);

//   const openDeleteOne = useCallback((id: string) => {
//     setDeleteConfirm({ type: "one", id });
//   }, []);

//   const handleConfirmDelete = useCallback(async () => {
//     if (!deleteConfirm) return;

//     if (deleteConfirm.type === "one") {
//       setProducts((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
//       setSelectedIds((prev) => {
//         const next = new Set(prev);
//         next.delete(deleteConfirm.id);
//         return next;
//       });
//       const deleted = products.find((p) => p.id === deleteConfirm.id);
//       if (deleted) {
//         toast.success(t("toast.deletedOne", { name: deleted.product_name }));
//       }
//     } else {
//       const count = selectedIds.size;
//       if (count === 0) return;
//       setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
//       setSelectedIds(new Set());
//       toast.success(t("toast.deletedMany", { count }));
//     }
//     setDeleteConfirm(null);
//   }, [deleteConfirm, products, selectedIds, t]);

//   const handleAddSuccess = useCallback(
//     (product: IProduct) => {
//       setProducts((prev) => [product, ...prev]);
//       toast.success(t("toast.created", { name: product.product_name }));
//     },
//     [t]
//   );

//   const handleEditSave = useCallback(
//     (updated: IProduct) => {
//       setProducts((prev) =>
//         prev.map((p) => (p.id === updated.id ? updated : p))
//       );
//       toast.success(t("toast.updated", { name: updated.product_name }));
//       setEditProduct(null);
//     },
//     [t]
//   );

//   return (
//     <div className='ProductList flex w-full flex-col gap-4'>
//       <div className='flex flex-wrap items-center justify-between gap-2'>
//         <div className='flex flex-wrap items-center gap-2'>
//           <div className='relative max-w-lg min-w-50 flex-1'>
//             <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
//             <Input
//               type='search'
//               placeholder={t("searchPlaceholder")}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className='pl-9'
//               aria-label={t("searchProducts")}
//             />
//           </div>

//           <select
//             value={filterCategory}
//             onChange={(e) =>
//               setFilterCategory((e.target.value || "") as Category | "")
//             }
//             aria-label='Filter by category'
//             className={cn(
//               "border-input flex h-9 min-w-40 rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
//               "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
//               "disabled:cursor-not-allowed disabled:opacity-50"
//             )}
//           >
//             <option value=''>{t("category.allCategories")}</option>
//             {CATEGORIES.map((cat) => (
//               <option key={cat} value={cat}>
//                 {t(`category.${cat}`)}
//               </option>
//             ))}
//           </select>

//           <select
//             value={filterStatus}
//             onChange={(e) =>
//               setFilterStatus((e.target.value || "") as ProductStatus | "")
//             }
//             aria-label='Filter by status'
// className={cn(
//   "border-input flex h-9 min-w-35 rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
//   "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
//   "disabled:cursor-not-allowed disabled:opacity-50"
// )}
//           >
//             <option value=''>{t("status.allStatuses")}</option>
//             {STATUSES.map((status) => (
//               <option key={status} value={status}>
//                 {t(`status.${status}`)}
//               </option>
//             ))}
//           </select>

//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value as SortOption)}
//             aria-label='Sort products'
//             className={cn(
//               "border-input bg-background flex h-9 min-w-45 rounded-md border px-3 py-1 text-sm shadow-sm transition-colors",
//               "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
//               "disabled:cursor-not-allowed disabled:opacity-50"
//             )}
//           >
//             {SORT_OPTIONS.map((opt) => (
//               <option key={opt} value={opt}>
//                 {t(`sort.${opt}`)}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className='flex flex-wrap items-center gap-2'>
//           <Button
//             variant='default'
//             size='sm'
//             onClick={() => setAddOpen(true)}
//             aria-label='Add new product'
//           >
//             <PackagePlus className='size-4 shrink-0' aria-hidden />
//             {t("actions.addProduct")}
//           </Button>
//           <Button
//             variant='destructive'
//             size='sm'
//             disabled={selectedCount === 0}
//             onClick={openDeleteSelected}
//             aria-label='Delete selected products'
//           >
//             <Trash2 className='size-4 shrink-0' aria-hidden />
//             {t("actions.deleteSelected", { count: selectedCount })}
//           </Button>
//         </div>
//       </div>

//       <div className='overflow-x-auto rounded-md border'>
//         <Table className='min-w-245'>
//           <TableHeader>
//             <TableRow>
//               <TableHead
//                 className='bg-background group-hover:bg-muted/50 sticky left-0 z-20 w-13 min-w-13 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'
//                 aria-label='Select all on page'
//               >
//                 <Checkbox
//                   checked={allPageSelected}
//                   onCheckedChange={() => handleSelectAllPage()}
//                   aria-label='Select all on page'
//                 />
//               </TableHead>
//               <TableHead className='bg-background group-hover:bg-muted/50 sticky left-13 z-10 min-w-70 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
//                 {t("table.product")}
//               </TableHead>
//               <TableHead>{t("table.sku")}</TableHead>
//               <TableHead>{t("table.category")}</TableHead>
//               <TableHead className='text-right'>{t("table.price")}</TableHead>
//               <TableHead className='text-right'>{t("table.stock")}</TableHead>
//               <TableHead>{t("table.status")}</TableHead>
//               <TableHead>{t("table.created")}</TableHead>
//               <TableHead className='bg-background group-hover:bg-muted/50 sticky right-0 z-10 w-24 min-w-24 text-right shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
//                 <span className='sr-only'>Actions</span>
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {pageProducts.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={9}
//                   className='text-muted-foreground py-8 text-center'
//                 >
//                   {t("empty")}
//                 </TableCell>
//               </TableRow>
//             ) : (
//               pageProducts.map((product) => (
//                 <TableRow key={product.id} className='group'>
//                   <TableCell className='bg-background group-hover:bg-muted/50 sticky left-0 z-20 w-[3.25rem] min-w-[3.25rem] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
//                     <Checkbox
//                       checked={selectedIds.has(product.id)}
//                       onCheckedChange={(checked) =>
//                         toggleSelected(product.id, checked === true)
//                       }
//                       aria-label={`Select ${product.product_name}`}
//                     />
//                   </TableCell>

//                   <TableCell className='bg-background group-hover:bg-muted/50 sticky left-[3.25rem] z-10 min-w-[280px] shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
//                     <div className='flex items-center gap-3'>
//                       <div className='bg-muted relative size-10 shrink-0 overflow-hidden rounded-md'>
//                         <Image
//                           src={product.thumbnail}
//                           alt={product.product_name}
//                           fill
//                           sizes='40px'
//                           className='object-cover'
//                         />
//                       </div>
//                       <div className='min-w-0'>
//                         <p className='truncate font-medium'>
//                           {product.product_name}
//                         </p>
//                         <p className='text-muted-foreground truncate text-xs'>
//                           ID: {product.id}
//                         </p>
//                       </div>
//                     </div>
//                   </TableCell>

//                   <TableCell className='text-muted-foreground font-mono text-xs'>
//                     {product.sku}
//                   </TableCell>
//                   <TableCell>{t(`category.${product.category}`)}</TableCell>
//                   <TableCell className='text-right tabular-nums'>
//                     {formatPrice(product.price)}
//                   </TableCell>
//                   <TableCell className='text-right tabular-nums'>
//                     <span
//                       className={cn(
//                         product.stock === 0 && "text-destructive font-medium"
//                       )}
//                     >
//                       {product.stock}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <span
//                       className={cn(
//                         "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
//                         product.status === "active" &&
//                           "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
//                         product.status === "inactive" &&
//                           "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
//                       )}
//                       role='status'
//                     >
//                       {t(`status.${product.status}`)}
//                     </span>
//                   </TableCell>
//                   <TableCell className='text-muted-foreground'>
//                     {formatDate({ isoDate: product.created_at, locale })}
//                   </TableCell>
//                   <TableCell className='bg-background group-hover:bg-muted/50 sticky right-0 z-10 w-24 min-w-24 text-right shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]'>
//                     <div className='flex items-center justify-end gap-1'>
//                       <Button
//                         variant='ghost'
//                         size='icon'
//                         className='size-8'
//                         onClick={() => setEditProduct(product)}
//                         aria-label={`Edit ${product.product_name}`}
//                       >
//                         <Pencil className='size-4' aria-hidden />
//                       </Button>
//                       <Button
//                         variant='ghost'
//                         size='icon'
//                         className='text-destructive hover:text-destructive size-8'
//                         onClick={() => openDeleteOne(product.id)}
//                         aria-label={`Delete ${product.product_name}`}
//                       >
//                         <Trash2 className='size-4' aria-hidden />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {total > 0 && (
//         <div className='border-t pt-4'>
//           <div className='flex flex-wrap items-center justify-between gap-4'>
//             <p className='text-muted-foreground text-sm'>
//               {t("pagination.showing", {
//                 start: startIndex + 1,
//                 end: endIndex,
//                 total,
//               })}
//             </p>
//             <Pagination className='mx-0 w-auto'>
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious
//                     href='#'
//                     onClick={(e) => {
//                       e.preventDefault();
//                       if (currentPage > 1) setCurrentPage(currentPage - 1);
//                     }}
//                     className={
//                       currentPage === 1
//                         ? "pointer-events-none opacity-50"
//                         : undefined
//                     }
//                   >
//                     {t("pagination.previous")}
//                   </PaginationPrevious>
//                 </PaginationItem>
//                 {pageNumbers.map((page, i) =>
//                   page === "ellipsis" ? (
//                     <PaginationItem key={`ellipsis-${i}`}>
//                       <PaginationEllipsis />
//                     </PaginationItem>
//                   ) : (
//                     <PaginationItem key={page}>
//                       <PaginationLink
//                         href='#'
//                         isActive={currentPage === page}
//                         onClick={(e) => {
//                           e.preventDefault();
//                           setCurrentPage(page);
//                         }}
//                         aria-label={`Go to page ${page}`}
//                       >
//                         {page}
//                       </PaginationLink>
//                     </PaginationItem>
//                   )
//                 )}
//                 <PaginationItem>
//                   <PaginationNext
//                     href='#'
//                     onClick={(e) => {
//                       e.preventDefault();
//                       if (currentPage < totalPages)
//                         setCurrentPage(currentPage + 1);
//                     }}
//                     className={
//                       currentPage >= totalPages
//                         ? "pointer-events-none opacity-50"
//                         : undefined
//                     }
//                   >
//                     {t("pagination.next")}
//                   </PaginationNext>
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </div>
//         </div>
//       )}
//       <AddProductModal
//         open={addOpen}
//         onOpenChange={setAddOpen}
//         onSuccess={handleAddSuccess}
//       />
//       <EditProductModal
//         open={editProduct !== null}
//         onOpenChange={(open) => !open && setEditProduct(null)}
//         product={editProduct}
//         onSave={handleEditSave}
//       />
//       <DeleteProductConfirmModal
//         open={deleteConfirm !== null}
//         onOpenChange={(open) => !open && setDeleteConfirm(null)}
//         onConfirm={handleConfirmDelete}
//         isDeleteOne={deleteConfirm?.type === "one"}
//         selectedProduct={selectedProduct}
//         selectedCount={selectedCount}
//       />
//     </div>
//   );
// }
