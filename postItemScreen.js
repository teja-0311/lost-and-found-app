import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { UserContext } from './UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from './config';
export default function PostItemScreen({ route, navigation }) {
  const { defaultType = 'lost' } = route.params || {};

  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState(defaultType);
  const [imgUri, setImgUri] = useState(null);

 const pick = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImgUri(result.assets[0].uri);
    }
  } catch (err) {
    Alert.alert('Gallery Error', 'Failed to open gallery');
    console.error(err);
  }
};

const photo = async () => {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (!granted) return Alert.alert('Permission Denied', 'Camera access is required');

  try {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImgUri(result.assets[0].uri);
    }
  } catch (err) {
    Alert.alert('Camera Error', 'Failed to open camera');
    console.error(err);
  }
};

  const handleSubmit = async () => {
    if (!title || !type || !imgUri) return alert('Fill mandatory');
    const fd = new FormData();
    fd.append('file', { uri:imgUri, name:'upload.jpg', type:'image/jpeg' });
    fd.append('upload_preset','lostfound');
    const cloud = await axios.post('https://api.cloudinary.com/v1_1/dxnqv0izn/image/upload', fd, { headers:{'Content-Type':'multipart/form-data'}});
    const url = cloud.data.secure_url;

    await axios.post(`${API_BASE_URL}/api/alerts`, {
      title, description:desc, type, image:url, contact:user.email
    });
    alert('Posted!');
    navigation.goBack();
  };

  return (
     <LinearGradient
              colors={['#abecd6', '#fbed96']}
              style={styles.gradient}
            >
               <View style={{ paddingTop: 40, paddingHorizontal: 16 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Dashboard')}
        style={{
          backgroundColor: '#007bff',
          padding:15,
          paddingTop:10,
          justifyContent:'center',
          borderRadius: 8,
          alignSelf: 'flex-start'
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold',justifyContent:'space-evenly' }}>🏠 Home</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.container}>
      <Text style={[styles.heading,{paddingTop:30}]}>Report {type}</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input}/>
      <TextInput placeholder="Description" value={desc} onChangeText={setDesc} style={styles.input}/>
      {imgUri && <Image source={{ uri: imgUri }} style={styles.preview}/>}
      <View style={styles.row}>
        <TouchableOpacity onPress={pick} style={styles.btn}><Text>Gallery</Text></TouchableOpacity>
        <TouchableOpacity onPress={photo} style={styles.btn}><Text>Camera</Text></TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}><Text style={styles.submitTxt}>Submit</Text></TouchableOpacity>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
   gradient: {
    flex: 1,
  },
  container: { padding: 20, flex: 1 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 10, marginBottom: 15,
    borderRadius: 8,
  },
  preview: {
    width: '100%', height: 200,
    borderRadius: 10, marginBottom: 10,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickBtn: {
    backgroundColor: '#6c757d',
    padding: 12, borderRadius: 8, flex: 1,
    alignItems: 'center', marginHorizontal: 5
  },
  pickText: { color: '#fff', fontWeight: 'bold' },
  submitBtn: {
    backgroundColor: '#6fc253ff',
    padding: 14, borderRadius: 8,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
