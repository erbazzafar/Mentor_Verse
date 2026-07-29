"use client";
import React, { JSX, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import NotificationBell from "../NotificationBell";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress, scrollY } = useScroll();

  const { data: session, status } = useSession();

  const [visible, setVisible] = useState(true);

  const pathname = usePathname();

  const isActive = (link: string) =>
    link === "/" ? pathname === "/" : pathname === link || pathname.startsWith(`${link}/`);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (scrollY.get()! === 0) {
      setVisible(true);
      return;
    }
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "fixed inset-x-0 top-10 z-50 mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-transparent bg-white py-2 pl-8 pr-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] dark:border-white/[0.2] dark:bg-black",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative flex items-center space-x-1 text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300",
              isActive(navItem.link) && "text-black dark:text-white"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden text-sm sm:block">{navItem.name}</span>
            {isActive(navItem.link) && (
              <span className="absolute inset-x-0 -bottom-1 mx-auto h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            )}
          </Link>
        ))}
        {status === "authenticated" && session?.user ? (
        <>
        <NotificationBell />
          <button
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
            className="relative rounded-full border border-neutral-200 px-6 py-2 text-sm font-medium text-black dark:border-white/[0.2] dark:text-white"
          >
            <span>Logout</span>
            <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </button>
          </>
        ) : (
          <>
            {pathname !== "/login" && (
              <Link
                href="/login"
                className="relative w-28 text-center rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium text-black dark:border-white/[0.2] dark:text-white flex justify-center"
              >
                <span>Login</span>
                <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              </Link>
            )}
            {pathname !== "/register" && (
              <Link
                href="/register"
                className="relative w-28 text-center rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium text-black dark:border-white/[0.2] dark:text-white flex justify-center"
              >
                <span>Register</span>
                <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              </Link>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
