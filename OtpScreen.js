import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from './config';
export default function OtpScreen({ navigation }) {
  const [otp, setOtp] = useState('');
  const { user, login, logout, setUser } = useContext(UserContext);
const handleVerify = async () => {
  if (!otp) {
    Alert.alert("Error", "Please enter OTP");
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
      email: user.email,
      otp: otp.trim()
    });

    console.log('✅ OTP Verified:', response.data);

    await login(response.data.user); 
    Alert.alert("Success", "OTP Verified");

  } catch (err) {
    console.error('OTP verification failed:', err.response?.data || err.message);
    Alert.alert("Error", "Invalid OTP");
  }
};


  const handleStartOver = async () => {
    await logout();
    navigation.replace('Username');
  };

  return (
     <LinearGradient
          colors={['#abecd6', '#fbed96']}
          style={styles.gradient}
        >
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP sent to {user.email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <Button title="Verify OTP" onPress={handleVerify} />
      <TouchableOpacity onPress={handleStartOver} style={styles.resetButton}>
        <Text style={styles.resetText}>Start Over</Text>
      </TouchableOpacity>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 12, marginBottom: 10, borderRadius: 8 },
  title: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  resetButton: { marginTop: 10, alignItems: 'center' },
  resetText: { color: 'red' }
});
