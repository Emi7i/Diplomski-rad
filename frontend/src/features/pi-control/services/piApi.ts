import apiClient from "@lib/api-client";
import type { PiCommandMeta } from "../types";

export const piApi = {
  async getCommands(): Promise<PiCommandMeta[]> {
    const response = await apiClient.get<PiCommandMeta[]>("/commands");
    return response.data;
  },
};
