import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Use expo-image-picker
import { API_BASE_URL } from '../api/api';

const AddProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [imageUri, setImageUri] = useState(null);

  // Function to request permissions and pick image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };  

  const handleAddProduct = async () => {
    if (!name || !price || !category || !stock || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields and select an image');
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('stock', stock);
    formData.append('image', {
      uri: imageUri,
      type: 'image/*', // Adjust based on the image type
      name: 'product-image.jpg', // File name
    });

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        Alert.alert('Success', 'Product added successfully');
      } else {
        Alert.alert('Error', 'Failed to add product');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add New Product</Text>

      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        style={styles.inputField}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.inputField}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.inputField}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.inputField}
      />
      <TextInput
        placeholder="Stock Quantity"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        style={styles.inputField}
      />

      <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
        <Text style={styles.pickImageText}>Pick an Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.productImage}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pickImageButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  pickImageText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  productImage: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default AddProductScreen;