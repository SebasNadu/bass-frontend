import type { AchievementDTO } from "./AchievementDTO";
import type { CouponDTO } from "./CouponDTO";

export interface MemberProfileDTO {
  name: string;
  email: string;
  streak: number;
  achievements: AchievementDTO[];
  coupons: CouponDTO[];
}
