import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, RefreshControl } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';
import { API_BASE_URL } from './config';
export default function MessagesScreen() {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`${API_BASE_URL}/api/messages/${user.email}`);
      setMessages(res.data);
    } catch (e) {
      console.error("Fetch error", e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchMessages} />}
    >
      <Text style={[styles.heading, { paddingTop: 30 }]}>📬 Messages to You</Text>
      {messages.length === 0 ? (
        <Text style={styles.empty}>No messages received yet.</Text>
      ) : (
        messages.map((msg, idx) => (
          <View key={idx} style={styles.card}>
            <Image source={{ uri: msg.itemImage }} style={styles.image} />
            <Text style={styles.title}>🔖 {msg.itemTitle} ({msg.itemType})</Text>
            <Text style={styles.messageText}>💬 {msg.message}</Text>
            <Text style={styles.status}>📌 Status: {msg.status}</Text>
            <Text style={styles.from}>🧑 From: {msg.from}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  empty: { fontSize: 16, color: '#777', textAlign: 'center', marginTop: 30 },
  card: {
    backgroundColor: '#e3f2fd', padding: 14,
    borderRadius: 10, marginBottom: 12, elevation: 2,
  },
  image: { width: '100%', height: 180, borderRadius: 8, marginBottom: 8 },
  title: { fontWeight: 'bold', fontSize: 16, color: '#1565c0' },
  messageText: { fontSize: 14, color: '#333', marginVertical: 8 },
  status: { fontSize: 13, color: '#00897b', fontWeight: 'bold' },
  from: { fontSize: 12, color: '#555', fontStyle: 'italic' }
});
