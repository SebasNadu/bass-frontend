import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import type { NaturalSearchResponseDTO } from "@/types";
import { Link } from "react-router-dom";

interface MealsGridProps {
  data: NaturalSearchResponseDTO | null;
}

export default function MealsGrid({ data }: MealsGridProps) {
  const [visibleMeals, setVisibleMeals] = useState(10);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!data) return;

    const loaderEl = loaderRef.current; // snapshot the ref here
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleMeals((prev) => Math.min(prev + 10, data.meals.length));
        }
      },
      { threshold: 1.0 },
    );

    if (loaderEl) observer.observe(loaderEl);

    return () => {
      if (loaderEl) observer.unobserve(loaderEl);
    };
  }, [data]);

  if (!data) return <p>No meals found</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {data.meals.slice(0, visibleMeals).map((meal) => (
        <Link to={`/meals/${meal.id}`} state={{ meal }}>
          <Card key={meal.id} className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">
                {meal.tags.map((t) => t.name).join(", ")}
              </p>
              <small className="text-default-500">{meal.price} €</small>
              <h4 className="font-bold text-large">{meal.name}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2 flex justify-center items-center">
              <Image
                alt={meal.name}
                className="object-cover rounded-xl"
                src={meal.imageUrl}
                width={270}
              />
            </CardBody>
          </Card>
        </Link>
      ))}
      <div ref={loaderRef} className="h-10"></div>
    </div>
  );
}
