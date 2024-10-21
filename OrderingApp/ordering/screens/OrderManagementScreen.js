import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL, API_BASED_URL } from '../api/api'; // Assuming you have the base URL for product images
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderManagementScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // For storing the selected order to edit
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal

  // Fetch User ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
        } else {
          Alert.alert('Error', 'User not found, please log in again.');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserId();
  }, [navigation]);

  
  // Fetch all orders when screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/orders`);
          const data = await response.json();
          setOrders(data);
        } catch (error) {
          console.error('Error fetching orders:', error);
          Alert.alert('Error', 'Failed to fetch orders.');
        }
      };
      fetchOrders();
    }, [])
  );

  

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {

      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      Alert.alert('Success', 'Order status updated successfully.');
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status.');
    }
  };

  // Open the modal with the selected order's data
  const openEditModal = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  // Handle updating the order in the modal
  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders/${selectedOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
        body: JSON.stringify(selectedOrder),
      });

      if (response.ok) {
        Alert.alert('Success', 'Order updated successfully.');
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id ? selectedOrder : order
          )
        );
        setModalVisible(false); // Close the modal after success
      } else {
        Alert.alert('Error', 'Failed to update order.');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const renderOrderItem = ({ item }) => {
    const { customer, products, total, status, _id } = item;
    const productNames = products.map((p) => p.product.name).join(', ');

    return (
      <View style={styles.orderCard}>
        <Text style={styles.customerName}>Customer: {customer.name}</Text>
        <Text style={styles.products}>Products: {productNames}</Text>
        <Text style={styles.total}>Total: ${total}</Text>
        <Text style={styles.status}>Status: {status}</Text>

        <View style={styles.actionsContainer}>
          {/* Status Update Dropdown */}
          <Picker
            selectedValue={status}
            style={styles.picker}
            onValueChange={(value) => handleStatusChange(_id, value)}
          >
            <Picker.Item label="PENDING" value="PENDING" />
            <Picker.Item label="COMPLETED" value="COMPLETED" />
            <Picker.Item label="REFUNDED" value="REFUNDED" />
            <Picker.Item label="CANCELLED" value="CANCELLED" />
          </Picker>

          {/* Edit Button to open modal */}
          <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
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

      {/* Modal for editing the order */}
      {selectedOrder && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Order</Text>
              <Text style={styles.label}>Customer: {selectedOrder.customer.name}</Text>
              <Text style={styles.label}>Total: ${selectedOrder.total}</Text>

              <FlatList
                data={selectedOrder.products}
                keyExtractor={(item) => item.product._id}
                renderItem={({ item }) => (
                  <View style={styles.productContainer}>
                    {/* Product Image */}
                    <Image
                      source={{ uri: `${API_BASED_URL}${item.product.imageUrl}` }} // Display product image
                      style={styles.productImage}
                    />
                    <View style={styles.productDetails}>
                      {/* Product Name */}
                      <Text style={styles.productName}>{item.product.name}</Text>
                      {/* Product Quantity with label */}
                      <Text style={styles.productQuantityLabel}>Quantity:</Text>
                      <TextInput
                        style={styles.quantityInput}
                        value={item.quantity.toString()}
                        onChangeText={(value) => {
                          const updatedProducts = selectedOrder.products.map((p) =>
                            p.product._id === item.product._id
                              ? { ...p, quantity: parseInt(value) }
                              : p
                          );
                          setSelectedOrder({ ...selectedOrder, products: updatedProducts });
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                )}
              />

              <TouchableOpacity style={styles.updateButton} onPress={handleUpdateOrder}>
                <Text style={styles.updateButtonText}>Update Order</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  picker: {
    width: 150,
    height: 40,
  },
  editButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  orderList: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productQuantityLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  quantityInput: {
    borderBottomWidth: 1,
    padding: 5,
    marginTop: 5,
    width: 60,
  },
  updateButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#FF5555',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default OrderManagementScreen;