export const getSharePointDownloadLink = (sharepointUrl: string): string => {
  try {
    if (!sharepointUrl?.trim()) return "";

    const url = new URL(sharepointUrl.trim());

    const fileRelativePath = url.searchParams.get("id");
    if (!fileRelativePath) return "";

    if (!url.pathname.includes("_layouts")) return "";

    const basePath = url.pathname.split("_layouts")[0];
    if (!basePath) return "";

    const baseUrl = `${url.origin}${basePath}`;

    const directLink = `${baseUrl}_layouts/15/download.aspx?SourceUrl=${encodeURIComponent(
      fileRelativePath
    )}`;

    return directLink;
  } catch {
    return "";
  }
};

export const getVideoDuration = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = url;

    video.onloadedmetadata = () => {
      resolve(video.duration);
    };

    video.onerror = () => reject("Cannot load video metadata");
  });
};

export const isValidSharePointEmbedLink = (urlString: string): boolean => {
  try {
    if (!urlString?.trim()) return false;

    const url = new URL(urlString.trim());

    const isSharePoint = url.hostname.includes("sharepoint.com");
    const isEmbedPath = url.pathname.includes("_layouts/15/embed.aspx");
    const uniqueId = url.searchParams.get("UniqueId");

    return isSharePoint && isEmbedPath && !!uniqueId;
  } catch {
    return false;
  }
};
