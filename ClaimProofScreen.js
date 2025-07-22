import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  Alert, Image, Button
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { UserContext } from './UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from './config';
export default function ClaimProofScreen({ route, navigation }) {
  const { alertId } = route?.params || {};
  const { user } = useContext(UserContext);

  const [name, setName] = useState(user.name);
  const [contact, setContact] = useState(user.email);
  const [proof, setProof] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Pick from gallery
  const pickFromGallery = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 1,
});


      if (!res.canceled) {
        const asset = res.assets[0];
        setProof({
          uri: asset.uri,
          name: asset.fileName || 'proof.jpg',
          type: 'image/jpeg',
        });
      }
    } catch (error) {
      console.error('Image picking error:', error);
      Alert.alert('Error', 'Could not pick image');
    }
  };

  // Capture with camera
  const pickFromCamera = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission Denied", "Camera access is required");
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 1,
});


      if (!res.canceled) {
        const asset = res.assets[0];
        setProof({
          uri: asset.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Could not capture photo');
    }
  };

  // Submit claim
  const handleSubmit = async () => {
    if (!alertId) {
      Alert.alert("Error", "No alert ID provided");
      navigation.goBack();
      return;
    }

    if (!proof) {
      Alert.alert("Missing", "Please upload a proof image");
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', proof);
      fd.append('upload_preset', 'lostfound');

      const cloud = await axios.post(
        'https://api.cloudinary.com/v1_1/dxnqv0izn/image/upload',
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const url = cloud.data.secure_url;

      await axios.post(`${API_BASE_URL}/api/alerts/${alertId}/claim`, {
        name,
        contact,
        proofUrl: url,
      });

      Alert.alert('Success', 'Claim submitted!');
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Submit claim error:', error);
      Alert.alert('Error', 'Failed to submit claim');
    } finally {
      setUploading(false);
    }
  };

  return (
    <LinearGradient colors={['#abecd6', '#fbed96']} style={styles.gradient} >
    <View style={styles.container}>
      <Text style={[styles.heading,{paddingTop:50}, {fontWeight:50}]}>Submit Claim</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={contact} onChangeText={setContact} style={styles.input} />
      {/* Preview Proof */}
      {proof && <Image source={{ uri: proof.uri }} style={styles.preview} />}
      {/* Upload Buttons */}
      <View style={styles.row}>
        <Button title=" Camera" onPress={pickFromCamera} />
        <Button title=" Gallery" onPress={pickFromGallery} />
      </View>

      {/* Submit */}
      <View style={{ marginTop: 20 }}>
        <Button title={uploading ? 'Uploading...' : 'Submit Claim'} onPress={handleSubmit} color="#007bff" disabled={uploading} />
      </View>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
   gradient: {
    flex: 1,
  },
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 15
  },
  preview: {
    width: '100%', height: 200,
    borderRadius: 8, marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  }
});
