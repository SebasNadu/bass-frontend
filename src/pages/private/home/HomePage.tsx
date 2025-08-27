import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BASE_URL } from "@/config/api";
import type { MealResponseDTO } from "@/types";

// Carousel config
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
  const [meals, setMeals] = useState<MealResponseDTO[]>([]);
  //  const [recommendations, setRecommendations] = useState<MealResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Replace with real logged-in memberId from auth context/session
  const memberId = 1;

  useEffect(() => {
    const fetchMealsAndRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch healthy meals
        const resMeals = await fetch(
          `${BASE_URL}/api/meals/tag?tagName=Healthy`,
        );
        if (!resMeals.ok)
          throw new Error(`Meals request failed: ${resMeals.status}`);
        const dataMeals: MealResponseDTO[] = await resMeals.json();
        setMeals(dataMeals.slice(0, 10));

        // Fetch recommendations
        // const resRec = await fetch(`${BASE_URL}/api/meals/recommendations`);
        //if (!resRec.ok)
        //  throw new Error(`Recommendations request failed: ${resRec.status}`);
        // const dataRec: MealResponseDTO[] = await resRec.json();
        // setRecommendations(dataRec);
        //} catch (err: unknown) {
        // if (err instanceof Error) {
        //   setError(err.message);
        // } else {
        //  setError("Unknown error");
        // }
      } finally {
        setLoading(false);
      }
    };

    fetchMealsAndRecommendations();
  }, [memberId]);

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
    <div className="p-4">
      <h1 className="p-4">BASS</h1>

      {loading && <p>Loading meals...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <>
          {renderCarousel("Healthy Meals", meals)}
          {/*      {renderCarousel("Recommended For You", recommendations)}  */}
        </>
      )}
    </div>
  );
}
