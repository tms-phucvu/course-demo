export const formatDate = ({
  value,
  locale,
}: {
  value: number;
  locale: string;
}) =>
  new Date(value).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

export const formatDateFromISO = ({
  value,
  locale,
}: {
  value: string; // ISO string
  locale: string;
}) =>
  new Date(value).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

export const getPageNumbers = ({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) => {
  const pages: Array<number | "ellipsis"> = [];
  const delta = 2;
  const range = {
    start: Math.max(1, currentPage - delta),
    end: Math.min(totalPages, currentPage + delta),
  };

  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || (i >= range.start && i <= range.end)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return pages;
};

export const isValidImageName = (url: string) => {
  return /\.(jpg|jpeg|png|webp)$/i.test(url);
};

export const isValidImage = (file: File) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
  return allowedTypes.includes(file.type);
};

export const slugify = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
