import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from './UserContext';
import { Avatar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { API_BASE_URL } from './config';
export default function DrawerContent({ navigation }) {
  const { user, logout } = useContext(UserContext);
  const [claimCount, setClaimCount] = useState(0);

  useEffect(() => {
    const fetchClaims = async () => {
      const res = await axios.get(`${API_BASE_URL}/api/alerts`);
      const mine = res.data.filter(a => a.contact === user.email);
      const count = mine.reduce((acc, curr) => acc + (curr.claims?.length || 0), 0);
      setClaimCount(count);
    };
    fetchClaims();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Username');
  };

  return (
    <LinearGradient colors={['#abecd6', '#fbed96']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.drawer}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Avatar
          size="large"
          rounded
          icon={{ name: 'user', type: 'font-awesome', color: 'grey' }}
          containerStyle={{ marginTop: 20 }}
        />
        <Text style={[styles.header, { color: 'black' }]}>{user.name}</Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={[styles.label, { color: 'black' }]}>📧 {user.email}</Text>
        <Text style={[styles.label, { color: 'black' }]}>📱 {user.phone}</Text>
      </View>

      {/* Claims Button */}
      <TouchableOpacity
  style={styles.claimsBtn}
  onPress={() => navigation.navigate('DashboardDrawer', { screen: 'Claims' })}
>

        <Text style={{ fontWeight: 'bold' ,fontSize:15}}>📬 Claims Received ({claimCount})</Text>
      </TouchableOpacity>
     <TouchableOpacity
  style={styles.claimsBtn}
  onPress={() => navigation.navigate('Messages')}
>
  <Text style={{ fontSize: 16 ,fontWeight:'bold', justifyContent:'center'}}>📩 Messages</Text>
</TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  drawer: { flex: 1, padding: 20},
  header: { fontSize: 22, fontWeight: 'bold', marginVertical: 20 },
  detailBox: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 6 },
  claimsBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff3cd',
    marginBottom: 20,
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 'auto',
    padding: 14,
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    alignItems: 'center',
  },
});
