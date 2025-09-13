import { View, Text, ImageBackground, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const Login = () => {
  const handleLogin = () => {
    // Handle login logic here
    router.push('/(Dashboard)/home');
  }

  return (
    <ImageBackground
      source={require('../../assets/landing/authImage.jpeg')}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <View className='flex-1 w-full justify-center items-center'>
        <View className='w-full px-6 justify-center items-center' 
          style={{
            backgroundColor: 'rgba(3, 227, 252,0.25)', 
            height: '75%', 
            width: '90%',
            borderColor: 'rgba(0, 26, 24, 2)', 
            borderRadius: 40, 
          }}
        >
          <Text
            style={{
              color: '#ffffff',
              padding: 0,
              fontSize: 24,
              fontWeight: '700',
              textAlign: 'center',
              textShadowColor: '#001a19',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 1,
            }}
          >
            Welcome to the Login Screen
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#ffffff"
            style={{
              backgroundColor: 'rgba(3, 179, 255, 0.5)',
              borderRadius: 10,
              padding: 12,
              marginTop: 55,
              marginBottom: 12,
              width: '95%',
              color: '#ffffff',
              borderColor: '#ffffff',
              borderWidth: 0.5,
              boxShadow: '0px 6px 7px rgba(0, 0, 0, 6)',
            }}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#ffffff"
            secureTextEntry={true}
            style={{
              backgroundColor: 'rgba(3, 179, 255, 0.5)',
              borderRadius: 10,
              padding: 12,
              marginTop: 30,
              marginBottom: 12,
              width: '95%',
              color: '#ffffff',
              borderColor: '#ffffff',
              borderWidth: 0.5,
              boxShadow: '0px 6px 7px rgba(0, 0, 0, 6)',
            }}
          />

          <TouchableOpacity
            style={{
              backgroundColor: '#001414',
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 15,
              alignSelf: 'center',
              marginTop: 40,
              boxShadow: '0.5px 1px 10px 3px rgba(0, 255, 247, 0.5)',
            }}

            onPress={handleLogin}
          >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Login</Text>
          </TouchableOpacity>

          <Pressable 
            onPress={() => {router.push('/signup')}} 
            style={{ marginTop: 25 }}
            >
            <Text 
              style={{ 
                color: '#ffffff', 
                fontWeight: '500', 
                fontSize: 13,
                textDecorationLine: 'underline' 
                }}
            >
              Don't have an account? Register
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Login