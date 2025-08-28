import {
  Accordion,
  AccordionItem,
  Tooltip,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";

import type { MemberProfileDTO } from "@/types";

interface Props {
  profile: MemberProfileDTO;
}

export default function ProfileAccordion({ profile }: Props) {
  const itemClasses = {
    base: "py-1 w-full",
    title: "font-medium text-lg",
    trigger:
      "px-2 py-1 data-[hover=true]:bg-default-100 rounded-md h-10 flex items-center",
    indicator: "text-small",
    content: "text-base px-2 py-2",
  };

  return (
    <Accordion
      className="p-2 flex flex-col gap-2"
      variant="bordered"
      itemClasses={itemClasses}
    >
      {/* Coupons */}
      <AccordionItem
        key="1"
        aria-label="Coupons"
        title="Coupons"
        subtitle={`${
          profile.coupons.filter((c) => c.isValid).length
        } available`}
      >
        <div className="flex flex-wrap gap-2">
          {profile.coupons
            .filter((coupon) => coupon.isValid)
            .map((coupon) => (
              <Tooltip
                key={coupon.id}
                content={
                  <div className="px-2 py-1">
                    <p className="text-small font-bold">
                      {coupon.discountType}
                    </p>
                    <p className="text-tiny">
                      Amount:
                      {coupon.discountType != "FIXED_AMOUNT"
                        ? "€" + coupon.discountAmount
                        : coupon.discountValue + "%"}
                    </p>
                  </div>
                }
              >
                <span className="cursor-pointer bg-primary-100 text-primary px-2 py-1 rounded-md text-xs font-medium">
                  {coupon.displayName}
                </span>
              </Tooltip>
            ))}
          {profile.coupons.filter((c) => c.isValid).length === 0 && (
            <p className="text-xs text-default-400">No valid coupons</p>
          )}
        </div>
      </AccordionItem>

      {/* Achievements */}
      <AccordionItem
        key="2"
        aria-label="Achievements"
        title="Achievements"
        subtitle={`${profile.achievements.length} earned`}
      >
        <div className="flex flex-wrap gap-3">
          {profile.achievements.map((ach, idx) => (
            <Popover key={idx} showArrow offset={6} placement="bottom">
              <PopoverTrigger>
                <Avatar
                  isBordered
                  radius="full"
                  src={ach.imageUrl ?? undefined}
                  name={ach.name}
                  className="cursor-pointer w-12 h-12"
                />
              </PopoverTrigger>
              <PopoverContent className="px-2 py-1">
                <p className="text-tiny font-medium">{ach.name}</p>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </AccordionItem>
    </Accordion>
  );
}
