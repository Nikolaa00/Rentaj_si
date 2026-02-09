"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { authService } from "@/services/authService";

export default function LoginCard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      authService.saveAuthData(response.token, response.user);

      if (response.user.role === "DEALER") {
        router.push("/dealer/dashboard");
      } else {
        router.push("/renter/dashboard");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Login failed!";
      setError(errorMessage);
      console.error("Login error:", err);
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

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <Card className="bg-[#E2FDFF] rounded-[50px] p-8 w-full min-w-[550px] max-w-[600px] border-3 border-[#407BFF] my-8">
      <CardHeader className="text-center gap-0">
        <CardTitle className="text-[#233B5D] gap-0 text-5xl font-black mb-8">
          Login
        </CardTitle>
        <CardDescription className="text-base gap text-gray-700 font-medium">
          <p className="text-black font-black text-2xl">
            Welcome back to RentaSi!
          </p>
          <p className="text-black font-normal text-2xl">
            Fill out the form to rent or deal a vehicle
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex flex-col justify-center items-center">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center w-full">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4 flex flex-col items-center">
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
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="mb-6"
          />

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
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

      <CardFooter className="flex justify-center items-center">
        <button
          onClick={handleRegisterClick}
          className="text-[#55627D] text-2xl font-semibold hover:underline transition-all"
          disabled={loading}
        >
          Register
        </button>
      </CardFooter>
    </Card>
  );
}