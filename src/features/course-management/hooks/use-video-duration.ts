import { getVideoDuration } from "@/features/course-management/utils/sharepoint.utils";
import { useState } from "react";

export function useVideoDuration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDuration = async (videoUrl: string) => {
    try {
      setLoading(true);
      setError(null);

      const duration = await getVideoDuration(videoUrl);
      return duration;
    } catch (err) {
      console.log(err);
      setError("Failed to get video duration");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchDuration,
  };
}
