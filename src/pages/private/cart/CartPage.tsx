import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@heroui/react";
import { useAuth } from "../../../hooks/useAuth";

type Meal = {
  name: string;
  price: number;
  imageUrl: string;
};

type CartItemResponseDTO = {
  id: number;
  memberId: number;
  meal: Meal;
  quantity: number;
  addedAt: string;
};

export default function CartPage() {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
        const data: CartItemResponseDTO[] = await response.json();
        console.log(data);
        setCartItems(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  return (
    <section className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

      {loading && <p>Loading your cart...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && cartItems.length === 0 && (
        <p>Your cart is empty.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cartItems.map((item) => (
          <Card key={item.id} className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <Image
                alt="meal image"
                height={40}
                radius="sm"
                src={item.meal.imageUrl}
                width={40}
              />
              <div className="flex flex-col items-center  text-center">
                <p className="text-md text-center">{item.meal.name}</p>
                <p className="text-small text-default-500">
                  Added on: {new Date(item.addedAt).toLocaleDateString()}
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p>Price: {item.meal.price} €</p>
              <p>Quantity: {item.quantity}</p>
            </CardBody>
            <Divider />
            <CardFooter>
              <p className="text-sm text-default-500">
                Total: ${(item.meal.price * item.quantity).toFixed(2)}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
