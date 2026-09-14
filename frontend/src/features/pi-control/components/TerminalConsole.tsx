import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { Input } from "@components/ui/input";
import "@xterm/xterm/css/xterm.css";

export interface TerminalConsoleHandle {
  write: (text: string) => void;
}

interface TerminalConsoleProps {
  onInput: (text: string) => void;
}

// output-only terminal (disableStdin); typing happens in the input bar below, not the terminal itself
const TerminalConsole = forwardRef<TerminalConsoleHandle, TerminalConsoleProps>(function TerminalConsole(
  { onInput },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const [value, setValue] = useState("");

  useImperativeHandle(ref, () => ({
    write: (text: string) => termRef.current?.write(text),
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      convertEol: true,
      disableStdin: true,
      fontFamily: "ui-monospace, Consolas, monospace",
      fontSize: 13,
      theme: { background: "#000000", foreground: "#e5e5e5" },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    termRef.current = term;

    const fit = () => fitAddon.fit();
    requestAnimationFrame(fit);
    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      term.dispose();
      termRef.current = null;
    };
  }, []);

  const submit = () => {
    if (!value) return;
    onInput(`${value}\n`);
    setValue("");
  };

  return (
    <div className="flex h-full w-full flex-col bg-black">
      <div ref={containerRef} className="min-h-0 flex-1 p-2 text-left" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Type a command and press Enter…"
        spellCheck={false}
        className="rounded-none border-0 border-t border-neutral-800 bg-black font-mono text-green-400 placeholder:text-neutral-600 focus-visible:ring-0"
      />
    </div>
  );
});

export default TerminalConsole;
