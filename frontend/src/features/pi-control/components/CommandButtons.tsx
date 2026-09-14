import { useState } from "react";
import { Button, type ButtonProps } from "@components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { useCommands } from "../hooks/useCommands";
import type { PiCommandMeta } from "../types";

const toneVariant: Record<PiCommandMeta["tone"], ButtonProps["variant"]> = {
  positive: "success",
  negative: "destructive",
  neutral: "default",
};

interface CommandButtonsProps {
  onRun: (id: string) => void;
}

export default function CommandButtons({ onRun }: CommandButtonsProps) {
  const { data: commands } = useCommands();
  const [pending, setPending] = useState<PiCommandMeta | null>(null);

  return (
    <div className="flex flex-wrap gap-3">
      {commands?.map((command) => (
        <Button
          key={command.id}
          variant={toneVariant[command.tone]}
          onClick={() => (command.destructive ? setPending(command) : onRun(command.id))}
        >
          {command.label}
        </Button>
      ))}

      <AlertDialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Run "{pending?.label}"?</AlertDialogTitle>
            <AlertDialogDescription>This runs a command on the Pi that can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pending) onRun(pending.id);
                setPending(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
