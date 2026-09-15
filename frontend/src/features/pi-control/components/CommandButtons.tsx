import { Button, type ButtonProps } from "@components/ui/button";
import { useCommands } from "../hooks/useCommands";
import type { PiCommandMeta } from "../types";

const toneVariant: Record<PiCommandMeta["tone"], ButtonProps["variant"]> = {
  positive: "success",
  negative: "destructive",
  warning: "warning",
  neutral: "default",
};

interface CommandButtonsProps {
  onRun: (id: string) => void;
}

export default function CommandButtons({ onRun }: CommandButtonsProps) {
  const { data: commands } = useCommands();

  return (
    <div className="flex flex-1 flex-wrap items-center gap-3">
      {commands?.map((command) => (
        <Button
          key={command.id}
          variant={toneVariant[command.tone]}
          onClick={() => onRun(command.id)}
        >
          {command.label}
        </Button>
      ))}

      <Button asChild variant="pink" className="ml-auto">
        <a href="https://connect.raspberrypi.com/devices" target="_blank" rel="noopener noreferrer">
          Pi Connect
        </a>
      </Button>
    </div>
  );
}
