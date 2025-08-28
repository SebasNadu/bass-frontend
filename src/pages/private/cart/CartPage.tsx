import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Button,
  Select,
  SelectItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useAuth } from "../../../hooks/useAuth";

type Coupon = {
  id: number;
  code: string;
  displayName: string;
  discountType: "FIXED_AMOUNT" | "PERCENTAGE";
  discountValue: number;
  isValid: boolean;
};

type Meal = {
  name: string;
  price: number;
  imageUrl: string;
  tags: { id: number; name: string }[];
};

type CartItemResponseDTO = {
  id: number;
  memberId: number;
  meal: Meal;
  quantity: number;
  addedAt: string;
};

type OrderItem = {
  mealName: string;
  quantity: number;
  price: number;
  totalPrice: number;
};

type Payment = {
  status: string;
  amount: number;
  amountWithoutDiscount: number;
  discountAmount: number;
};

type OrderDetails = {
  order: {
    items: OrderItem[];
    totalAmount: number;
    status: string;
    payments: Payment[];
  };
  memberDetails: {
    newCoupon: {
      displayName: string;
      memberStreak: number;
      achievementDescription: string;
    } | null;
  };
};

// Define the member details interface
interface MemberDetails {
  streak: number;
  testimonial: string;
  newCoupon: {
    displayName: string;
    memberStreak: number;
    achievementDescription: string;
  } | null;
}

