import { useEffect } from "react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useApi } from "@/hooks/useApi";

// Types
interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

// API base
const BASE_URL = import.meta.env.VITE_API_URL;

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
  // Fetch recommendations
  const {
    data: recommendations,
    loading: loadingRecommendations,
    execute: fetchRecommendations,
  } = useApi<Meal[]>(`${BASE_URL}/meals/recommendations`, {
    autoFetch: true,
  });

  // Fetch categories
  const {
    data: categories,
    loading: loadingCategories,
    execute: fetchCategories,
  } = useApi<Record<string, Meal[]>>(`${BASE_URL}/meals/categories`, {
    autoFetch: true,
  });

  // Re-fetch on mount
  useEffect(() => {
    fetchRecommendations();
    fetchCategories();
  }, [fetchRecommendations, fetchCategories]);

  const renderCarousel = (title: string, meals?: Meal[]) => {
    if (!meals || meals.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <Slider {...sliderSettings}>
          {meals.map((meal) => (
            <div key={meal.id} className="px-2">
              <Link to={`/meal/${meal.id}`}>
                <Card className="hover:scale-105 transition-transform cursor-pointer">
                  <CardHeader className="p-0">
                    <Image
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="object-cover w-full h-48"
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
    <div className="p-6">
      <h1>BASS</h1>
      {loadingRecommendations || loadingCategories ? (
        <p>Loading...</p>
      ) : (
        <>
          {renderCarousel("Recommended for You", recommendations ?? [])}

          {categories &&
            Object.entries(categories)
              .slice(0, 3) // limit to 3 categories
              .map(([categoryName, meals]) =>
                renderCarousel(categoryName, meals)
              )}
        </>
      )}
    </div>
  );
}
