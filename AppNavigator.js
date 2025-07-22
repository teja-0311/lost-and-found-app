
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ActivityIndicator, View } from 'react-native';
import { UserContext } from './UserContext';
import ClaimsScreen from './ClaimsScreen';
import UsernameScreen from './UsernameScreen';
import OtpScreen from './OtpScreen';
import DashboardScreen from './DashBoardScreen';
import PostItemScreen from './postItemScreen';
import ClaimProofScreen from './ClaimProofScreen';
import SearchScreen from './searchScreen';
import DrawerContent from './DrawerContet';
import MessagesScreen from './MessagesScreen';
import { API_BASE_URL } from './config';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DashboardDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false , swipeEnabled: true }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ drawerLabel: 'Home' }} />
<Drawer.Screen name="Claims" component={ClaimsScreen} options={{ drawerLabel: 'Claims' }} />
      <Drawer.Screen name="Messages" component={MessagesScreen} />
      <Drawer.Screen name="Post Item" component={PostItemScreen} />
      <Drawer.Screen name="Claim Proof" component={ClaimProofScreen} />
      <Drawer.Screen name="Search" component={SearchScreen} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Username" component={UsernameScreen} />
        ) : !user._id ? (
          <Stack.Screen name="OtpScreen" component={OtpScreen} />
        ) : (
          <Stack.Screen name="DashboardDrawer" component={DashboardDrawer} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