export default function CartPage() {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemResponseDTO[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // For the confirmation modal
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const [memberDetails, setMemberDetails] = useState<MemberDetails | null>(
    null
  );

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
        setCartItems(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load cart");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/members/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user info");
        const data = await response.json();
        setCoupons(data.coupons || []);
        setMemberDetails(data); // Set the member details here
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
    fetchUserInfo();
  }, [token]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.meal.price * item.quantity,
    0
  );

  const selectedCoupon = coupons.find((c) => c.id === selectedCouponId);

  const discountedAmount = (() => {
    if (!selectedCoupon) return totalAmount;

    if (selectedCoupon.discountType === "FIXED_AMOUNT") {
      return Math.max(totalAmount - selectedCoupon.discountValue, 0);
    }

    if (selectedCoupon.discountType === "PERCENTAGE") {
      return totalAmount * (1 - selectedCoupon.discountValue / 100);
    }

    return totalAmount;
  })();

  const handleOrder = async () => {
    // Check if more than half of the items in the cart don't have "Healthy" tag
    const healthyCount = cartItems.filter((item) =>
      item.meal.tags.some((tag) => tag.name === "Healthy")
    ).length;

    const totalItems = cartItems.length;
    if (healthyCount < totalItems / 2) {
      // Show confirmation modal
      setIsConfirmationOpen(true);
    } else {
      placeOrder();
    }
  };

  const placeOrder = async () => {
    setOrderProcessing(true);
    setError(null);
    setOrderSuccess(false);

    const paymentRequest = {
      amount: discountedAmount,
      currency: "EUR",
      paymentMethod: "pm_card_visa",
      couponId: selectedCouponId,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(paymentRequest),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Order failed");
      }

      const data: OrderDetails = await response.json();
      setOrderDetails(data);
      console.log("Order successful:", data);
      setOrderSuccess(true);
      setCartItems([]);
      setSelectedCouponId(null);
      onOpen();
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Order error:", err);
    } finally {
      setOrderProcessing(false);
    }
  };

  const formatDiscount = (coupon: Coupon) => {
    return coupon.discountType === "FIXED_AMOUNT"
      ? `-${coupon.discountValue} €`
      : `-${coupon.discountValue} %`;
  };

  const handleConfirm = () => {
    setIsConfirmationOpen(false); // Close the confirmation modal
    placeOrder(); // Proceed with placing the order
  };

  const handleCancel = () => {
    setIsConfirmationOpen(false); // Just close the modal without placing the order
  };

  return (
    <section className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

      {loading && <p>Loading your cart...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {orderSuccess && !isOpen && (
        <p className="text-green-600 font-semibold">
          Order placed successfully!
        </p>
      )}
      {!loading && !error && cartItems.length === 0 && !orderSuccess && (
        <p>Your cart is empty.</p>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {cartItems.map((item) => (
          <Card
            key={item.id}
            className="w-[300px] h-[240px] flex flex-col justify-between"
          >
            <CardHeader className="flex gap-3">
              <Image
                alt="meal image"
                height={40}
                radius="sm"
                src={item.meal.imageUrl}
                width={40}
              />
              <div className="flex flex-col items-center text-center">
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
                Total: {(item.meal.price * item.quantity).toFixed(2)} €
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {cartItems.length > 0 &&
          coupons.filter((c) => c.isValid).length > 0 && (
            <div className="mt-6 w-64">
              <Select
                label="Select a Coupon"
                color="success"
                placeholder="No coupon selected"
                selectedKeys={
                  selectedCouponId ? [selectedCouponId.toString()] : []
                }
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setSelectedCouponId(selectedKey ? Number(selectedKey) : null);
                }}
              >
                {coupons
                  .filter((coupon) => coupon.isValid)
                  .map((coupon) => (
                    <SelectItem
                      key={coupon.id.toString()}
                      textValue={`${coupon.displayName} ${formatDiscount(
                        coupon
                      )}`}
                    >
                      {coupon.displayName} ({formatDiscount(coupon)})
                    </SelectItem>
                  ))}
              </Select>
            </div>
          )}
      </div>

      {cartItems.length > 0 && (
        <div className="w-full flex flex-col items-center justify-center mt-8">
          <p className="text-lg font-semibold mb-1">
            Total: {discountedAmount.toFixed(2)} €
          </p>
          {selectedCoupon && (
            <p className="text-sm text-gray-600 mb-2">
              Discount applied: {formatDiscount(selectedCoupon)}
            </p>
          )}
          <Button
            color="primary"
            onClick={handleOrder}
            isLoading={orderProcessing}
            variant="ghost"
          >
            {orderProcessing ? "Placing Order..." : "Order"}
          </Button>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        backdrop="opaque"
        isOpen={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
      >
        <ModalContent>
          <ModalHeader className="text-xl text-center">
            Are you sure?
          </ModalHeader>
          <ModalBody>
            <p className="mb-2">
              You are about to lose your streak of {memberDetails?.streak}{" "}
              points.
            </p>
            <p className="mb-4">{memberDetails?.testimonial}</p>
            <div className="flex gap-4 justify-center">
              <Button color="danger" onClick={handleCancel}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Order Success Modal */}
      {isOpen && orderDetails && (
        <Modal backdrop="opaque" isOpen={isOpen} onOpenChange={onClose}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1 text-2xl text-center">
              Order Confirmation
            </ModalHeader>
            <ModalBody>
              <h3 className="font-semibold text-lg mb-4">Order Items</h3>
              <div>
                {orderDetails.order.items.map((item, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span>
                      {item.mealName} (x{item.quantity})
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>

              <Divider className="my-4" />

              <h3 className="font-semibold text-lg mb-4">Payment Details</h3>
              <div>
                {orderDetails.order.payments.length > 0 ? (
                  <>
                    <p>Status: {orderDetails.order.payments[0].status}</p>
                    <p>
                      Total without discount:{" "}
                      {orderDetails.order.payments[0].amountWithoutDiscount.toFixed(
                        2
                      )}{" "}
                      €
                    </p>
                    <p>
                      Discount applied:{" "}
                      {orderDetails.order.payments[0].discountAmount.toFixed(2)}{" "}
                      €
                    </p>
                    <p>
                      Total: {orderDetails.order.payments[0].amount.toFixed(2)}{" "}
                      €
                    </p>
                  </>
                ) : (
                  <p>No payment details available.</p>
                )}
              </div>

              {orderDetails.memberDetails.newCoupon && (
                <>
                  <Divider className="my-4" />
                  <h3 className="font-semibold text-lg mb-4">New Coupon</h3>
                  <p>
                    Your new coupon is:{" "}
                    <strong>
                      {orderDetails.memberDetails.newCoupon.displayName}
                    </strong>
                  </p>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </section>
  );
}
