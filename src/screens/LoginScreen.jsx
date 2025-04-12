import { Image, StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors, Images, Fonts } from '../contants'
import { Display } from '../utils'
import { MyContext, Separator } from '../components'
// import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
// import HomeScreen from './HomeScreen'


const LoginScreen = ({ navigation }) => {

    const { setEmpidNumber } = useContext(MyContext);

    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [empid, setEmpid] = useState(''); // Employee ID state
    const [password, setPassword] = useState(''); // Password state
    const [loading, setLoading] = useState(false); // Loading state
    const [errorMessage, setErrorMessage] = useState(''); // Error message state

    // API URL for login
    const apiUrl = 'http://168.187.108.222:65534/api/employee/Restlogin';

    const handleLogin = async () => {
        if (!empid || !password) {
            setErrorMessage('Please enter both Employee ID and Password.');
            return;
        }

        setLoading(true);
        setErrorMessage(''); // Clear previous error message

        try {
            // Prepare the data to be sent in the POST request
            const loginData = {
                empid: empid,   // Employee ID from the input
                Passs: password, // Password from the input
                rkey: '1',       // rkey is always '1' as per the API
            };

            // Make the POST request using Axios
            const response = await axios.post(apiUrl, loginData);

            // Check the response to determine if the login is successful
            if (response.status === 200) {
                const { data } = response;

                if (data && data.EmpId && data.Name) {
                    // Success: Employee ID and Name exist in the response
                    await AsyncStorage.setItem('userToken', data.EmpId);
                    setEmpidNumber(data.EmpId);
                    Alert.alert('Success', 'Login successful!');
                    // console.log('Login Success', data);
                    navigation.navigate('Home'); // Navigate to the Home screen
                    setErrorMessage('');
                    // setEmpid('');
                    // setPassword('');

                } else {
                    // Failed login: Show error message
                    setErrorMessage('Invalid Employee ID or Password.');
                    Alert.alert('Invalid', 'Invalid Employee ID or Password.');
                    console.log('Error: Invalid Employee ID or Password.');
                }
            } else {
                // Handle other HTTP response status codes (e.g., 401, 403)
                setErrorMessage('Login failed. Please check your credentials.');
                Alert.alert('Login Failed', 'Please check your credentials.');
            }
        } catch (error) {
            console.log(error.message);
            // Handle network or server errors
            setErrorMessage('An error occurred. Please try again later.');
            Alert.alert('Error', 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // console.log('333333',empid,password);


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.DEFAULT_BLUE} translucent />
            <Separator height={StatusBar.currentHeight} />
            <Image source={Images.PLATE} resizeMode='contain' style={styles.image} />
            <Text style={styles.titleText}>Thamizhan Hotal</Text>
            <View style={styles.inputContainer}>
                <View style={styles.inputSubContainer}>
                    <Feather
                        name="user"
                        size={22}
                        color={Colors.DEFAULT_GREY}
                        style={{ marginRight: 10 }}
                    />
                    <TextInput
                        placeholder='Enter User ID'
                        keyboardType='numeric'
                        placeholderTextColor={Colors.DEFAULT_GREY}
                        selectionColor={Colors.DEFAULT_GREY}
                        style={styles.inputText}
                        value={empid}
                        onChangeText={setEmpid}
                    />
                </View>
            </View>
            <Separator height={15} />
            <View style={styles.inputContainer}>
                <View style={styles.inputSubContainer}>
                    <Feather
                        name="lock"
                        size={22}
                        color={Colors.DEFAULT_GREY}
                        style={{ marginRight: 10 }}
                    />
                    <TextInput
                        placeholder='Password'
                        keyboardType='numeric'
                        secureTextEntry={isPasswordShow ? false : true}
                        placeholderTextColor={Colors.DEFAULT_GREY}
                        selectionColor={Colors.DEFAULT_GREY}
                        style={styles.inputText}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <Feather
                        name={isPasswordShow ? "eye" : "eye-off"}
                        size={22}
                        color={Colors.DEFAULT_GREY}
                        style={{ marginRight: 10 }}
                        onPress={() => setIsPasswordShow(!isPasswordShow)}
                    />
                </View>
            </View>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}
                // onPress={() => navigation.navigate('Home')}
                onPress={() => handleLogin()} disabled={loading}
            >
                <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: Colors.DEFAULT_BLUE,
    },
    image: {
        width: Display.setWidth(40),
        height: Display.setHeight(20),
        marginHorizontal: 'auto',
        marginTop: 100,
    },
    titleText: {
        color: Colors.DEFAULT_WHITE,
        fontSize: 28,
        fontFamily: Fonts.POPPINS_MEDIUM,
        marginHorizontal: 'auto',
        marginTop: 10,
    },
    inputContainer: {
        backgroundColor: Colors.LIGHT_GREY,
        paddingHorizontal: 10,
        marginHorizontal: 30,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.LIGHT_GREY2,
        justifyContent: 'center',
        marginTop: 20,
    },
    inputSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputText: {
        fontSize: 18,
        textAlignVertical: 'center',
        padding: 0,
        height: Display.setHeight(6),
        color: Colors.DEFAULT_BLACK,
        flex: 1,
    },
    loginButton: {
        backgroundColor: Colors.DEFAULT_WHITE,
        borderRadius: 8,
        marginHorizontal: 30,
        height: Display.setHeight(6),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    loginButtonText: {
        fontSize: 18,
        lineHeight: 18 * 1.4,
        color: Colors.DEFAULT_BLACK,
        fontFamily: Fonts.POPPINS_MEDIUM,
    },
    errorText: {
        color: 'red',
        // marginBottom: 5,
        marginTop: 10,
        color: Colors.DEFAULT_WHITE,
        fontFamily: Fonts.POPPINS_REGULAR,
        fontSize: 14,
        marginHorizontal: 35
    },
})




