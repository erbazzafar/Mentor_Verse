"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { useToast } from "@/components/ui/use-toast";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isResending, setIsResending] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeRemaining]);

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/users/verify", {
        username: decodeURIComponent(params.username),
        code: data.code,
        action: "verify",
      });

      console.log("Verification response:", response.data);

      if (response.data.success) {
        // Show success toast message
        toast({
          title: "Success",
          description: "Verification successful. You can now login.",
          variant: "default", // Assuming your UI component supports variants like success
        });
      }


      router.replace("/login");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;

      form.setError("code", {
        type: "manual",
        message:
          axiosError.response?.data.message || "An error occurred. Please try again.",
      });
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await axios.post("/api/users/verify", {
        username: decodeURIComponent(params.username),
        action: "resend",
      });
      setTimeRemaining(60); // Set a cooldown timer of 60 seconds
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      form.setError("code", {
        type: "manual",
        message:
          axiosError.response?.data.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md border border-gray-300 shadow-lg bg-white p-6 dark:border-neutral-700 dark:bg-black dark:shadow-input md:rounded-2xl md:p-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-800 dark:text-gray-200">
          Verify Your Account
        </h1>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Enter the verification code sent to your email
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Verification Code Input */}
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <Input
                  {...field}
                  placeholder="Enter the 6-digit code"
                  autoComplete="off"
                  className="dark:text-gray-200 dark:bg-gray-700"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button type="submit" className="relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white mt-4 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-neutral-600 dark:focus:ring-neutral-300"
            >
            Verify
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center">
        <Button
          onClick={handleResend}
          className="relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white mt-4 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-neutral-600 dark:focus:ring-neutral-300"
            disabled={isResending || timeRemaining > 0}
        >
          {isResending
            ? "Resending..."
            : timeRemaining > 0
            ? `Resend Code in ${timeRemaining}s`
            : "Resend Code"}
        </Button>
      </div>
    </div>
  );
}
