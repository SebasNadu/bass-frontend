export interface CouponDTO {
  id: number;
  code: string;
  displayName: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  validityDays: number;
  isValid: boolean;
  expiresAt?: string | null;
}
