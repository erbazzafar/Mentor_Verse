/*

Have to this page for Admin


*/
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define API response type
interface ApiResponse {
  success: boolean;
  message: string;
}

// Define validation schemas for mentor and student
const mentorSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
  expertise: z.string().min(1, "Expertise is required"),
  availability: z.string().min(1, "Availability is required"),
  base_rate: z.string().min(1, "Base rate is required"),
  bio: z.string().optional(),
  skills: z.string().optional(),
});

const studentSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
  education_level: z.string().min(1, "Education level is required"),
  interests: z
    .array(z.string().min(1, "Interest cannot be empty"))
    .nonempty("At least one interest is required"),
});

export default function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [textColor, setTextColor] = useState("text-red-500");
  const [interest, setInterest] = useState("");

  const form = useForm({
    resolver: zodResolver(role === "mentor" ? mentorSchema : studentSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      expertise: "",
      availability: "",
      base_rate: "",
      bio: "",
      skills: "",
      education_level: "",
      interests: [] as string[],
    },
  });

  const roles = ["mentor", "student"];
  const username = form.watch("username");

  // Debounce username input to avoid frequent API calls
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setTextColor(
            response.status === 200 ? "text-green-500" : "text-red-500"
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setTextColor("text-red-500");
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        }
      }
    };
    const timer = setTimeout(checkUsernameUnique, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const onSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);

    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/users/signup-${role}`, data);
      console.log("Sign-up response:", response.data);
      router.replace(`/verify/${encodeURIComponent(data.username)}`);
    } catch (error) {
      console.error("Error during sign-up:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      form.setError("email", {
        message: axiosError.response?.data.message ?? "An error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-14 mx-auto w-full max-w-md border border-gray-300 shadow-lg bg-white p-6 dark:border-neutral-700 dark:bg-black dark:shadow-input md:rounded-2xl md:p-8">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Register to MentorVerse
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Sign up to MentorVerse <br /> If you already have an account,{" "}
        <Link href="/login" className="text-orange-500 hover:underline">
          Login
        </Link>{" "}
        with MentorVerse
      </p>

      <FormProvider {...form}>
        <form className="my-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-6">
            <FormLabel>Select Role</FormLabel>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md dark:border-neutral-700 dark:bg-black dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {roles.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <Input
                  {...field}
                  placeholder="Choose a username"
                  autoComplete="off"
                />
                <p className={`text-sm mt-1 ${textColor}`}>{usernameMessage}</p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <Input
                  {...field}
                  placeholder="yourname@example.com"
                  autoComplete="off"
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                />
              </FormItem>
            )}
          />

          {role === "student" ? (
            <>
              <FormField
                control={form.control}
                name="education_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level</FormLabel>
                    <Input
                      {...field}
                      placeholder="Enter your education level"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter interests"
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && interest.trim()) {
                            form.setValue("interests", [
                              ...field.value,
                              interest.trim(),
                            ]);
                            setInterest("");
                            e.preventDefault();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-blue-600 text-white rounded-md"
                        onClick={() => {
                          if (interest.trim()) {
                            form.setValue("interests", [
                              ...field.value,
                              interest.trim(),
                            ]);
                            setInterest("");
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-2">
                      {field.value.map((item: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-blue-100 dark:bg-gray-800  p-2 rounded-md mt-1"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() => {
                              form.setValue(
                                "interests",
                                field.value.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </>
          ) : null}

          <button
            className="w-full bg-blue-600 text-white p-2 rounded-md"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign up →"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
