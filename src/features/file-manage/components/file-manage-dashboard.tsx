"use client";

import { Button } from "@/components/ui/button";
import { FileCategoryCard } from "@/features/file-manage/components/file-category-card";
import { MonthlyFileTransferCard } from "@/features/file-manage/components/monthly-file-transfer-card";
import { RecentlyUploadedFilesCard } from "@/features/file-manage/components/recently-uploaded-files-card";
import { StorageRemainingCard } from "@/features/file-manage/components/storage-remaining-card";
import { StorageUsageChart } from "@/features/file-manage/components/storage-usage-chart";
import {
  getFileCategoryStats,
  getRecentlyUploadedFiles,
  STORAGE_TOTAL_GB,
  STORAGE_USED_GB,
} from "@/features/file-manage/lib/file-stats";
import { Link } from "@/i18n/routing";
import { FolderOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function FileManageDashboard() {
  const t = useTranslations("fileManage.dashboard");
  const stats = useMemo(() => getFileCategoryStats(), []);
  const recentFiles = useMemo(() => getRecentlyUploadedFiles(), []);
  const remainingGb = STORAGE_TOTAL_GB - STORAGE_USED_GB;

  return (
    <div className='FileManageDashboard flex flex-col gap-6'>
      <div className='flex flex-row flex-wrap items-center justify-between gap-2'>
        <h1 className='text-2xl font-bold tracking-tight'>{t("pageTitle")}</h1>
        <Button variant='outline' size='sm' asChild>
          <Link href='/file-manage' className='inline-flex items-center gap-2'>
            <FolderOpen className='size-4 shrink-0' aria-hidden />
            {t("viewAllFiles")}
          </Link>
        </Button>
      </div>
      <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        {stats.map((s) => (
          <FileCategoryCard
            key={s.key}
            stats={s}
            title={t(s.key)}
            viewMoreHref={`/file-manage/${s.key}`}
            viewMoreLabel={t("viewMore")}
            storageUsedLabel={t("storageUsed")}
            updatedAtLabel={t("updatedAt")}
          />
        ))}
        <StorageRemainingCard
          title={t("remainingStorageTitle")}
          remainingGb={remainingGb}
          ofTotalLabel={t("remainingStorageOfTotal", {
            total: STORAGE_TOTAL_GB,
          })}
        />
      </section>
      <section className='w-full'>
        <StorageUsageChart
          cardTitle={t("storageSpaceTitle")}
          cardDescription={t("storageSpaceDescription")}
          usedGb={STORAGE_USED_GB}
          totalGb={STORAGE_TOTAL_GB}
          usedLabel={t("storageUsed")}
          totalLabel={t("storageTotal")}
          labels={{
            documents: t("documents"),
            images: t("images"),
            videos: t("videos"),
            others: t("others"),
            remaining: t("storageRemaining"),
          }}
          tooltipUnitLabel={(value) => t("storageUsageChartTooltip", { value })}
        />
      </section>
      <section className='grid gap-4 lg:grid-cols-2'>
        <MonthlyFileTransferCard
          title={t("monthlyUploadsTitle")}
          subtitle={t("monthlyUploadsSubtitle")}
          dateRangeLabel={t("monthlyTransferDateRange")}
          documentLabel={t("documents")}
          imageLabel={t("images")}
          videoLabel={t("videos")}
          otherLabel={t("others")}
        />
        <RecentlyUploadedFilesCard
          title={t("recentFilesTitle")}
          viewAllLabel={t("recentFilesViewAll")}
          viewAllHref='/files'
          nameColumnLabel={t("recentFilesName")}
          sizeColumnLabel={t("recentFilesSize")}
          uploadDateColumnLabel={t("recentFilesUploadDate")}
          actionsColumnLabel={t("recentFilesActions")}
          openMenuLabel={t("openMenu")}
          files={recentFiles}
        />
      </section>
    </div>
  );
}
