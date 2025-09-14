// app/_layout.tsx
import React from "react";
import { Slot } from "expo-router";
import "../global.css";
import { AuthProvider } from "@/context/AuthContext";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
};

export default RootLayout;