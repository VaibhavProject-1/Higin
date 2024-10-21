import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import ProductSelectionScreen from '../screens/ProductSelectionScreen';
import OrderReviewScreen from '../screens/OrderReviewScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ProductManagementScreen from '../screens/ProductManagementScreen';
import EditProductScreen from '../screens/EditProductScreen';
import CustomerManagementScreen from '../screens/CustomerManagementScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen';
import OrderListForSalesOfficerScreen from '../screens/OrderListForSalesOfficerScreen';


const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }}/>
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }}/>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }}/>
      <Stack.Screen name="CustomerList" component={CustomerListScreen} options={{ title: 'Customers' }}/>
      <Stack.Screen name="CustomerManagementScreen" component={CustomerManagementScreen} options={{ title: 'Manage Customers' }}/>
      <Stack.Screen name="ProductSelection" component={ProductSelectionScreen} options={{ title: 'All Products' }}/>
      <Stack.Screen name="OrderReview" component={OrderReviewScreen} options={{ title: 'Order Review' }}/>
      <Stack.Screen name="OrderManagementScreen" component={OrderManagementScreen} options={{ title: 'Manage Orders' }}/>
      <Stack.Screen name="OrderListForSalesOfficerScreen" component={OrderListForSalesOfficerScreen} options={{ title: 'My Orders' }}/>
      <Stack.Screen name="ProductManagementScreen" component={ProductManagementScreen} options={{ title: 'Manage Prodcuts' }}/>
      <Stack.Screen name="EditProductScreen" component={EditProductScreen} options={{ title: 'Edit Products' }}/>
      <Stack.Screen name="AddProductScreen" component={AddProductScreen} options={{ title: 'Add Product' }}/>
      <Stack.Screen name="UserManagementScreen" component={UserManagementScreen} options={{ title: 'Manage Users' }}/>
    </Stack.Navigator>
  );
};

export default AuthStack;