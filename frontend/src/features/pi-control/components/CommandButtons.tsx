import { Button } from "@components/ui/button";
import { useCommands } from "../hooks/useCommands";
import { toneVariant } from "../toneVariant";

interface CommandButtonsProps {
  onRun: (id: string) => void;
}

export default function CommandButtons({ onRun }: CommandButtonsProps) {
  const { data: commands } = useCommands();
  const mainCommands = commands?.filter((command) => !command.newSession);

  return (
    <div className="flex flex-1 flex-wrap items-center gap-3">
      {mainCommands?.map((command) => (
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
