import { useCallback, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@components/ui/button";
import VideoPanel from "./VideoPanel";
import CommandButtons from "./CommandButtons";
import TerminalConsole, { type TerminalConsoleHandle } from "./TerminalConsole";
import { usePiSocket } from "../hooks/usePiSocket";

const statusLabel = { connecting: "Connecting…", connected: "Connected", disconnected: "Disconnected" } as const;
const statusColor = { connecting: "bg-yellow-500", connected: "bg-green-500", disconnected: "bg-red-500" } as const;

export default function PiControl() {
  const consoleRef = useRef<TerminalConsoleHandle>(null);
  const onConsoleData = useCallback((text: string) => consoleRef.current?.write(text), []);
  const { sshStatus, videoStatus, sendInput, sendCommand, sendReconnect } = usePiSocket({ onConsoleData });
  const [pulse, setPulse] = useState(0);

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
        <CommandButtons onRun={sendCommand} />
      </div>

      <div className="h-[420px] w-full overflow-hidden rounded-md border border-(--border)">
        <TerminalConsole ref={consoleRef} onInput={sendInput} />
      </div>
    </div>
  );
}
