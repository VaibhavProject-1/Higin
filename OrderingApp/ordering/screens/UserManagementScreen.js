import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Modal, Alert, Button } from 'react-native';
import { API_BASE_URL, API_BASED_URL } from '../api/api';
import { useFocusEffect } from '@react-navigation/native';
import FloatingActionButton from '../components/FloatingActionButton';
import UserCard from '../components/UserCard';
import UserForm from '../components/UserForm';
import LiveLocationMap from '../components/LiveLocationMap';
import UserDetailsModal from '../components/UserDetailsModal';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);  // Modal for creating/editing users
  const [userDetailsVisible, setUserDetailsVisible] = useState(false);  // Modal for user details
  const [locationModalVisible, setLocationModalVisible] = useState(false);  // Modal for live location
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);  // Store selected user for details and location modals

  // Form fields for creating/editing users
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [originalPasswordHash, setOriginalPasswordHash] = useState('');
  const [role, setRole] = useState('user');
  const [target, setTarget] = useState('');  // Sales target
  const [month, setMonth] = useState('October');  // Default month (can be dynamically set)
  const [year, setYear] = useState(new Date().getFullYear().toString());  // Default year

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/list`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    // Initialize Socket.io connection
    const socketConnection = io(API_BASED_URL);  // Assuming API_BASE_URL is the correct base URL for your socket connection
    setSocket(socketConnection);

    // Listen for real-time location updates
    socketConnection.on('locationUpdate', (locationData) => {
      console.log('Location update received:', locationData);

      // Update the user with the new location data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === locationData.userId
            ? { ...user, location: { lat: locationData.lat, lng: locationData.lng } }
            : user
        )
      );
    });

    // Clean up the socket connection when the component is unmounted
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Fetch users whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  // Open the modal for creating or editing a user
  const openModal = (user = null) => {
    setIsEditing(!!user);
    if (user) {
      setCurrentUser(user);
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setPassword('');  // Keep the password field empty when editing, but track the original hashed password
      setTarget(user.target || '');  // Use the user's target or set empty string
      setOriginalPasswordHash(user.password); // Store the original hashed password for comparison
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      setTarget('');
    }
    setModalVisible(true);
  };  

  // Handle creating or editing a user
  const handleSaveUser = async () => {
    if (!name || !email || !role || !target || !month || !year) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    // Construct user data
    const userData = { name, email, role, target, month, year };
    // If password is changed (i.e., not equal to the original hash), include it
    if (password && password !== originalPasswordHash) {
      userData.password = password;  // Include the new password in userData
    }
    console.log('Sending user data to backend:', userData);  // Log the data being sent
  
    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem('token');
    try {
      let response;
      if (isEditing) {
        response = await fetch(`${API_BASE_URL}/users/edit/${currentUser._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
           },
          body: JSON.stringify(userData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/users/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
           },
          body: JSON.stringify(userData),
        });
      }
  
      const responseData = await response.json(); // Log backend response
      console.log('Backend response:', responseData);
  
      if (response.ok) {
        Alert.alert('Success', isEditing ? 'User updated successfully' : 'User created successfully');
        fetchUsers();  // Refresh user list after save
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to save user.');
      }
    } catch (error) {
      console.error('Error during user save:', error);  // Log any error that occurs
      Alert.alert('Error', 'Something went wrong.');
    }
  };
  

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/delete/${userId}`, { method: 'DELETE' });
      if (response.ok) {
        Alert.alert('Success', 'User deleted successfully');
        fetchUsers();
      } else {
        Alert.alert('Error', 'Failed to delete user.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  // Handle showing user details modal
  const handleUserPress = (user) => {
    console.log('Selected user data:', user); 
    setSelectedUser(user);  // Set the selected user
    setUserDetailsVisible(true);  // Show user details modal
  };

  // Render the user item in the list
  const renderUserItem = ({ item }) => (
    <UserCard
      user={item}
      onEdit={() => openModal(item)}
      onDelete={() => handleDeleteUser(item._id)}
      onPress={() => handleUserPress(item)}  // Handle user press for details modal
    />
  );

  return (
    <View style={styles.container}>
      {/* List of users */}
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.userList}
      />

      {/* Floating action button to add user */}
      <FloatingActionButton onPress={() => openModal()} />

      {/* Modal for creating/editing users */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <UserForm
            name={name}
            email={email}
            password={password}
            role={role}
            target={target}
            setTarget={setTarget}  // Pass the target state and setter
            month={month}  // Pass the current month
            setMonth={setMonth}  // Pass the setMonth handler
            year={year}  // Pass the current year
            setYear={setYear}  // Pass the setYear handler
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
            setRole={setRole}
            onSave={handleSaveUser}
            onCancel={() => setModalVisible(false)}
            isEditing={isEditing}
          />
        </View>
      </Modal>

      {/* Modal for user details */}
      {selectedUser && (
        <UserDetailsModal
          visible={userDetailsVisible}
          user={selectedUser}
          onClose={() => setUserDetailsVisible(false)}
          onShowLocation={() => {
            setUserDetailsVisible(false);
            setLocationModalVisible(true);
          }}
        />
      )}

      {/* Modal for live location */}
      {selectedUser && (
        <Modal visible={locationModalVisible} onRequestClose={() => setLocationModalVisible(false)} animationType="slide">
          <LiveLocationMap user={selectedUser} onClose={() => setLocationModalVisible(false)} />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  userList: {
    padding: 20,
    paddingBottom: 80, // Space for the FAB
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default UserManagementScreen;