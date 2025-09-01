import Profile from "@/components/Profile";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | NextCommerce Nextjs E-commerce template",
  description: "This is Profile Page for NextCommerce Template",
};

const ProfilePage = () => {
  return (
    <main>
      <Profile />
    </main>
  );
};

export default ProfilePage;
