// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { API_BASE_URL, API_BASED_URL } from '../api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';

// const ProductSelectionScreen = ({ navigation }) => {
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [quotedPrices, setQuotedPrices] = useState({});
//   const [selectedCustomer, setSelectedCustomer] = useState(null); // For storing the selected customer from the dropdown
//   const [customers, setCustomers] = useState([]); // List of customers fetched from the API
//   const [userId, setUserId] = useState(null);

//   // Fetch User ID from AsyncStorage
//   useEffect(() => {
//     const fetchUserId = async () => {
//       try {
//         const id = await AsyncStorage.getItem('userId');
//         if (id) {
//           setUserId(id);
//         } else {
//           Alert.alert('Error', 'User not found, please log in again.');
//           navigation.navigate('Login');
//         }
//       } catch (error) {
//         console.error('Error fetching user ID:', error);
//       }
//     };
//     fetchUserId();
//   }, [navigation]);

//   // Fetch products when the screen is focused
//   useFocusEffect(
//     useCallback(() => {
//       const fetchProducts = async () => {
//         try {
//           const response = await fetch(`${API_BASE_URL}/products`);
//           const data = await response.json();
//           setProducts(data);
//         } catch (error) {
//           console.error('Error fetching products:', error);
//           Alert.alert('Error', 'Failed to fetch products.');
//         }
//       };
//       fetchProducts();
//     }, [])
//   );

//   // Fetch customers when the screen is focused
//   useFocusEffect(
//     useCallback(() => {
//       const fetchCustomers = async () => {
//         try {
//           const response = await fetch(`${API_BASE_URL}/customers`);
//           const data = await response.json();
//           setCustomers(data);
//         } catch (error) {
//           console.error('Error fetching customers:', error);
//           Alert.alert('Error', 'Failed to fetch customers.');
//         }
//       };
//       fetchCustomers();
//     }, [])
//   );

//   // Fetch customer data with last purchased prices
//   useEffect(() => {
//     if (selectedCustomer) {
//       const fetchCustomerData = async () => {
//         try {
//           const response = await fetch(`${API_BASE_URL}/customers/${selectedCustomer._id}`);
//           const customerData = await response.json();
//           // Assuming customerData contains purchasedProducts with lastPurchasedPrice
//           setSelectedCustomer(customerData); // Update selected customer with full data
//         } catch (error) {
//           console.error('Error fetching customer data:', error);
//         }
//       };
//       fetchCustomerData();
//     }
//   }, [selectedCustomer]);

//   const handleQuotedPriceChange = (productId, price) => {
//     setQuotedPrices((prevPrices) => ({
//       ...prevPrices,
//       [productId]: price,
//     }));
//   };

//   const addProductToOrder = (product) => {
//     const quotedPrice = parseFloat(quotedPrices[product._id] || product.price);
//     setSelectedProducts((prevSelectedProducts) => {
//       const existingProduct = prevSelectedProducts.find((p) => p.product._id === product._id);
//       if (existingProduct) {
//         return prevSelectedProducts.map((p) =>
//           p.product._id === product._id
//             ? { ...p, quantity: p.quantity + 1, quotedPrice }
//             : p
//         );
//       } else {
//         return [...prevSelectedProducts, { product, quantity: 1, quotedPrice }];
//       }
//     });
//   };

//   const handlePlaceOrder = () => {
//     if (!userId) {
//       Alert.alert('Error', 'User not identified. Please log in again.');
//       return;
//     }
//     if (!selectedCustomer) {
//       Alert.alert('Error', 'Please select a customer.');
//       return;
//     }

//     console.log('Navigating with userId:', userId);
//     navigation.navigate('OrderReview', { selectedProducts, salesOfficerId: userId, customer: selectedCustomer });
//   };

//   // Render product item with both current price and last purchased price if available
//   const renderProductItem = ({ item }) => {
//     // Check if the selected customer has a last purchased price for the product
//     const lastPurchasedProduct = selectedCustomer?.purchasedProducts.find(
//       (p) => p.productId === item._id
//     );
//     const lastPurchasedPrice = lastPurchasedProduct ? lastPurchasedProduct.lastPurchasedPrice : null;

