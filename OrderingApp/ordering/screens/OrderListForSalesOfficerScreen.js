import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Alert } from 'react-native';
import { API_BASE_URL } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderListForSalesOfficerScreen = () => {
  const [orders, setOrders] = useState([]);
  const [salesOfficerId, setSalesOfficerId] = useState(null);

  // Fetch Sales Officer ID from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchSalesOfficerId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId'); // Assume userId is stored as the logged-in user's ID
        setSalesOfficerId(id);
        fetchOrders(id); // Fetch orders for the specific sales officer
      } catch (error) {
        console.error('Error fetching sales officer ID:', error);
        Alert.alert('Error', 'Failed to retrieve user information');
      }
    };

    fetchSalesOfficerId();
  }, []);

  // Fetch orders for the logged-in sales officer
  const fetchOrders = async (salesOfficerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/sales-officer/${salesOfficerId}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders.');
    }
  };

  const renderOrderItem = ({ item }) => {
    const { customer, products, total, status, date } = item;
    const productNames = products.map((p) => p.product.name).join(', ');

    return (
      <View style={styles.orderCard}>
        <Text style={styles.customerName}>Customer: {customer.name}</Text>
        <Text style={styles.products}>Products: {productNames}</Text>
        <Text style={styles.total}>Total: ${total}</Text>
        <Text style={styles.status}>Status: {status}</Text>
        <Text style={styles.date}>Date: {new Date(date).toLocaleDateString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.orderList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  products: {
    fontSize: 14,
    marginVertical: 5,
  },
  total: {
    fontSize: 14,
    fontWeight: '500',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginTop: 10,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  orderList: {
    paddingBottom: 20,
  },
});

export default OrderListForSalesOfficerScreen;