import { useCallback, useEffect, useRef, useState } from "react";
import type { SshStatus, VideoStatus } from "../types";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";

interface UsePiSocketOptions {
  onConsoleData: (text: string) => void;
}

// console data bypasses React state (a ref callback instead) so high-frequency output doesn't spam re-renders
export function usePiSocket({ onConsoleData }: UsePiSocketOptions) {
  const [sshStatus, setSshStatus] = useState<SshStatus>("disconnected");
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("offline");
  const wsRef = useRef<WebSocket | null>(null);
  const onConsoleDataRef = useRef(onConsoleData);

  useEffect(() => {
    onConsoleDataRef.current = onConsoleData;
  });

  useEffect(() => {
    let cancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      if (cancelled) return;
      const socket = new WebSocket(WS_URL);
      wsRef.current = socket;

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "console") onConsoleDataRef.current(msg.text);
        if (msg.type === "ssh-status") setSshStatus(msg.status);
        if (msg.type === "video-status") setVideoStatus(msg.status);
      };

      socket.onclose = () => {
        if (!cancelled) reconnectTimer = setTimeout(connect, 2000);
      };
    };

    connect();
    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, []);

  const send = useCallback((payload: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(JSON.stringify(payload));
  }, []);

  const sendInput = useCallback((text: string) => send({ type: "input", text }), [send]);
  const sendCommand = useCallback((id: string) => send({ type: "command", id }), [send]);
  const sendReconnect = useCallback(() => send({ type: "reconnect" }), [send]);

  return { sshStatus, videoStatus, sendInput, sendCommand, sendReconnect };
}
