import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { MealResponseDTO } from "@/types";
import { BASE_URL } from "@/config/api";
import { AddToCartForm } from "./components/AddToCartForm";
import { Chip } from "@heroui/chip";

export default function MealPage() {
  const { id } = useParams();
  const location = useLocation();
  const initialMeal = location.state?.meal as MealResponseDTO | undefined;

  const [meal, setMeal] = useState<MealResponseDTO | undefined>(initialMeal);
  const [loading, setLoading] = useState(!initialMeal);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!meal && id) {
      const fetchMeal = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/api/meals/${id}`);
          if (!response.ok)
            throw new Error(`Failed with status ${response.status}`);
          const data: MealResponseDTO = await response.json();
          setMeal(data);
        } catch (err: unknown) {
          if (err instanceof Error) setError(err.message);
          else setError("Unknown error");
        } finally {
          setLoading(false);
        }
      };

      fetchMeal();
    }
  }, [meal, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!meal) return <p className="text-red-500">Meal not found</p>;

  return (
    <div className="p-6 flex items-center flex-col">
      <h1 className="text-3xl font-bold p-6">{meal.name}</h1>
      <img
        src={meal.imageUrl}
        alt={meal.name}
        className="w-full max-w-lg rounded-2xl mb-4"
      />
      <p className="text-lg">{meal.description}</p>
      <p className="font-semibold mt-2">Price: ${meal.price}</p>
      <p className="text-sm text-gray-500">Quantity: {meal.quantity}</p>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Tags</h2>
        <ul className="flex gap-2 mt-2">
          {meal.tags.map((tag) => (
            <li key={tag.id}>
              <Chip color="primary">{tag.name}</Chip>
            </li>
          ))}
        </ul>
      </div>
      <AddToCartForm mealId={meal.id} maxQuantity={meal.quantity} />
    </div>
  );
}
