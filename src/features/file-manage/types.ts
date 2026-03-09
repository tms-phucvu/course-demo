export type FileCategoryKey = "documents" | "images" | "videos" | "others";

export interface FileCategoryStats {
  key: FileCategoryKey;
  count: number;
  usedGb: number;
  percent: number;
  /** ISO date string for last update */
  updatedAt: string;
}

export interface MonthlyTransferItem {
  month: string;
  monthShort: string;
  document: number;
  image: number;
  video: number;
  other: number;
}

export interface RecentFileItem {
  name: string;
  size: string;
  uploadDate: string;
  type: "document" | "image" | "video" | "spreadsheet" | "other";
}

/** Item in file/folder list (file-manage list view) */
export interface FileListItem {
  id: string;
  name: string;
  isFolder: boolean;
  fileType?: "document" | "image" | "video" | "spreadsheet" | "other";
  updatedAt: string;
  size: string;
  lastEditedBy: string;
  lastEditedByInitial?: string;
}
