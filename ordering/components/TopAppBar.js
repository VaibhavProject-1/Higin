import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TopAppBar = ({ title }) => (
  <View style={styles.container}>
    {/* Wrap the title prop in a <Text> component */}
    <Text style={styles.title}>{title}</Text> 
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TopAppBar;