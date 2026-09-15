import { Button } from "@components/ui/button";
import { useCommands } from "../hooks/useCommands";
import { toneVariant } from "../toneVariant";

interface DiagnosticButtonsProps {
  onRun: (id: string) => void;
}

export default function DiagnosticButtons({ onRun }: DiagnosticButtonsProps) {
  const { data: commands } = useCommands();
  const diagnosticCommands = commands?.filter((command) => command.newSession);

  if (!diagnosticCommands?.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {diagnosticCommands.map((command) => (
        <Button
          key={command.id}
          variant={toneVariant[command.tone]}
          onClick={() => onRun(command.id)}
        >
          {command.label}
        </Button>
      ))}
    </div>
  );
}
