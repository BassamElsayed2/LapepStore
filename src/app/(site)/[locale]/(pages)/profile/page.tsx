import React from "react";
import Profile from "@/components/Profile";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | NextCommerce E-commerce",
  description: "Manage your profile information and settings",
};

const ProfilePage = () => {
  return (
    <>
      <Profile />
    </>
  );
};

export default ProfilePage;

