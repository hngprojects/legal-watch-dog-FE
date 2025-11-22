// src/api/jurisdiction.ts
import type { JurisdictionAPIData, JurisdictionForm } from "@/types/jurisdiction";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createJurisdiction = async (projectId: string, data: JurisdictionForm) => {
  const payload: JurisdictionAPIData = {
    project_id: projectId,
    parent_id: projectId,
    name: data.name,
    description: data.description,
    prompt: data.name, // You can adjust the prompt if needed
    scrape_output: {}, // Empty initially
  };

  const response = await fetch(`${BASE_URL}/jurisdictions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create jurisdiction: ${errText}`);
  }

  return response.json();
};