import React, { useState } from "react";
import { InputField } from "../common/InputField";
import { Button } from "../common/Button";

export const RecoveryForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return;

    setIsLoading(true);
    try {
      // Reset logic
    } catch (err) {
      // Errors are already handled by the context toasts
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 w-full">
      <div className="space-y-2 animate-fade-in-up">
        <h1 className="text-3xl font-bold">RECOVER YOUR ACCOUNT</h1>
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
        <div className="flex gap-3 pt-2">
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Recover
          </Button>
        </div>
      </div>
    </form>
  );
};
