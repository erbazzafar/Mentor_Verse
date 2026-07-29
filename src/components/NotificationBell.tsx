"use client";

import React, { useEffect, useState } from "react";
import { IconBell } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import axios from "axios";

const NotificationBell = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session?.user?._id) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/api/notifications?userId=${session.user._id}`);
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.notifications?.filter((n: any) => !n.isRead).length || 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [session?.user?._id]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.post(`/api/notifications/mark-read`, { userId: session?.user?._id });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        id="notification-bell"
        className="relative flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown((prev) => !prev);
        }}
      >
        <IconBell className="h-6 w-6 text-gray-800 dark:text-gray-200" />
        {/* 🔴 Show red dot if there are unread notifications */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-white text-xs"></span>
        )}
      </button>

      {/* 📩 Notifications Dropdown */}
      {showDropdown && (
        <div
          id="notification-dropdown"
          className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 shadow-lg rounded-md z-50 border border-gray-200 dark:border-gray-700"
        >
          <div className="p-4 text-sm font-medium text-gray-800 dark:text-white flex justify-between items-center">
            Notifications
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-500 text-xs hover:underline"
              >
                Mark All as Read
              </button>
            )}
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification._id} className={`p-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${notification.isRead ? "text-gray-500" : "font-bold text-gray-900 dark:text-white"}`}>
                  {notification.message}
                </li>
              ))
            ) : (
              <li className="p-3 text-sm text-gray-500 dark:text-gray-400">
                No new notifications.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
