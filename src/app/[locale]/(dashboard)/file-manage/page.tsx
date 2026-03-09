import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FileListTable } from "@/features/file-manage/components/file-list-table";
import { getFileList } from "@/features/file-manage/lib/file-stats";
import { getTranslations } from "next-intl/server";

interface FileManageListPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FileManageListPage({
  params,
}: FileManageListPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("fileManage.list");
  const items = getFileList();

  return (
    <FileListTable
      title={t("pageTitle")}
      uploadLabel={t("upload")}
      searchPlaceholder={t("searchPlaceholder")}
      sortLabel={t("sortLabel")}
      sortByNameDesc={t("sortByNameDesc")}
      sortBySizeDesc={t("sortBySizeDesc")}
      sortByDateDesc={t("sortByDateDesc")}
      columnName={t("columnName")}
      columnUpdatedAt={t("columnUpdatedAt")}
      columnSize={t("columnSize")}
      columnLastEditedBy={t("columnLastEditedBy")}
      actionCompress={t("actionCompress")}
      actionArchive={t("actionArchive")}
      actionShare={t("actionShare")}
      actionMove={t("actionMove")}
      actionCopy={t("actionCopy")}
      actionDelete={t("actionDelete")}
      openMenuLabel={t("openMenu")}
      emptyState={t("emptyState")}
      uploadModalTitle={t("uploadModalTitle")}
      uploadModalDescription={t("uploadModalDescription")}
      uploadModalDropzoneMainLabel={t("uploadModalDropzoneMainLabel")}
      uploadModalDropzoneHintLabel={t("uploadModalDropzoneHintLabel")}
      uploadModalCancelLabel={t("uploadModalCancelLabel")}
      uploadModalStartUploadLabel={t("uploadModalStartUploadLabel")}
      uploadModalDoneLabel={t("uploadModalDoneLabel")}
      sidebarInfoLabel={t("sidebarInfoLabel")}
      sidebarTypeLabel={t("sidebarTypeLabel")}
      sidebarSizeLabel={t("sidebarSizeLabel")}
      sidebarOwnerLabel={t("sidebarOwnerLabel")}
      sidebarLocationLabel={t("sidebarLocationLabel")}
      sidebarModifiedLabel={t("sidebarModifiedLabel")}
      sidebarCreatedLabel={t("sidebarCreatedLabel")}
      sidebarSettingsLabel={t("sidebarSettingsLabel")}
      sidebarFileSharingLabel={t("sidebarFileSharingLabel")}
      sidebarBackupLabel={t("sidebarBackupLabel")}
      sidebarSyncLabel={t("sidebarSyncLabel")}
      sidebarTypeFile={t("sidebarTypeFile")}
      sidebarTypeFolder={t("sidebarTypeFolder")}
      sidebarLocationDefault={t("sidebarLocationDefault")}
      items={items}
    />
  );
}
