export const getSharePointDirectLink = (sharepointUrl: string): string => {
  try {
    const url = new URL(sharepointUrl);

    // 1. Get the 'id' parameter from the link (this is the internal path to the file)
    const fileRelativePath = url.searchParams.get("id");

    if (!fileRelativePath) return sharepointUrl;

    // 2. Build the base URL (e.g., https://tenant-my.sharepoint.com/personal/user_name_com/)
    const baseUrl = `${url.origin}${url.pathname.split("_layouts")[0]}`;

    // 3. Combine with SharePoint's download endpoint
    // Structure: [BaseURL]/_layouts/15/download.aspx?SourceUrl=[FilePath]
    const directLink = `${baseUrl}_layouts/15/download.aspx?SourceUrl=${encodeURIComponent(fileRelativePath)}`;

    return directLink;
  } catch (error) {
    console.error("Invalid SharePoint link format", error);
    return sharepointUrl;
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
