import type { ButtonProps } from "@components/ui/button";
import type { PiCommandMeta } from "./types";

export const toneVariant: Record<PiCommandMeta["tone"], ButtonProps["variant"]> = {
  positive: "success",
  negative: "destructive",
  warning: "warning",
  info: "info",
  neutral: "default",
};
