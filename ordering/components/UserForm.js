import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const UserForm = ({
  name, email, password, role, setName, setEmail, setPassword, setRole, target, setTarget, month, setMonth, year, setYear, onSave, onCancel, isEditing
}) => (
  <View style={styles.modalContainer}>
    {/* Close button at the top right */}
    <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
      <Text style={styles.closeButtonText}>X</Text>
    </TouchableOpacity>

    {/* Input fields */}
    <TextInput
      value={name}
      onChangeText={setName}
      placeholder="Name"
      style={styles.input}
      placeholderTextColor="#888"
    />
    <TextInput
      value={email}
      onChangeText={setEmail}
      placeholder="Email"
      style={styles.input}
      keyboardType="email-address"
      placeholderTextColor="#888"
    />
    <TextInput
      value={password}
      onChangeText={setPassword}
      placeholder="Password"
      style={styles.input}
      secureTextEntry
      placeholderTextColor="#888"
    />

    {/* Role selection */}
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Sales" value="sales" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>
    </View>

    {/* Monthly Target Input */}
    <Text style={styles.label}>Target for {month} {year}:</Text>
    <TextInput
      value={target.toString()}
      onChangeText={(value) => setTarget(value)}
      placeholder="Set Monthly Target"
      style={styles.input}
      keyboardType="numeric"
      placeholderTextColor="#888"
    />

    {/* Month selection */}
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={month}
        onValueChange={(itemValue) => setMonth(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="January" value="January" />
        <Picker.Item label="February" value="February" />
        <Picker.Item label="March" value="March" />
        <Picker.Item label="April" value="April" />
        <Picker.Item label="May" value="May" />
        <Picker.Item label="June" value="June" />
        <Picker.Item label="July" value="July" />
        <Picker.Item label="August" value="August" />
        <Picker.Item label="September" value="September" />
        <Picker.Item label="October" value="October" />
        <Picker.Item label="November" value="November" />
        <Picker.Item label="December" value="December" />
      </Picker>
    </View>

    {/* Year selection */}
    <TextInput
      value={year}
      onChangeText={setYear}
      placeholder="Year"
      style={styles.input}
      keyboardType="numeric"
      placeholderTextColor="#888"
    />

    {/* Save and Cancel buttons */}
    <TouchableOpacity style={styles.saveButton} onPress={onSave}>
      <Text style={styles.saveButtonText}>{isEditing ? 'Update User' : 'Create User'}</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
      <Text style={styles.cancelButtonText}>Cancel</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: 'center',
    position: 'relative',  // Ensure relative positioning for the close button
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: '#ff4d4d',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 5,  // Add shadow for better visibility
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  cancelButton: {
    width: '100%',
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default UserForm;