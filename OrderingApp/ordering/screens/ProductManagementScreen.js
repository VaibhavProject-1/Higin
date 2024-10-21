import React, {  useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { API_BASE_URL } from '../api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FAB } from 'react-native-paper'; // Import the FAB component
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const ProductManagementScreen = () => {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      setProducts(data); // Save fetched products in state
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Re-fetch products whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchProducts(); // Refetch products when screen comes back into focus
    }, [])
  );

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers:{
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        }
      });
      if (response.ok) {
        Alert.alert('Success', 'Product deleted successfully');
        setProducts(products.filter(product => product._id !== productId)); // Remove deleted product from state
      } else {
        Alert.alert('Error', 'Failed to delete product');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleEditProduct = (product) => {
    navigation.navigate('EditProductScreen', { product }); // Navigate to the edit screen with product data
  };

  const renderProductItem = ({ item }) => {
    const fullImageUrl = `${API_BASE_URL.replace('/api', '')}${item.imageUrl}`; // Construct the full image URL correctly
    return (
      <View style={styles.productCard}>
        <Image source={{ uri: fullImageUrl }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEditProduct(item)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProduct(item._id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Product Management</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.productList}
      />
      
      {/* Floating Action Button for adding new products */}
      <FAB
        style={styles.fab}
        icon="plus"
        color="white"
        onPress={() => navigation.navigate('AddProductScreen')} // Navigate to AddProductScreen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200EE', // Customize the color of the FAB
  },
});

export default ProductManagementScreen;