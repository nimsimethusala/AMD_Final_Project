export type PlantCategory = "indoor" | "outdoor" | "both";

export interface Plant {
  id?: string;
  plantName: string;
  description: string;
  category: PlantCategory;
  image?: string;
}
