import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { plantCategories } from '@/constants/sampleData'
import { LinearGradient } from 'expo-linear-gradient'

const PlantCategories = () => {
  const [categories] = useState(plantCategories)

  return (
    <View>
      <Text style={styles.heading}>Plant Categories</Text>
        {/* Render plant categories here */}
        {categories.map(category => (
          <View key={category.id}>
           <LinearGradient style={styles.linearGradient} colors={['#72f7d1', '#014a35', '#001a12']}>
            <TouchableOpacity>
                <Text style={styles.buttonText}>{category.name}</Text>
            </TouchableOpacity>
           </LinearGradient> 
          </View>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    heading: {
        marginTop: 30,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#001a12',
        marginBottom: 10,
        textAlign: 'left',
        paddingLeft: 10,
    },
    linearGradient: {
        margin: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        width: '80%',
        alignSelf: 'center',
        borderRadius: 50,
        flexDirection: 'column',
    },
})

export default PlantCategories