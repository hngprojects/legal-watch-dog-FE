import { defineStore } from "pinia";
import type { JurisdictionForm } from "@/types/jurisdiction";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // points to backend

export const useJurisdictionStore = defineStore("jurisdiction", {
  state: () => ({
    jurisdictions: [] as JurisdictionForm[],
  }),
  actions: {
    async addJurisdiction(projectId: string, data: JurisdictionForm) {
      if (!projectId) throw new Error("Project ID is required");

      const payload = {
        project_id: projectId,
        parent_id: projectId, 
        name: data.name,
        description: data.description,
        prompt: data.name, 
        scrape_output: {},
      };

      const res = await fetch(`${BASE_URL}/jurisdictions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error: ${res.status} ${errText}`);
      }

      const created = await res.json();
      this.jurisdictions.push(created);
    },
  },
});