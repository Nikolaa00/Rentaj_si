"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { authService } from "@/services/authService";
import type { UserRole } from "@/types/auth";

export default function RegisterCard() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserRole>("DEALER");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: userType,
        location: formData.location || "Bitola",
      });

      authService.saveAuthData(response.token, response.user);

      if (response.user.role === "DEALER") {
        router.push("/dealer/dashboard");
      } else {
        router.push("/renter/dashboard");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Registration failed!";
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Card className="bg-[#E2FDFF] rounded-[50px] p-8 w-full min-w-[550px] max-w-[600px] border-3 border-[#407BFF] my-8">
      <CardHeader className="text-center gap-0">
        <CardTitle className="text-[#233B5D] gap-0 text-5xl font-black mb-8">
          Register
        </CardTitle>
        <CardDescription className="text-base gap text-gray-700 font-medium">
          <p className="text-black font-black text-2xl">Welcome to RentaSi!</p>
          <p className="text-black font-normal text-2xl">
            Fill out the form to rent or deal a vehicle
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* User Type Toggle */}
        <div className="flex gap-4 justify-center mb-8">
          <Button
            type="button"
            variant="dealer"
            onClick={() => setUserType("DEALER")}
            className={cn(
              userType === "DEALER" && "drop-shadow-xl",
              "m-0 text-2xl font-black"
            )}
          >
            Dealer
          </Button>
          <Button
            type="button"
            variant="renter"
            onClick={() => setUserType("RENTER")}
            className={cn(
              userType === "RENTER" && "drop-shadow-xl",
              "m-0 text-2xl font-black"
            )}
          >
            Renter
          </Button>
        </div>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col justify-center items-center"
        >
          <Input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            disabled={loading}
          />

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={loading}
          />

          <Input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            disabled={loading}
          />

          <Input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
          />

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            disabled={loading}
          />

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant="submit"
              className="m-0 text-2xl font-black"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}