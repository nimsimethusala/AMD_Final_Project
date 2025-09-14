// app/index.tsx
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { GradientText } from "@/styles/GradientText";

const Index = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/landing/landing1.jpeg")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <View className="flex-1 justify-center items-center px-6">
        <View
          className="w-full rounded-2xl p-6 justify-center items-center"
          style={{
            backgroundColor: "rgba(2, 28, 18,0.55)",
            height: "80%",
            borderWidth: 2,
            borderColor: "rgba(2, 247, 153,0.3)",
          }}
        >
          <GradientText text="𝐆𝐫𝐞𝐞𝐧" />
          <GradientText text="𝐆𝐚𝐫𝐝𝐞𝐧" />

          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={{
              backgroundColor: "#011a01",
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 15,
              marginTop: 30,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/signup")}
            style={{
              backgroundColor: "#011a01",
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 15,
              marginTop: 15,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
              Signup
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Index;