import { useEffect, useRef } from "react";
import mpegts from "mpegts.js";
import type { VideoStatus } from "../types";

const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || "http://localhost:8000";
const STREAM_PATH = import.meta.env.VITE_STREAM_PATH || "live/hdmi";

interface VideoPanelProps {
  status: VideoStatus;
}

export default function VideoPanel({ status }: VideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (status !== "live" || !videoRef.current || !mpegts.getFeatureList().mseLivePlayback) return;

    const player = mpegts.createPlayer({
      type: "flv",
      isLive: true,
      url: `${MEDIA_URL}/${STREAM_PATH}.flv`,
    });
    player.attachMediaElement(videoRef.current);
    player.load();
    Promise.resolve(player.play()).catch(() => {});

    return () => player.destroy();
  }, [status]);

  return (
    <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-md border border-(--border) bg-black">
      {/* muted: browsers block unmuted autoplay, and this feed has no audio track anyway */}
      <video ref={videoRef} className="h-full w-full" muted playsInline />
      {status === "live" ? (
        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 text-xs font-medium text-red-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          LIVE
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
          No signal
        </div>
      )}
    </div>
  );
}
