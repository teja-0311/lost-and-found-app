import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from './config';
export default function UsernameScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { login } = useContext(UserContext);

  const handleContinue = async () => {
    if (!email || !password || !name || !phone) {
      Alert.alert("Missing Info", "Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/send-otp`, {
        email, password, name, phone
      });

      if (res.data.message === "OTP sent successfully") {
        await login({ email, name, phone, _id: null });
        Alert.alert("OTP Sent", "Check your email");
        navigation.replace('OtpScreen');
      } else {
        Alert.alert("Error", "Couldn't send OTP");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Login Failed", err?.response?.data?.message || "Try again");
    }
  };

  return (
    <LinearGradient
      colors={['#abecd6', '#fbed96']}
      style={styles.gradient}
    >
      <View style={styles.innerContainer}>
        <Text style={[styles.title,{fontStyle:'italic'},{color:'black'},{paddingBottom:100},{fontSize:45}]}>Lost & Found</Text>
        <Text style={[styles.title,{color:'black'}]}>Sign Up / Login</Text>
        <TextInput
  placeholder="Email"
  placeholderTextColor="#888"
  value={email}
  onChangeText={setEmail}
  style={styles.input}
/>

<TextInput
  placeholder="Password"
  placeholderTextColor="#888"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  style={styles.input}
/>

<TextInput
  placeholder="Name"
  placeholderTextColor="#888"
  value={name}
  onChangeText={setName}
  style={styles.input}
/>

<TextInput
  placeholder="Phone"
  placeholderTextColor="#888"
  value={phone}
  onChangeText={setPhone}
  style={styles.input}
/>

        <Button title="Login"  onPress={handleContinue} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'white'
  }
});
