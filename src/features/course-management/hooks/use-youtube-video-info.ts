import {
  extractVideoId,
  parseYoutubeDuration,
} from "@/features/course-management/utils/youtube.utils";
import { useCallback, useState } from "react";

interface YoutubeVideoInfo {
  title: string;
  durationSeconds: number;
  videoId: string;
}

interface UseYoutubeVideoInfoResult {
  info: YoutubeVideoInfo | null;
  loading: boolean;
  error: string | null;
  fetchInfo: (url: string) => Promise<void>;
}

export function useYoutubeVideoInfo(): UseYoutubeVideoInfoResult {
  const [info, setInfo] = useState<YoutubeVideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInfo = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setInfo(null);

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError("Không tìm thấy video ID hợp lệ từ URL");
      setLoading(false);
      return;
    }

    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_V3_API_KEY;

    if (!API_KEY) {
      setError("Thiếu API Key (NEXT_PUBLIC_YOUTUBE_V3_API_KEY)");
      setLoading(false);
      return;
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(
          `YouTube API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.items?.length) {
        throw new Error("Không tìm thấy video");
      }

      const video = data.items[0];
      const title = video.snippet?.title || "Không có tiêu đề";
      const durationSeconds = parseYoutubeDuration(
        video.contentDetails?.duration
      );

      setInfo({
        title,
        durationSeconds,
        videoId,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Lỗi khi lấy thông tin video từ YouTube");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { info, loading, error, fetchInfo };
}
