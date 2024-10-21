import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { API_BASE_URL } from '../api/api'; // Import the API URL

const CustomerManagementScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  // Fetch customers when the screen loads
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch customers');
    }
  };

  const handleCreateOrUpdateCustomer = async () => {
    const customerData = { name, email, phoneNumber: phone, address };

    try {
      const response = editingCustomerId
        ? await fetch(`${API_BASE_URL}/customers/${editingCustomerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData),
          })
        : await fetch(`${API_BASE_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData),
          });

      if (response.ok) {
        Alert.alert('Success', `Customer ${editingCustomerId ? 'updated' : 'created'} successfully`);
        fetchCustomers(); // Refresh customer list
        resetForm();
      } else {
        Alert.alert('Error', `Failed to ${editingCustomerId ? 'update' : 'create'} customer`);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleEditCustomer = (customer) => {
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phoneNumber);
    setAddress(customer.address);
    setEditingCustomerId(customer._id);
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Success', 'Customer deleted successfully');
        fetchCustomers(); // Refresh customer list
      } else {
        Alert.alert('Error', 'Failed to delete customer');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setEditingCustomerId(null);
  };

  const renderCustomerItem = ({ item }) => (
    <View style={styles.customerItem}>
      <Text>{item.name}</Text>
      <Text>{item.email}</Text>
      <Text>{item.phoneNumber}</Text>
      <Text>{item.address}</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={() => handleEditCustomer(item)} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteCustomer(item._id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone"
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        style={styles.input}
      />

      <Button
        title={editingCustomerId ? 'Update Customer' : 'Create Customer'}
        onPress={handleCreateOrUpdateCustomer}
      />

      <FlatList
        data={customers}
        keyExtractor={(item) => item._id}
        renderItem={renderCustomerItem}
        contentContainerStyle={styles.customerList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2, // Add shadow effect
  },
  customerItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3, // Shadow effect
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CustomerManagementScreen;