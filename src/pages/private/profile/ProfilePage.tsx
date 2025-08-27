import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { useAuth } from "../../../hooks/useAuth";

type Member = {
  name: string;
  email: string;
  achievements: string[];
  coupons: string[];
};

export default function MemberCard() {
  const { token } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/members/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch member info");
        }

        const data = await response.json();
        setMember(data);
        console.log(data);
      } catch (err) {
        setError("Unable to load member information.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMember();
  }, [token]);

  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md font-semibold">
            {loading ? "Loading..." : member?.name || "No Name"}
          </p>
          <p className="text-small text-default-500">
            {loading ? "" : member?.email || "No Email"}
          </p>
        </div>
      </CardHeader>

      <Divider />

      <CardBody>
        {error && <p className="text-red-500">{error}</p>}

        {!loading && member && (
          <>
            <div>
              <h4 className="font-semibold mb-1">Achievements</h4>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-1">Coupons</h4>
            </div>
          </>
        )}
      </CardBody>
      <Divider />

      <CardFooter></CardFooter>
    </Card>
  );
}
