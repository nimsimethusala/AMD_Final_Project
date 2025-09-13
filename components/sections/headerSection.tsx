import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const HeaderSection = () => {
  return (
    <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.appName}>Hello, Nimsi</Text>
            <Text style={styles.tagline}>Increase your natural beauty</Text>
        </View>
            
        {/* Search Bar */}
        {/* <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search Plant</Text>
        </View> */}
        
    </View>
  )
}

const styles = StyleSheet.create({
    header: {
    backgroundColor: '#001a12',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  appName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchPlaceholder: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
})

export default HeaderSection