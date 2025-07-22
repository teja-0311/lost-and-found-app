import React, { useState, useContext } from 'react';
import {
  View, TextInput, Button, Alert, Text, StyleSheet, ActivityIndicator
} from 'react-native';
import { UserContext } from '../UserContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';
export default function OtpScreen({ navigation }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useContext(UserContext);

  const verifyOtp = async () => {
    if (!otp) return Alert.alert("Enter OTP");

    try {
      setLoading(true); 
      const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        email: user.email,
        code: otp
      });

      if (res.data && res.data.user && res.data.user._id) {
        await login({ ...user, _id: res.data._id });
        navigation.replace('DrawerScreens');
      } else {
        Alert.alert("Failed", res.data.message || "Invalid response");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Invalid OTP");
    } finally {
      setLoading(false); 
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/send-otp`, {
        email: user.email,
        password: 'dummy', 
        name: user.name,
        phone: user.phone
      });
      Alert.alert("OTP Resent", "Check your email");
    } catch (err) {
      Alert.alert("Error", "Failed to resend OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP sent to {user.email}</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        placeholder="OTP"
        keyboardType="numeric"
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 20 }} />
      ) : (
        <Button title="Verify OTP" onPress={verifyOtp} disabled={loading} />
      )}

      <View style={{ marginTop: 10 }}>
        <Button title="Resend OTP" onPress={resendOtp} color="gray" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 12, borderRadius: 8 }
});
