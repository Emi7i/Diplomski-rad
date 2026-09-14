export type SshStatus = "connecting" | "connected" | "disconnected";
export type VideoStatus = "live" | "offline";

export interface PiCommandMeta {
  id: string;
  label: string;
  destructive: boolean;
  tone: "positive" | "negative" | "neutral";
}
