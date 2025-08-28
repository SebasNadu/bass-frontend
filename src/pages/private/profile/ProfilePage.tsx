import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Avatar,
  Badge,
  Divider,
  CardBody,
  Button,
  Tooltip,
} from "@heroui/react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { BASE_URL } from "@/config/api";
import type { MemberProfileDTO } from "@/types";
import ProfileAccordion from "./components/ProfileAccordion";
import defaultProfile from "@/assets/default_profile.png";
import shakira from "@/assets/shakira.png";

export default function MemberCard() {
  const [profile, setProfile] = useState<MemberProfileDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/members/me`, {
          headers: {
            Authorization: isAuthenticated ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data: MemberProfileDTO = await res.json();
        setProfile(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, token]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!profile) return null;

  // Pick avatar depending on name
  const avatarSrc =
    profile.name.toLowerCase() === "shakira" ? shakira : defaultProfile;

  return (
    <div className="flex flex-col items-center p-6 space-y-8">
      {/* User Info Card */}
      <div className="flex justify-center">
        <Card className="max-w-[420px] shadow-md">
          <CardHeader className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                isBordered
                radius="full"
                size="lg"
                src={avatarSrc}
                name={profile.name}
              />
              <div className="">
                <h2 className="text-lg font-semibold text-default-700 text-start">
                  {profile.name}
                </h2>
                <p className="text-small text-default-500">{profile.email}</p>
              </div>
              <div className="flex flex-col pl-8">
                <Badge color="danger" content={profile.streak} shape="circle">
                  <Tooltip content="Streaks" color="primary">
                    <Button
                      isIconOnly
                      aria-label="Streak"
                      radius="full"
                      variant="light"
                      size="lg"
                    >
                      <p className="text-3xl">🔥</p>
                    </Button>
                  </Tooltip>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>Make beautiful streak.</p>
          </CardBody>
          <Divider />
        </Card>
      </div>

      {/* Coupons & Achievements Accordion */}
      <section className="w-3/6">
        <ProfileAccordion profile={profile} />
      </section>

      <NavLink to="/orders" className="text-secondary">
        <Button aria-label="Streak" color="primary">
          Order History
        </Button>
      </NavLink>
    </div>
  );
}
