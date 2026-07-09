import React, { useState } from "react";
import { InputField } from "../common/InputField";
import { Button } from "../common/Button";
import { useAuth } from "../../context";

export const RegisterForm = () => {
  const { signUp } = useAuth();
  const [registerStep, setRegisterStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    profile: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // THE MASTER GATEKEEPER:
  // The browser will ONLY let this function run if the HTML 'required' tags pass!
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // If browser let us get here on Step 1, the Name field is guaranteed valid.
    if (registerStep === 1) {
      setRegisterStep(2);
      return;
    }

    // If browser let us get here on Step 2, Email & Password are valid.
    setIsLoading(true);
    try {
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.profile,
      );
    } catch (err) {
      // Context handles toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* No 'noValidate' tag here! We WANT the browser doing the work */
    <form onSubmit={handleFormSubmit} className="space-y-6 w-full">
      {/* WINDOW 1 */}
      {registerStep === 1 && (
        <div className="space-y-2 animate-fade-in-up">
          <h1 className="text-3xl font-bold">ABOUT YOU</h1>

          <InputField
            id="name"
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />
          <InputField
            id="profile"
            label="Profile Image URL (Optional)"
            type="url"
            name="profile"
            value={formData.profile}
            onChange={handleInputChange}
            placeholder="https://example.com/avatar.png"
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="w-full">
              Next: Account Details &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* WINDOW 2 */}
      {registerStep === 2 && (
        <div className="space-y-2 animate-fade-in-up">
          <h1 className="text-3xl font-bold">CREATE LOGIN</h1>

          <InputField
            id="email"
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />

          <div className="flex gap-3 pt-2">
            {/* Back button MUST stay type="button" so it doesn't trigger a submit */}
            <Button
              type="button"
              onClick={() => setRegisterStep(1)}
              className="w-1/3 opacity-80"
              disabled={isLoading}
            >
              &larr; Back
            </Button>
            <Button type="submit" className="w-2/3" isLoading={isLoading}>
              Complete Sign Up
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};
