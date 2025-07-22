import React, { useEffect, useState, useContext } from 'react';
import { View, TextInput, FlatList, Image, TouchableOpacity, Text, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import { UserContext } from './UserContext';
import { API_BASE_URL } from './config';
export default function SearchScreen() {
  const [alerts, setAlerts] = useState([]);
  const [q, setQ] = useState('');
  const [filtered, setFiltered] = useState([]);5
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/alerts`);
    setAlerts(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
  const fetchData = async () => {
    await load();
  };
  fetchData();
}, []);


  const doSearch = () => {
    const lower = q.toLowerCase();
    setFiltered(alerts.filter(a =>
      a.title.toLowerCase().includes(lower) ||
      a.description?.toLowerCase().includes(lower) ||
      a.type.toLowerCase().includes(lower)
    ));
  };

  return (
    <View style={{flex:1}}>
      <View style={styles.row}>
        <TextInput placeholder="Search" value={q} onChangeText={setQ} style={styles.input}/>
        <TouchableOpacity onPress={doSearch} style={styles.btn}><Text>Go</Text></TouchableOpacity>
      </View>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async()=>{setRefreshing(true);await load();setRefreshing(false);}} />}
        data={filtered} keyExtractor={i=>i._id}
        renderItem={({item})=>(
          <View style={styles.card}>
            {item.image && <Image source={{ uri: item.image }} style={{width:'100%',height:180,borderRadius:8}} />}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  searchButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#6fc253ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  type: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});
