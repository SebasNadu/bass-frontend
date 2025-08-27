import { Form, Input, Button } from "@heroui/react";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/members/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed, please check your credentials");
      }

      const data = await response.json();
      console.log(data);
      const token = data.accessToken;

      if (token) {
        login(token);
        console.log("Token saved in context:", token);
        navigate("/home");
      } else {
        throw new Error("Token not found in response.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      className="w-full max-w-xs"
      validationBehavior="aria"
      onSubmit={onSubmit}
    >
      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        validate={(value) => {
          if (!value.includes("@")) {
            return "It must be a valid email";
          }
        }}
      />
      <Input
        isRequired
        label="Password"
        labelPlacement="outside"
        name="password"
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        validate={(value) => {
          if (value.length === 0) {
            return "Introduce a valid password";
          }
        }}
      />

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <div className="w-full flex flex-col items-center justify-center">
        <Button
          color="primary"
          type="submit"
          variant="ghost"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Submit"}
        </Button>
      </div>
    </Form>
  );
}
