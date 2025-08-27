import { useState } from "react";
import { Button } from "@heroui/react";
import { BASE_URL } from "@/config/api";

import type { CartItemRequestDTO } from "@/types";
import { useAuth } from "@/hooks/useAuth";

// TODO: redircet to cart page after adding item, if it is necessary
// import { useNavigate } from "react-router-dom";

export function AddToCartForm({
  mealId,
  maxQuantity,
}: {
  mealId: number;
  maxQuantity: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { isAuthenticated, token } = useAuth();
  // const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity < 1) {
      setMessage("Quantity must be at least 1");
      return;
    }
    if (quantity > maxQuantity) {
      setMessage(`Only ${maxQuantity} items available`);
      return;
    }

    const payload: CartItemRequestDTO = { mealId, quantity };

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch(`${BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: isAuthenticated ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
        // credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      const json = await response.json();
      setMessage(`Added to cart! (Quantity: ${json.quantity})`);
      // navigate("/cart");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`Error: ${err.message}`);
      } else {
        setMessage("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <div>
        <label className="block font-medium mb-1">Quantity</label>
        <input
          type="number"
          min={1}
          max={maxQuantity}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded-md px-3 py-2 w-24"
        />
        <p className="text-sm text-gray-400 mt-1">Available: {maxQuantity}</p>
      </div>
      <Button color="primary" variant="ghost" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add to Cart"}
      </Button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
