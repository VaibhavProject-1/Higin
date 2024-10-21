import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { API_BASE_URL } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const EditProductScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [stock, setStock] = useState(product.stock.toString());
  const [imageUri, setImageUri] = useState(`${API_BASE_URL.replace('/api', '')}${product.imageUrl}`); // Show the existing image

  // Function to pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Set the selected image URI
    } else {
      Alert.alert('Error', 'You did not select an image');
    }
  };

  // Function to handle product update
  const handleEditProduct = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('stock', stock);
  
    // Append the image only if it was changed
    if (imageUri && imageUri !== `${API_BASE_URL.replace('/api', '')}${product.imageUrl}`) {
      const filename = imageUri.split('/').pop();
      const fileType = filename.split('.').pop();
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type: `image/${fileType}`,
      });
    }

    // Retrieve token from AsyncStorage
    const token = await AsyncStorage.getItem('token');

  
    try {
      const response = await fetch(`${API_BASE_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
         },
        body: formData,  // Just send FormData, no need to set headers
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Product updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update product');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Product Name"
      />
      <TextInput
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        placeholder="Description"
      />
      <TextInput
        value={category}
        onChangeText={setCategory}
        style={styles.input}
        placeholder="Category"
      />
      <TextInput
        value={stock}
        onChangeText={setStock}
        style={styles.input}
        placeholder="Stock"
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerText}>Pick an Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.productImage} />
      )}

      <Button title="Save Changes" onPress={handleEditProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  imagePickerButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: '600',
  },
  productImage: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
});

export default EditProductScreen;