//     return (
//       <View style={styles.productCard}>
//         <Image source={{ uri: `${API_BASED_URL}${item.imageUrl}` }} style={styles.productImage} />
//         <View style={styles.productDetails}>
//           <Text style={styles.productName}>{item.name}</Text>
//           <Text style={styles.productPrice}>
//             Current Price: ${item.price.toFixed(2)}
//           </Text>
//           {lastPurchasedPrice && (
//             <Text style={styles.lastPurchasedPrice}>
//               Last Purchased Price: ${lastPurchasedPrice.toFixed(2)}
//             </Text>
//           )}

//           <TextInput
//             style={styles.input}
//             value={quotedPrices[item._id] || item.price.toString()}
//             onChangeText={(value) => handleQuotedPriceChange(item._id, value)}
//             keyboardType="numeric"
//             placeholder="Quoted Price"
//           />

//           <TouchableOpacity style={styles.addButton} onPress={() => addProductToOrder(item)}>
//             <Text style={styles.addButtonText}>Add to Order</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Dropdown for selecting a customer */}
//       <Text style={styles.label}>Select a Customer:</Text>
//       <Picker
//         selectedValue={selectedCustomer}
//         onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
//         style={styles.picker}
//       >
//         <Picker.Item label="Select Customer" value={null} />
//         {customers.map((customer) => (
//           <Picker.Item key={customer._id} label={customer.name} value={customer} />
//         ))}
//       </Picker>

//       {selectedCustomer ? (
//         <Text style={styles.selectedCustomer}>Selected Customer: {selectedCustomer.name}</Text>
//       ) : (
//         <Text style={styles.errorText}>No customer selected.</Text>
//       )}

//       {/* <FlatList
//         data={products}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <View style={styles.productCard}>
//             <Image source={{ uri: `${API_BASED_URL}${item.imageUrl}` }} style={styles.productImage} />
//             <View style={styles.productDetails}>
//               <Text style={styles.productName}>{item.name}</Text>
//               <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>

//               <TextInput
//                 style={styles.input}
//                 value={quotedPrices[item._id] || item.price.toString()}
//                 onChangeText={(value) => handleQuotedPriceChange(item._id, value)}
//                 keyboardType="numeric"
//                 placeholder="Quoted Price"
//               />

//               <TouchableOpacity style={styles.addButton} onPress={() => addProductToOrder(item)}>
//                 <Text style={styles.addButtonText}>Add to Order</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       /> */}

//       <FlatList
//         data={products}
//         keyExtractor={(item) => item._id}
//         renderItem={renderProductItem}
//       />

//       {selectedProducts.length > 0 && (
//         <TouchableOpacity style={styles.reviewButton} onPress={handlePlaceOrder}>
//           <Text style={styles.reviewButtonText}>Review Order</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
//   label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
//   picker: { height: 50, width: '100%', marginBottom: 20 },
//   selectedCustomer: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
//   productCard: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF', marginBottom: 10 },
//   productImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
//   productDetails: { flex: 1 },
//   productName: { fontSize: 16, fontWeight: '600' },
//   productPrice: { fontSize: 14, color: '#888' },
//   input: { borderBottomWidth: 1, marginVertical: 5, padding: 5 },
//   addButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
//   addButtonText: { color: '#FFF', textAlign: 'center' },
//   reviewButton: { backgroundColor: '#6200EE', padding: 15, borderRadius: 10, marginTop: 20 },
//   reviewButtonText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
//   errorText: { color: '#E53935', fontSize: 16, marginBottom: 10 }
// });

