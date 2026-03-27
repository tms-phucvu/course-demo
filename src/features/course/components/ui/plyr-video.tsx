import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";

type PlyrVideoProps = {
  src: string;
};

export default function PlyrVideo({ src }: PlyrVideoProps) {
  const plyrProps = {
    source: {
      type: "video" as const,
      sources: [
        {
          src,
          provider: "youtube" as const,
        },
      ],
    },
    options: {
      youtube: {
        modestbranding: 1,
      },
      controls: [
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "fullscreen",
      ],
    },
  };

  return <Plyr {...plyrProps} />;
}
