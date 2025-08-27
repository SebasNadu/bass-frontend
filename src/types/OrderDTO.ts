import type { OrderItemDTO } from "./OrderItemDTO";

export interface OrderDTO {
  orderId: number;
  createdAt: string;
  status: string;
  totalAmount: number;
  items: OrderItemDTO[];
}
