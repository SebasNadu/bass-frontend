import type { MealResponseDTO } from "./MealResponseDTO";

export interface NaturalSearchResponseDTO {
  selectedTags: string[];
  meals: MealResponseDTO[];
}
