import { useEffect, useState } from "react";
import { BASE_URL } from "@/config/api";

interface TagDTO {
  id: number;
  name: string;
}

interface MealResponseDTO {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description: string;
  tags: TagDTO[];
}

export default function TestAPI() {
  const [data, setData] = useState<MealResponseDTO[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("API URL:", BASE_URL);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/api/meals`);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const json: MealResponseDTO[] = await response.json();
        setData(json);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1>Test API Response</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
