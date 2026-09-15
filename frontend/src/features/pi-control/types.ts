export type SshStatus = "connecting" | "connected" | "disconnected";
export type VideoStatus = "live" | "offline";

export interface PiCommandMeta {
  id: string;
  label: string;
  tone: "positive" | "negative" | "warning" | "info" | "neutral";
  newSession: boolean;
}

export interface Session {
  id: string;
  label: string;
}
