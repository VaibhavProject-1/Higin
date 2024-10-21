import React from 'react';
import { TextInput } from 'react-native-paper';

const InputField = ({ label, value, onChangeText, secureTextEntry = false }) => (
  <TextInput
    label={label}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    mode="outlined"
    style={{ marginBottom: 20 }}
  />
);

export default InputField;