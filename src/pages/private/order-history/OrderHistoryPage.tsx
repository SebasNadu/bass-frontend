import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/react";
import { BASE_URL } from "@/config/api";
import type { OrderDTO } from "@/types";

import { useAuth } from "@/hooks/useAuth";

const columns = [
  { key: "id", label: "ORDER ID" },
  { key: "status", label: "STATUS" },
  { key: "totalAmount", label: "TOTAL" },
  { key: "createdAt", label: "DATE" },
];

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE_URL}/api/order-history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: isAuthenticated ? `Bearer ${token}` : "",
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data: OrderDTO[] = await res.json();
        setOrders(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Order History</h1>
      <Table aria-label="Order history table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={orders}>
          {(order) => (
            <TableRow key={order.id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "totalAmount"
                    ? `$${order.totalAmount}`
                    : getKeyValue(order, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
