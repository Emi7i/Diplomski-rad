import { useCallback, useEffect, useRef, useState } from "react";
import type { Session, SshStatus, VideoStatus } from "../types";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";

interface UsePiSocketOptions {
  onSessionData: (sessionId: string, text: string) => void;
  onSessionCreated: (session: Session) => void;
  onSessionClosed: (sessionId: string) => void;
}

// session data bypasses React state (callbacks into terminal refs) so high-frequency output doesn't spam re-renders
export function usePiSocket({
  onSessionData,
  onSessionCreated,
  onSessionClosed,
}: UsePiSocketOptions) {
  const [sshStatus, setSshStatus] = useState<SshStatus>("disconnected");
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("offline");
  const wsRef = useRef<WebSocket | null>(null);
  const callbacksRef = useRef({ onSessionData, onSessionCreated, onSessionClosed });

  useEffect(() => {
    callbacksRef.current = { onSessionData, onSessionCreated, onSessionClosed };
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
        if (msg.type === "console") callbacksRef.current.onSessionData(msg.sessionId, msg.text);
        if (msg.type === "session-created")
          callbacksRef.current.onSessionCreated({ id: msg.sessionId, label: msg.label });
        if (msg.type === "session-closed") callbacksRef.current.onSessionClosed(msg.sessionId);
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

  const sendInput = useCallback(
    (sessionId: string, text: string) => send({ type: "input", sessionId, text }),
    [send],
  );
  const sendCommand = useCallback(
    (sessionId: string, id: string) => send({ type: "command", sessionId, id }),
    [send],
  );
  const runInNewSession = useCallback(
    (id: string) => send({ type: "run-command-new-session", id }),
    [send],
  );
  const createSession = useCallback(() => send({ type: "create-session" }), [send]);
  const closeSession = useCallback(
    (sessionId: string) => send({ type: "close-session", sessionId }),
    [send],
  );
  const sendReconnect = useCallback(() => send({ type: "reconnect" }), [send]);

  return {
    sshStatus,
    videoStatus,
    sendInput,
    sendCommand,
    runInNewSession,
    createSession,
    closeSession,
    sendReconnect,
  };
}
