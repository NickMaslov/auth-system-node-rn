import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as authAction from '../redux/actions/authActions';

const formSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={formSchema}
        onSubmit={(values) => {
          dispatch(authAction.loginUser(values))
            .then(async (result) => {
              if (result.success) {
                try {
                  await AsyncStorage.setItem('token', result.token);
                  navigation.replace('Home');
                } catch (error) {
                  console.log(error);
                }
              } else {
                Alert.alert(result.message);
              }
            })
            .catch((err) => console.log(err));
        }}
      >
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.conteiner}>
            <View style={styles.logo}>
              <Image
                style={styles.image}
                source={require('../assets/login.png')}
              />
            </View>
            <View>
              <TextInput
                style={styles.inputBox}
                placeholder='Email'
                placeholderTextColor='#fff'
                keyboardType='email-address'
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              <Text style={styles.error}>{touched.email && errors.email}</Text>
              <TextInput
                style={styles.inputBox}
                placeholder='Password'
                placeholderTextColor='#fff'
                secureTextEntry={true}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <Text style={styles.error}>
                {touched.password && errors.password}
              </Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerButton}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  conteiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: { width: 300, height: 50 },
  inputBox: {
    width: 300,
    backgroundColor: '#B6BFC4',
    borderRadius: 25,
    padding: 16,
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    width: 300,
    backgroundColor: '#738289',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  registerContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 16,
  },
  registerText: {
    color: '#738289',
    fontSize: 16,
  },
  registerButton: {
    fontSize: 16,
    color: '#738289',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
  },
});
