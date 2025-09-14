import HeaderSection from '@/components/sections/headerSection';
import PlantCategories from '@/components/sections/plantCategories';
import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <View>
      <HeaderSection />
      <PlantCategories />

      <TouchableOpacity
        onPress={async () => {
          await logout();
          router.replace("/");
        }}
        style={{
          backgroundColor: "red",
          padding: 12,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Home;