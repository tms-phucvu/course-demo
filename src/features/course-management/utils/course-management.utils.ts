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
