import { useQuery } from "@tanstack/react-query";
import { piApi } from "../services/piApi";

export function useCommands() {
  return useQuery({ queryKey: ["pi-commands"], queryFn: piApi.getCommands });
}
