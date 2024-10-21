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


const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CustomerList" component={CustomerListScreen} />
      <Stack.Screen name="CustomerManagementScreen" component={CustomerManagementScreen} />
      <Stack.Screen name="ProductSelection" component={ProductSelectionScreen} />
      <Stack.Screen name="OrderReview" component={OrderReviewScreen} />
      <Stack.Screen name="OrderManagementScreen" component={OrderManagementScreen} />
      <Stack.Screen name="ProductManagementScreen" component={ProductManagementScreen} />
      <Stack.Screen name="EditProductScreen" component={EditProductScreen} />
      <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
      <Stack.Screen name="UserManagementScreen" component={UserManagementScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;