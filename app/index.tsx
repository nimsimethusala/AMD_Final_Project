import React from 'react'
import { View, Text, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useFonts } from 'expo-font'
import { GradientText } from '@/styles/GradientText'

const Index = () => {
  const router = useRouter()

  return (
    <ImageBackground
      source={require('../assets/landing/landing1.jpeg')}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <View className="flex-1 justify-center items-center px-6">
        {/* Transparent Card */}
        <View
          className="w-full rounded-2xl p-6 justify-center items-center"
          style={{
            backgroundColor: 'rgba(2, 28, 18,0.55)',
            height: '80%',
            borderWidth: 2,
            borderColor: 'rgba(2, 247, 153,0.3)',
            shadowColor: '#03ff9a',
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 12,
            elevation: 6,
          }}
        >

          <GradientText text="𝐆𝐫𝐞𝐞𝐧" />
          <GradientText text="𝐆𝐚𝐫𝐝𝐞𝐧" />

          <TouchableOpacity
            style={{
              backgroundColor: '#011a01',
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 15,
              alignSelf: 'center',
              marginTop: 30,
              boxShadow: '0.5px 1px 10px 3px rgba(5, 250, 9, 0.5)',
            }}
            onPress={() => {
              router.push('/login')
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Click Me</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Index