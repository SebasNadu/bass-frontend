import type { AchievementDTO } from "./AchievementDTO";
import type { CouponDTO } from "./CouponDTO";

export interface MemberProfileDTO {
  name: string;
  email: string;
  streak: number;
  testimonial: string;
  achievements: AchievementDTO[];
  coupons: CouponDTO[];
  days: { dayOfWeek: string }[];
}
