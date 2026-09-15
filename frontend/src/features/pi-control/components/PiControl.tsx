import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@components/ui/button";
import VideoPanel from "./VideoPanel";
import CommandButtons from "./CommandButtons";
import DiagnosticButtons from "./DiagnosticButtons";
import SessionTabs from "./SessionTabs";
import TerminalConsole, { type TerminalConsoleHandle } from "./TerminalConsole";
import { usePiSocket } from "../hooks/usePiSocket";
import type { Session } from "../types";

const MAIN_SESSION_ID = "main";

const statusLabel = {
  connecting: "Connecting…",
  connected: "Connected",
  disconnected: "Disconnected",
} as const;
const statusColor = {
  connecting: "bg-yellow-500",
  connected: "bg-green-500",
  disconnected: "bg-red-500",
} as const;

export default function PiControl() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const consoleRefs = useRef(new Map<string, TerminalConsoleHandle>());
  const pendingSwitchRef = useRef(false);

  const onSessionData = useCallback((sessionId: string, text: string) => {
    consoleRefs.current.get(sessionId)?.write(text);
  }, []);

  const onSessionCreated = useCallback((session: Session) => {
    setSessions((prev) => (prev.some((s) => s.id === session.id) ? prev : [...prev, session]));
    setActiveSessionId((current) => {
      if (current === null) return session.id;
      if (pendingSwitchRef.current) {
        pendingSwitchRef.current = false;
        return session.id;
      }
      return current;
    });
  }, []);

  const onSessionClosed = useCallback((sessionId: string) => {
    consoleRefs.current.delete(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setActiveSessionId((current) => (current === sessionId ? MAIN_SESSION_ID : current));
  }, []);

  const {
    sshStatus,
    videoStatus,
    sendInput,
    sendCommand,
    runInNewSession,
    createSession,
    closeSession,
    sendReconnect,
  } = usePiSocket({ onSessionData, onSessionCreated, onSessionClosed });

  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (activeSessionId) consoleRefs.current.get(activeSessionId)?.fit();
  }, [activeSessionId]);

  const handleCreateSession = () => {
    pendingSwitchRef.current = true;
    createSession();
  };

  const handleRunDiagnostic = (commandId: string) => {
    pendingSwitchRef.current = true;
    runInNewSession(commandId);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-(--text)">
          <span className={`h-1.5 w-1.5 rounded-full ${statusColor[sshStatus]}`} />
          {statusLabel[sshStatus]}
        </div>
        <Button
          key={pulse}
          variant="outline"
          size="icon"
          className={pulse > 0 ? "animate-impact" : ""}
          onClick={() => {
            setPulse((p) => p + 1);
            sendReconnect();
          }}
          title="Reconnect to the Pi"
        >
          <RefreshCw className={sshStatus === "connecting" ? "animate-spin" : ""} />
        </Button>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <VideoPanel status={videoStatus} />
        <CommandButtons onRun={(id) => sendCommand(MAIN_SESSION_ID, id)} />
      </div>

      <DiagnosticButtons onRun={handleRunDiagnostic} />

      <div className="flex h-[300px] min-h-[150px] max-h-[80vh] w-full resize-y flex-col overflow-hidden rounded-md border border-(--border)">
        <SessionTabs
          sessions={sessions}
          activeId={activeSessionId}
          onSelect={setActiveSessionId}
          onClose={closeSession}
          onCreate={handleCreateSession}
        />
        <div className="min-h-0 flex-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={session.id === activeSessionId ? "h-full w-full" : "hidden"}
            >
              <TerminalConsole
                ref={(handle) => {
                  if (handle) consoleRefs.current.set(session.id, handle);
                  else consoleRefs.current.delete(session.id);
                }}
                onInput={(text) => sendInput(session.id, text)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
