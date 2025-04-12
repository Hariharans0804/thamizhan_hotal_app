import { StyleSheet, Text, View, StatusBar, Alert } from 'react-native'
import React, { useContext } from 'react'
import { Colors, Images, Fonts } from '../contants'
// import { MenuList, OrderList, Separator } from '../components'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { MenuList, MyContext, OrderList, Separator } from '../components'
import Toast from 'react-native-toast-message';
// import Example from '../../Example'
import AsyncStorage from '@react-native-async-storage/async-storage'



const Tab = createMaterialTopTabNavigator();

const HomeScreen = ({ navigation }) => {

    const { empidNumber } = useContext(MyContext);

    handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            Alert.alert('Logged out', 'You have been logged out successfully!');
            navigation.replace('Login');
        } catch (error) {
            console.error('Logout Error:', error);
            Alert.alert('Logout Failed', 'An error occurred while logging out.');
        }
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.DEFAULT_BLUE} translucent />
            <Separator height={StatusBar.currentHeight} />
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Thamizhan Hotal</Text>
                {/* Display empidNumber */}
                <Text style={styles.empidText}>Logged in as: {empidNumber}</Text>
                <MaterialCommunityIcons
                    name="logout"
                    size={40}
                    color={Colors.DEFAULT_WHITE}
                    // onPress={() => navigation.goBack()}
                    onPress={() => handleLogout()}
                />
            </View>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: Colors.DEFAULT_WHITE,
                    tabBarStyle: { backgroundColor: Colors.DEFAULT_BLUE },
                }}>
                <Tab.Screen name='Menu List' component={MenuList} />
                <Tab.Screen name='Order List' component={OrderList} />
            </Tab.Navigator>
            <Toast />
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_BLUE,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 30,
    },
    titleText: {
        color: Colors.DEFAULT_WHITE,
        fontSize: 22,
        fontFamily: Fonts.POPPINS_MEDIUM,
        marginHorizontal: 'auto',
        // marginTop: 25,
    },
    empidText: {
        color: 'white',
        fontSize: 14,
        margin: 10,
    },

})