import React from 'react';
import { View, Text, Modal, Button, StyleSheet } from 'react-native';

const UserDetailsModal = ({ visible, user, onClose, onShowLocation }) => {
  // Get the current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Safely access the sales progress array, defaulting to an empty array if undefined
  const progress = user.salesProgress ? user.salesProgress.find((prog) => prog.month === currentMonth) : null;

  // Safely access the location data
  const location = user.location || null;
  console.log("From details card: ",location);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>User Details</Text>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Role: {user.role}</Text>

          {/* Display current month's target and sales progress */}
          {progress ? (
            <>
              <Text>Target for {currentMonth}: ${progress.target}</Text>
              <Text>Current Sales: ${progress.currentSales}</Text>
            </>
          ) : (
            <Text>No sales data for this month.</Text>
          )}

          {/* Display live location */}
          {location ? (
            <View>
              {/* <Text>Live Location:</Text>
              <Text>Latitude: {location.lat}</Text>
              <Text>Longitude: {location.lng}</Text> */}

              {/* Button to show live location on a map */}
              <View style={styles.buttonContainer}>
                <Button title="Show Live Location on Map" onPress={onShowLocation} color="#007bff" />
              </View>
            </View>
          ) : (
            <Text>No live location data available.</Text>
          )}

          {/* Close button */}
          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={onClose} color="#ff4d4d" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 15,
  },
});

export default UserDetailsModal;