import type { TagDTO } from "./TagDTO";

export interface MealResponseDTO {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description: string;
  tags: TagDTO[];
}
