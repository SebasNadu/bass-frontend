import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BASE_URL } from "@/config/api";
import type { MealResponseDTO } from "@/types";
import { useAuth } from "@/hooks/useAuth";

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 3,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 4 } },
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

export default function HomePage() {
  const [mealsByCategory, setMealsByCategory] = useState<{
    Healthy: MealResponseDTO[];
    Vegan: MealResponseDTO[];
    "High-Protein": MealResponseDTO[];
  }>({ Healthy: [], Vegan: [], "High-Protein": [] });

  const [recommendations, setRecommendations] = useState<MealResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMealsAndRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch categories in parallel
        const categories = ["Healthy", "Vegan", "High-Protein"] as const;

        const categoryResults = await Promise.all(
          categories.map(async (cat) => {
            const res = await fetch(`${BASE_URL}/api/meals/tag?tagName=${cat}`);
            if (!res.ok)
              throw new Error(`Meals (${cat}) failed: ${res.status}`);
            const data: MealResponseDTO[] = await res.json();
            return [cat, data.slice(0, 10)] as const;
          })
        );

        // Map results into object
        const categoryMap = Object.fromEntries(categoryResults) as {
          Healthy: MealResponseDTO[];
          Vegan: MealResponseDTO[];
          "High-Protein": MealResponseDTO[];
        };
        setMealsByCategory(categoryMap);

        // Fetch recommendations
        const resRec = await fetch(`${BASE_URL}/api/meals/recommendations`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resRec.ok)
          throw new Error(`Recommendations request failed: ${resRec.status}`);
        const dataRec: MealResponseDTO[] = await resRec.json();
        setRecommendations(dataRec);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMealsAndRecommendations();
  }, [token]);

  const renderCarousel = (title: string, items: MealResponseDTO[]) => {
    if (!items || items.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <Slider {...sliderSettings}>
          {items.map((meal) => (
            <div key={meal.id} className="px-2">
              <Link to={`/meals/${meal.id}`} state={{ meal }}>
                <Card className="hover:scale-105 transition-transform cursor-pointer">
                  <CardHeader className="p-0 justify-center">
                    <Image
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="object-cover object-center w-full h-48"
                      radius="none"
                    />
                  </CardHeader>
                  <CardBody className="p-2">
                    <p className="text-sm font-medium truncate">{meal.name}</p>
                  </CardBody>
                </Card>
              </Link>
            </div>
          ))}
        </Slider>
      </section>
    );
  };

  return (
    <div className="p-4 ">
      <h1 className="p-4">BASS</h1>

      <div className="grid place-items-center">
        {loading && <p className="text-center">Loading meals...</p>}
        {error && <p className="text-red-500 text-center">Error: {error}</p>}
      </div>
      {!loading && !error && (
        <>
          {renderCarousel("Recommended For You", recommendations)}
          {renderCarousel("Healthy Meals", mealsByCategory.Healthy)}
          {renderCarousel("Vegan Meals", mealsByCategory.Vegan)}
          {renderCarousel(
            "High-Protein Meals",
            mealsByCategory["High-Protein"]
          )}
        </>
      )}
    </div>
  );
}
