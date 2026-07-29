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
import { mentorSchema, studentSchema } from "@/schemas/registerSchema";

// Define API response type
interface ApiResponse {
  success: boolean;
  message: string;
}

// Define validation schemas for mentor and student


export default function SignUpForm() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [textColor, setTextColor] = useState("text-red-500");
  const [interest, setInterest] = useState("");
  const [expertiseInput, setExpertiseInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(role === "mentor" ? mentorSchema : studentSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      expertise: [] as string[],
      availability: "",
      base_rate: "",
      bio: "",
      skills: "",
      education_level: "",
      interests: [] as string[],
    },
  });

  const { errors } = form.formState;

  const roles = ["mentor", "student"];
  const username = form.watch("username");

  // Debounce username input to avoid frequent API calls


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
      <p className="mt-2 px-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
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
              className=" block w-full p-2 border border-gray-300 rounded-md dark:border-neutral-700 dark:bg-black dark:text-white focus:ring-2 focus:ring-blue-500"
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
                <input
                  type="text"
                  name="prevent-autofill-username"
                  autoComplete="off"
                  style={{ display: "none" }}
                />
                <FormLabel>Username</FormLabel>
                <Input
                  {...field}
                  placeholder="Choose a username"
                  id="unique-username"
                  name="new-username"
                  autoComplete="new-password"
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
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="off"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 px-3 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </FormItem>
            )}
          />

          {/* Role Specific Fields */}
          {role === "mentor" ? (
            <>
              <FormField
                control={form.control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expertise</FormLabel>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter expertise"
                        value={expertiseInput} // Input value from local state
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && expertiseInput.trim()) {
                            form.setValue("expertise", [
                              ...(field.value || []), // Fallback to an empty array if undefined
                              expertiseInput.trim(),
                            ]);
                            setExpertiseInput(""); // Clear the input
                            e.preventDefault(); // Prevent form submission
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-gray-800 text-white rounded-md"
                        onClick={() => {
                          if (expertiseInput.trim()) {
                            form.setValue("expertise", [
                              ...(field.value || []),
                              expertiseInput.trim(),
                            ]);
                            setExpertiseInput(""); // Clear the input
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-2">
                      {/* Display added expertise items */}
                      {field.value &&
                        field.value.map((item: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-md mt-1"
                          >
                            <span>{item}</span>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => {
                                form.setValue(
                                  "expertise",
                                  field.value.filter((_, i) => i !== index)
                                );
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                    </div>
                    {errors.expertise && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.expertise.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Input {...field} placeholder="e.g. 2 video sessions per week/month" />
                    {errors.availability && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.availability.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="base_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Rate (RS)/Month</FormLabel>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Enter your base rate in RS per month"
                    />
                    {errors.base_rate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.base_rate.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <textarea
                      {...field}
                      placeholder="Tell us about yourself"
                      className="block w-full p-2 border border-gray-300 rounded-md dark:border-neutral-700 dark:bg-black dark:text-white focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                    {errors.bio && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.bio.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </>
          ) : (
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
                        className="px-3 py-2 bg-gray-800 text-white rounded-md"
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
                          className="flex items-center justify-between libg:gray-400 dark:bg-gray-800  p-2 rounded-md mt-1"
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
          )}

          <button
            className="relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white mt-4 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-neutral-600 dark:focus:ring-neutral-300"
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
