import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import MealsGrid from "./components/MealsGrid";
import type {
  NaturalSearchRequestDTO,
  NaturalSearchResponseDTO,
} from "@/types";

export default function SearchPage() {
  const location = useLocation();
  const userText =
    (location.state as { userText: string })?.userText || "Any product";

  const [results, setResults] = useState<NaturalSearchResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (!userText) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const body: NaturalSearchRequestDTO = {
          userText,
          requireAllTags: false,
          maxTags: 8,
        };

        const response = await fetch(`${BASE_URL}/api/meals/search/natural`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: isAuthenticated ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(body),
        });

        // const text = await response.text(); // get raw response
        // console.log("Raw response:", text);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const json: NaturalSearchResponseDTO = await response.json();
        setResults(json);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userText, isAuthenticated, token]);

  if (!userText) return <p>No search query provided</p>;
  if (loading) return <p>Loading AI search...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!results) return null;

  return results.meals.length > 0 ? (
    <>
      <div className="mb-4 px-4">
        <h2>Natural Language Search</h2>
      </div>
      <MealsGrid data={results} />
    </>
  ) : (
    <p>No meals found for "{userText}"</p>
  );
}
