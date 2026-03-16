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
  fetchInfo: (url: string) => Promise<YoutubeVideoInfo | null>;
}

export function useYoutubeVideoInfo(): UseYoutubeVideoInfoResult {
  const [info, setInfo] = useState<YoutubeVideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInfo = useCallback(
    async (url: string): Promise<YoutubeVideoInfo | null> => {
      setLoading(true);
      setError(null);
      setInfo(null);

      const videoId = extractVideoId(url);
      if (!videoId) {
        setError("Invalid Video URL");
        setLoading(false);
        return null;
      }

      const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_V3_API_KEY;

      if (!API_KEY) {
        setError("Missing API Key (NEXT_PUBLIC_YOUTUBE_V3_API_KEY)");
        setLoading(false);
        return null;
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
          throw new Error("Video ID not found");
        }

        const video = data.items[0];
        const title = video.snippet?.title || "No title";
        const durationSeconds = parseYoutubeDuration(
          video.contentDetails?.duration
        );

        const result = {
          title,
          durationSeconds,
          videoId,
        };

        setInfo(result);

        return result;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to retrieve YouTube video information");
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { info, loading, error, fetchInfo };
}
