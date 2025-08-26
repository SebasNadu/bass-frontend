import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { useState } from "react";

export default function Login() {
  const [showSignUp, setShowSignUp] = useState(false);

  const toggleForm = () => {
    setShowSignUp((prev) => !prev);
  };

  return (
    <div className="form-container flex flex-col items-center justify-center">
      <button
        onClick={toggleForm}
        className="toggle-button py-4 cursor-pointer"
      >
        {showSignUp
          ? "Already have an account? Log in"
          : "Don’t have an account? Sign up"}
      </button>
      {showSignUp ? <SignUpForm /> : <LoginForm />}
    </div>
  );
}
