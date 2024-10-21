import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ProgressBarAndroid } from 'react-native';

const UserCard = ({ user, onEdit, onDelete, onPress }) => {
  const latestSalesProgress = user.salesProgress?.[user.salesProgress.length - 1]; // Get the latest month/year sales progress
  const target = latestSalesProgress ? latestSalesProgress.target : 0;
  const currentSales = latestSalesProgress ? latestSalesProgress.currentSales : 0;
  const progressPercentage = target > 0 ? (currentSales / target) * 100 : 0;

  return (
    <TouchableOpacity onPress={onPress} style={styles.userCard}>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.role}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar and sales info at the bottom */}
      <View style={styles.progressContainer}>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={progressPercentage / 100}
          color="#00bfff"
          style={styles.progressBar}
        />
        <Text style={styles.salesText}>
          Sales: {currentSales} / {target} ({Math.round(progressPercentage)}%)
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userDetails: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 16,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 10,
    justifyContent: 'center',
  },
  progressBar: {
    width: '100%', // Make the progress bar take the full width
    height: 8,
  },
  salesText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default UserCard;