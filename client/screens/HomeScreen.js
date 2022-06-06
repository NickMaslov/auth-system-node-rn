import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const HomeScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const loadProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) navigation.navigate('Login');
    const decoded = jwtDecode(token);
    setFullName(decoded.fullName);
    setEmail(decoded.email);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token', navigation.replace('Login'));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [fullName]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Welcome, {fullName}!</Text>
      </View>
      <View>
        <Text style={styles.text}>Your Email: {email}</Text>
      </View>
      <View>
        <Button style={styles.button} title='Logout' onPress={logout} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  text: {
    fontSize: 22,
    padding: 10,
    fontWeight: 'bold',
  },
});
