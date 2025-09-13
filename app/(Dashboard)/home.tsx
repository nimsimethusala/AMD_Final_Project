import FavoritePlantSection from '@/components/sections/favoritePlantSection';
import HeaderSection from '@/components/sections/headerSection';
import PlantCategories from '@/components/sections/plantCategories';
import React from 'react';
import { View, Text } from 'react-native';

const Home = () => {
  return (
    <View>
      <HeaderSection />
      <PlantCategories />
    </View>
  );
}

export default Home;