// export default ProductSelectionScreen;

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL, API_BASED_URL } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ProductSelectionScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quotedPrices, setQuotedPrices] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerDataCache, setCustomerDataCache] = useState({}); // Cache for customer data
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Fetch products when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/products`);
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products:', error);
          Alert.alert('Error', 'Failed to fetch products.');
        }
      };
      fetchProducts();
    }, [])
  );

  // Fetch customers when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchCustomers = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/customers`);
          const data = await response.json();
          setCustomers(data);
        } catch (error) {
          console.error('Error fetching customers:', error);
          Alert.alert('Error', 'Failed to fetch customers.');
        }
      };
      fetchCustomers();
    }, [])
  );

  // Fetch customer data and store it in the cache
  const fetchCustomerData = async (customerId) => {
    setLoading(true);
    if (customerDataCache[customerId]) {
      // If the customer data is already in the cache, use it
      setSelectedCustomer(customerDataCache[customerId]);
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/customers/${customerId}`);
        const customerData = await response.json();
        setSelectedCustomer(customerData); // Update selected customer with full data
        setCustomerDataCache((prevCache) => ({
          ...prevCache,
          [customerId]: customerData, // Cache the customer data
        }));
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    }
    setLoading(false);
  };

  // Clear quoted prices and fetch customer data when selecting a new customer
  const handleCustomerChange = (newCustomer) => {
    if (newCustomer) {
      setQuotedPrices({}); // Clear quoted prices when switching customers
      fetchCustomerData(newCustomer._id); // Fetch data or use cached data
    }
  };

  const handleQuotedPriceChange = (productId, price) => {
    setQuotedPrices((prevPrices) => ({
      ...prevPrices,
      [productId]: price,
    }));
  };

  const addProductToOrder = (product) => {
    const quotedPrice = parseFloat(quotedPrices[product._id] || product.price);
    setSelectedProducts((prevSelectedProducts) => {
      const existingProduct = prevSelectedProducts.find((p) => p.product._id === product._id);
      if (existingProduct) {
        return prevSelectedProducts.map((p) =>
          p.product._id === product._id
            ? { ...p, quantity: p.quantity + 1, quotedPrice }
            : p
        );
      } else {
        return [...prevSelectedProducts, { product, quantity: 1, quotedPrice }];
      }
    });
  };

  const handlePlaceOrder = () => {
    if (!userId) {
      Alert.alert('Error', 'User not identified. Please log in again.');
      return;
    }
    if (!selectedCustomer) {
      Alert.alert('Error', 'Please select a customer.');
      return;
    }

    navigation.navigate('OrderReview', { selectedProducts, salesOfficerId: userId, customer: selectedCustomer });
  };

  // Render product item with both current price and last purchased price if available
  const renderProductItem = ({ item }) => {
    const lastPurchasedProduct = selectedCustomer?.purchasedProducts.find(
      (p) => p.productId === item._id
    );
    const lastPurchasedPrice = lastPurchasedProduct ? lastPurchasedProduct.lastPurchasedPrice : null;

    return (
      <View style={styles.productCard}>
        <Image source={{ uri: `${API_BASED_URL}${item.imageUrl}` }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>Current Price: ${item.price.toFixed(2)}</Text>
          {lastPurchasedPrice && (
            <Text style={styles.lastPurchasedPrice}>Last Purchased Price: ${lastPurchasedPrice.toFixed(2)}</Text>
          )}

          <TextInput
            style={styles.input}
            value={quotedPrices[item._id] || item.price.toString()}
            onChangeText={(value) => handleQuotedPriceChange(item._id, value)}
            keyboardType="numeric"
            placeholder="Quoted Price"
          />

          <TouchableOpacity style={styles.addButton} onPress={() => addProductToOrder(item)}>
            <Text style={styles.addButtonText}>Add to Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a Customer:</Text>
      <Picker
        selectedValue={selectedCustomer}
        onValueChange={(itemValue) => handleCustomerChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Customer" value={null} />
        {customers.map((customer) => (
          <Picker.Item key={customer._id} label={customer.name} value={customer} />
        ))}
      </Picker>

      {selectedCustomer ? (
        <Text style={styles.selectedCustomer}>Selected Customer: {selectedCustomer.name}</Text>
      ) : (
        <Text style={styles.errorText}>No customer selected.</Text>
      )}

      {loading ? (
        <Text>Loading customer data...</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProductItem}
        />
      )}

      {selectedProducts.length > 0 && (
        <TouchableOpacity style={styles.reviewButton} onPress={handlePlaceOrder}>
          <Text style={styles.reviewButtonText}>Review Order</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
  selectedCustomer: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  productCard: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF', marginBottom: 10 },
  productImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  productDetails: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '600' },
  productPrice: { fontSize: 14, color: '#333' },
  lastPurchasedPrice: { fontSize: 14, color: '#888' },
  input: { borderBottomWidth: 1, marginVertical: 5, padding: 5 },
  addButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  addButtonText: { color: '#FFF', textAlign: 'center' },
  reviewButton: { backgroundColor: '#6200EE', padding: 15, borderRadius: 10, marginTop: 20 },
  reviewButtonText: { color: '#FFF', fontSize: 16, textAlign: 'center' },
  errorText: { color: '#E53935', fontSize: 16, marginBottom: 10 }
});

export default ProductSelectionScreen;