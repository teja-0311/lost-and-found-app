import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  SafeAreaView, Image, ScrollView, RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from './UserContext';
import { API_BASE_URL } from './config';
export default function DashboardScreen() {
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState('mine');
  const { user, logout } = useContext(UserContext);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlerts = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`${API_BASE_URL}/api/alerts`);
      setAlerts(res.data);
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleSearch = () => {
    return alerts.filter(a => {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.type?.toLowerCase().includes(q);
    });
  };

  const filtered = handleSearch();
  const myAlerts = filtered.filter(a => a.contact === user.email);
  const otherAlerts = filtered.filter(a => a.contact !== user.email);

  const renderAlertCard = (item, isMine = false) => (
    <View key={item._id} style={styles.alertCard}>
      {item.image && <Image source={{ uri: item.image }} style={styles.alertImage} />}
      <Text style={styles.alertTitle}>{item.title}</Text>
      <Text style={styles.alertType}>{item.type.toUpperCase()}</Text>
      <Text style={styles.alertDescription}>{item.description}</Text>

      {isMine && item.claims?.length > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Claims')}
          style={styles.claimButton}
        >
          <Text style={{ color: '#fff' }}>📬 View Claims</Text>
        </TouchableOpacity>
      )}

      {!isMine && item.type === 'found' && (
        <TouchableOpacity
          style={styles.claimButton}
          onPress={() => navigation.navigate('Claim Proof', { alertId: item._id })}
        >
          <Text style={{ color: '#fff' }}> This was mine</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPressOut={() => navigation.openDrawer()} style={{ paddingTop: 50, paddingLeft: 10, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 20 }}>☰ Menu</Text>
      </TouchableOpacity>

      <View style={styles.mainContent}>
        <Text style={{ fontSize: 25, paddingTop: 20 }}>Hello! {user.name}</Text>

        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={fetchAlerts} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.lostButton} onPress={() => navigation.navigate('Post Item', { defaultType: 'lost' })}>
            <Text style={styles.buttonText}>Report Lost</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.foundButton} onPress={() => navigation.navigate('Post Item', { defaultType: 'found' })}>
            <Text style={styles.buttonText}>Report Found</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tabButton, tab === 'mine' && styles.tabActive]} onPress={() => setTab('mine')}>
            <Text style={styles.tabText}> Posted by Me</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, tab === 'others' && styles.tabActive]} onPress={() => setTab('others')}>
            <Text style={styles.tabText}> Others</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchAlerts} />}
        >
          {(tab === 'mine' ? myAlerts : otherAlerts).map(item =>
            renderAlertCard(item, tab === 'mine')
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1, padding: 16, backgroundColor: '#fff' },
  searchRow: { flexDirection: 'row', marginBottom: 12 },
  searchInput: {
    flex: 1, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 10, padding: 10, marginRight: 8
  },
  searchButton: {
    paddingHorizontal: 12, justifyContent: 'center',
    backgroundColor: '#007bff', borderRadius: 8
  },
  searchButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  lostButton: {
    flex: 1, backgroundColor: '#dc3545',
    marginRight: 10, paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  foundButton: {
    flex: 1, backgroundColor: '#28a745',
    marginLeft: 10, paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  tabRow: { flexDirection: 'row', marginBottom: 12 },
  tabButton: {
    flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabActive: { borderBottomColor: '#007bff' },
  tabText: { fontSize: 16, fontWeight: '600', color: '#007bff' },
  alertCard: {
    backgroundColor: '#e3f2fd', padding: 14,
    borderRadius: 10, marginBottom: 12, elevation: 3,
  },
  alertImage: {
    width: '100%', height: 180, borderRadius: 10, marginBottom: 8,
  },
  alertTitle: { fontSize: 18, fontWeight: 'bold', color: '#0d47a1' },
  alertType: { fontSize: 14, color: '#00796b', fontWeight: '600' },
  alertDescription: { fontSize: 14, color: '#4e342e', marginBottom: 10 },
  claimButton: {
    backgroundColor: '#007bff', padding: 10, borderRadius: 6, marginTop: 10, alignItems: 'center'
  },
});
