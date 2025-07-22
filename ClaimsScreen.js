import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';
import { API_BASE_URL } from './config';
export default function ClaimsScreen() {
  const { user } = useContext(UserContext);
  const [claims, setClaims] = useState([]);
  const [messages, setMessages] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchClaims = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`${API_BASE_URL}/api/alerts`);
      const mine = res.data.filter(a => a.contact === user.email && a.claims?.length > 0);
      setClaims(mine);
    } catch (e) {
      console.error("Fetch failed", e);
      Alert.alert("Error", "Couldn't load claims");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleAction = async (alertId, claimIndex, status, message) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/alerts/${alertId}/claim/${claimIndex}`, {
        message,
        status
      });
      Alert.alert("Success", `${status} message sent`);
      fetchClaims(); 
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to process claim");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchClaims} />}
    >
      <Text style={[styles.title, { paddingTop: 50 }]}>📬 All Received Claims</Text>
      {claims.map(item => (
        <View key={item._id} style={styles.card}>
          <Text style={styles.postTitle}>🧾 On: {item.title}</Text>
          {item.claims.map((claim, idx) => (
            <View key={idx} style={styles.claimBox}>
              <Text>👤 {claim.name} ({claim.contact})</Text>
              <Image source={{ uri: claim.proofUrl }} style={styles.proofImage} />
              <TextInput
                placeholder="Enter your message..."
                value={messages[`${item._id}_${idx}`] || ''}
                onChangeText={text => setMessages({ ...messages, [`${item._id}_${idx}`]: text })}
                style={styles.input}
              />
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#388e3c' }]}
                  onPress={() => handleAction(item._id, idx, 'verified', messages[`${item._id}_${idx}`])}
                >
                  <Text style={styles.actionText}> Verify</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#c62828' }]}
                  onPress={() => handleAction(item._id, idx, 'declined', messages[`${item._id}_${idx}`])}
                >
                  <Text style={styles.actionText}> Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { marginBottom: 20, padding: 10, backgroundColor: '#e0f7fa', borderRadius: 10 },
  postTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  claimBox: { marginBottom: 15, padding: 10, backgroundColor: '#fff3e0', borderRadius: 8 },
  proofImage: { height: 150, width: '100%', borderRadius: 6, marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#aaa', padding: 10, borderRadius: 6, marginBottom: 10 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 1, marginHorizontal: 5, padding: 10, borderRadius: 6, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold' }
});
