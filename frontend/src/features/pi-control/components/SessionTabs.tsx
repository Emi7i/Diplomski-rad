import { Plus, X } from "lucide-react";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import type { Session } from "../types";

const MAIN_SESSION_ID = "main";

interface SessionTabsProps {
  sessions: Session[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onCreate: () => void;
}

export default function SessionTabs({
  sessions,
  activeId,
  onSelect,
  onClose,
  onCreate,
}: SessionTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-(--border)">
      {sessions.map((session) => (
        <div
          key={session.id}
          onClick={() => onSelect(session.id)}
          className={cn(
            "flex shrink-0 cursor-pointer items-center gap-2 rounded-t-md border border-b-0 px-3 py-1.5 text-sm",
            session.id === activeId
              ? "border-(--border) bg-black text-white"
              : "border-transparent text-(--text) hover:bg-(--accent-bg)",
          )}
        >
          <span>{session.label}</span>
          {session.id !== MAIN_SESSION_ID && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClose(session.id);
              }}
              aria-label={`Close ${session.label}`}
              className="opacity-60 hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={onCreate}
        title="New session"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
