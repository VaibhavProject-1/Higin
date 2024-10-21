import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { API_BASE_URL, API_BASED_URL } from '../api/api'; // Assuming this contains your API base URL
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const OrderReviewScreen = ({ route, navigation }) => {
  const { customer, selectedProducts, salesOfficerId } = route.params; // Get salesOfficerId from params
  const [location, setLocation] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(customer || null); // Allow for preselected customer

  useEffect(() => {
    // Log the passed parameters to verify data
    console.log('Customer:', customer);
    console.log('Sales Officer ID:', route.params.salesOfficerId); // Log salesOfficerId to verify it's correct
  }, []);
  

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/customers`);
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch customers.');
      }
    };
    fetchCustomers();
  }, []);

  // Fetch location
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    };
    getLocation();
  }, []);

  const totalAmount = selectedProducts.reduce((total, product) => {
    const price = product.quotedPrice || product.product.price;
    return total + price * product.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    if (!location) {
      Alert.alert('Error', 'Could not fetch location.');
      return;
    }
    if (!selectedCustomer) {
      Alert.alert('Error', 'Please select a customer.');
      return;
    }
    if (!selectedCustomer) {
      Alert.alert('Error', 'Please select a customer.');
      return;
    }

    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem('token');

    const orderData = {
      customerId: selectedCustomer._id,
      salesOfficer: route.params.salesOfficerId, // Pass the salesOfficerId here
      products: selectedProducts.map(product => ({
        product: product.product._id,
        quantity: product.quantity,
        quotedPrice: product.quotedPrice || product.product.price,
      })),
      total: totalAmount,
      location,
    };

    // Log the order data before sending it
    console.log('Order data being sent:', orderData);

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
        body: JSON.stringify(orderData),
      });

      const responseText = await response.text(); // Log raw response text
      console.log('Raw response:', responseText);

      if (response.ok) {
        Alert.alert('Order placed successfully!');
        navigation.navigate('CustomerList');
      } else {
        console.error('Error response:', responseText); // Log raw error response
        Alert.alert('Error', 'Failed to place order.');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const renderProductItem = ({ item }) => {
    const fullImageUrl = `${API_BASED_URL}${item.product.imageUrl}`;
    const priceToDisplay = item.quotedPrice || item.product.price;

    return (
      <View style={styles.productCard}>
        <Image source={{ uri: fullImageUrl }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.product.name}</Text>
          <Text style={styles.productPrice}>Price: ${priceToDisplay.toFixed(2)}</Text>
          <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Customer Picker */}
      <Text style={styles.label}>Select a customer:</Text>
      <Picker
        selectedValue={selectedCustomer}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
      >
        <Picker.Item label="Select Customer" value={null} />
        {customers.map((customer) => (
          <Picker.Item key={customer._id} label={customer.name} value={customer} />
        ))}
      </Picker>

      {/* Product List */}
      <FlatList
        data={selectedProducts}
        keyExtractor={(item) => item.product._id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.productList}
      />

      {/* Total Amount */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: '#888',
  },
  totalContainer: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  placeOrderButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  placeOrderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default OrderReviewScreen;