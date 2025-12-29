"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconWorldQuestion } from "@tabler/icons-react";
import slugify from "@/utils/slugify";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Questions",
      link: "/questions",
      icon: <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },{
      name: "Mentors",
      link: "/mentors",
      icon: <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "FAQ",
      link: "/mentors",
      icon: <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  if (status === "authenticated" && session?.user) {
    navItems.push({
      name: "Profile",
      link: `/users/${session.user._id}/${slugify(session.user.username)}`,
      icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
    });
  }

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}
