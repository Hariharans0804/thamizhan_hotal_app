import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { Colors, Fonts, Images } from '../contants';
import Feather from 'react-native-vector-icons/Feather'
import { Dropdown } from 'react-native-element-dropdown';
import { MyContext } from './MyContext';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';


const MenuList = () => {

    const { empidNumber } = useContext(MyContext);

    const [menuData, setMenuData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('MBF');
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    // const [totalTableChairs, setTotalTableChairs] = useState(null);
    // const [Orderdata, setOrderdata] = useState({});
    const [totChairData, setTotChairData] = useState([]);
    const [totTabData, setTotTabData] = useState([]);
    const [selectedTotChair, setSelectedTotChair] = useState(null);
    const [selectedTotTab, setSelectedTotTab] = useState(null);
    const [selectedQty, setSelectedQty] = useState(1);
    const [orderList, setOrderList] = useState([]);


    // Function to add the new item to the orderList array
    const fetchAddItemToOrderList = async () => {
        if (selectedItem && selectedTotTab && selectedTotChair && selectedQty > 0) {

            try {
                const newOrderItem = {
                    // empidNumber,
                    // ...selectedItem,
                    // quantity: selectedQty,
                    // totalTables: selectedTotTab,
                    // totalChairs: selectedTotChair,

                    empid: empidNumber,
                    tabNo: selectedTotTab,
                    chairNo: selectedTotChair,
                    itemno: selectedItem.SrNo,
                    ordqty: selectedQty,

                };
                setModalVisible(false);
                setSelectedTotChair(null);
                setSelectedTotTab(null);
                setSelectedQty(1);

                Toast.show({
                    type: 'success',
                    text1: 'New Order Added Successfully!',
                    // text2: 'This is some something 👋'
                });

                const response = await axios.post('http://168.187.108.222:65534/api/employee/WaiterNewBookingOrd', newOrderItem);
                setOrderList(response.data.MOrder);

                // Add the new item to the orderList array
                // setOrderList([...orderList, newOrderItem]);
                // setModalVisible(false);
                // setSelectedTotChair(null);
                // setSelectedTotTab(null);
                // setSelectedQty(1);
            } catch (error) {
                console.log(error.message);
            }
        }

    };
    const isButtonDisabled = !(selectedItem && selectedTotChair && selectedTotTab && selectedQty > 0);
    // console.log('11111111111', orderList);
    // console.log('44444444444',newOrderItem);


    // Generate an array with values from 1 to 500
    const dropdownValues = Array.from({ length: 500 }, (v, i) => ({
        label: `Qty : ${(i + 1).toString()}`, // Label to display in the dropdown
        value: i + 1, // Value to be stored when selected
    }));

    const fetchData = async () => {
        try {
            const response = await axios.get('http://168.187.108.222:65534/api/employee/AllMenu'); // Replace with your API endpoint
            // Assuming the response contains "AllMenu" in response.data.AllMenu
            setMenuData(response.data); // Replace "AllMenu" with other sections like "MBF" if needed
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    const fetchTotalTableChairs = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get('http://168.187.108.222:65534/api/employee/tottabchairs');
            const totTabChairs = response.data.AllChairs[0]; // Access the first item of AllChairs
            // console.log(totTabChairs);


            // Transform the data to match the Dropdown format
            // const formattedTotChairData = [
            //   { label: `Total Chairs: ${totTabChairs.TotChair}`, value: totTabChairs.TotChair }
            // ];

            // const formattedTotTabData = [
            //   { label: `Total Tables: ${totTabChairs.TotTab}`, value: totTabChairs.TotTab }
            // ];

            // Convert TotChair value to an array of numbers [1, 2, 3, ..., TotChair]
            const totalChairs = Array.from({ length: Number(totTabChairs.TotChair) }, (v, i) => ({
                label: `Chair : ${(i + 1).toString()}`, // Display label as string
                value: i + 1, // The actual value as a number
            }));

            // Convert TotTab value to an array of numbers [1, 2, 3, ..., TotTab]
            const totalTables = Array.from({ length: Number(totTabChairs.TotTab) }, (v, i) => ({
                label: `Table : ${(i + 1).toString()}`,
                value: i + 1,
            }));

            // setTotChairData(formattedTotChairData); // Set the data for TotChair dropdown
            // setTotTabData(formattedTotTabData); // Set the data for TotTab dropdown
            // Set the data for both dropdowns
            setTotChairData(totalChairs);
            setTotTabData(totalTables);
            setLoading(false); // Stop loading
        } catch (error) {
            console.error(error);
            setLoading(false); // Stop loading on error
        }
    };

    // Fetch data from the API when component mounts
    useFocusEffect(
        useCallback(() => {
            fetchData();
            fetchTotalTableChairs();
        }, [])
    );

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };



    const handleButtonPress = (item) => {
        setModalVisible(true);
        // axiosapi()
        setSelectedItem(item);
    };
    // console.log('555555555555', selectedItem, selectedQty, selectedTotTab, selectedTotChair);

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedTotChair(null);
        setSelectedTotTab(null);
        setSelectedQty(1);
    };
    // console.log(modalVisible);
    // console.log(value);

    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <Image source={Images.CHICKEN_BIRIYANI} resizeMode='contain' style={styles.itemImage} />
            <View style={styles.itemTitle}>
                <Text style={styles.itemName}>{index + 1} . {item.ItemName}</Text>
                <Text style={styles.itemRate}>Rate: {item.Rate} KWD</Text>
            </View>
            <TouchableOpacity
                style={styles.addItemButton}
                activeOpacity={0.8}
                onPress={() => handleButtonPress(item)}
            // item={item}
            >
                <Feather name='plus' size={25}
                    color={Colors.DEFAULT_WHITE} style={{ marginLeft: 5 }} />
                <Text style={styles.addItemText}>Add Item</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={styles.container}>

            <View style={styles.categoryContainer}>
                <TouchableOpacity onPress={() => handleCategoryClick('MBF')} activeOpacity={0.8}
                    style={[styles.categoryButton,
                    { backgroundColor: selectedCategory === 'MBF' ? Colors.DEFAULT_DARK_BLUE : 'white' },
                    ]}>
                    <Text style={[styles.categoryText,
                    { color: selectedCategory === 'MBF' ? 'white' : Colors.DEFAULT_DARK_BLUE }
                    ]}>Tiffen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryClick('MLunch')} activeOpacity={0.8}
                    style={[styles.categoryButton,
                    { backgroundColor: selectedCategory === 'MLunch' ? Colors.DEFAULT_DARK_BLUE : 'white' },
                    ]}>
                    <Text style={[styles.categoryText,
                    { color: selectedCategory === 'MLunch' ? 'white' : Colors.DEFAULT_DARK_BLUE }
                    ]}>Lunch</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryClick('MSnacks')} activeOpacity={0.8}
                    style={[styles.categoryButton,
                    { backgroundColor: selectedCategory === 'MSnacks' ? Colors.DEFAULT_DARK_BLUE : 'white' },
                    ]}>
                    <Text style={[styles.categoryText,
                    { color: selectedCategory === 'MSnacks' ? 'white' : Colors.DEFAULT_DARK_BLUE }
                    ]}>Snacks</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryClick('MDinner')} activeOpacity={0.8}
                    style={[styles.categoryButton,
                    { backgroundColor: selectedCategory === 'MDinner' ? Colors.DEFAULT_DARK_BLUE : 'white' },
                    ]}>
                    <Text style={[styles.categoryText,
                    { color: selectedCategory === 'MDinner' ? 'white' : Colors.DEFAULT_DARK_BLUE }
                    ]}>Dinner</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryClick('MSpl')} activeOpacity={0.8}
                    style={[styles.categoryButton,
                    { backgroundColor: selectedCategory === 'MSpl' ? Colors.DEFAULT_DARK_BLUE : 'white' },
                    ]}>
                    <Text style={[styles.categoryText,
                    { color: selectedCategory === 'MSpl' ? 'white' : Colors.DEFAULT_DARK_BLUE }
                    ]}>Special</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryClick('MDrnks')} activeOpacity={0.8}
                    style={[styles.categoryButton,
                    { backgroundColor: selectedCategory === 'MDrnks' ? Colors.DEFAULT_DARK_BLUE : 'white' },
                    ]}>
                    <Text style={[styles.categoryText,
                    { color: selectedCategory === 'MDrnks' ? 'white' : Colors.DEFAULT_DARK_BLUE }
                    ]}>Drinks</Text>
                </TouchableOpacity>
            </View>



            <Dropdown
                style={styles.menuDropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}

                data={Array.isArray(menuData[selectedCategory]) ?
                    menuData[selectedCategory].map((item, index) => ({
                        ...item,
                        label: `${index + 1} . ${item.ItemName}  -  ${item.Rate}`,
                        value: item.SrNo, // Ensure the value is correctly mapped
                        index: index + 1,
                    })) : []
                }

                search
                maxHeight={300}
                labelField="label"  // Display the `label` for each item
                valueField="value"  // Ensure this matches the `value` in the data array
                placeholder="Select item"
                searchPlaceholder="Search..."

                value={value}  // Controlled state for the selected value
                onChange={item => {
                    setValue(item.value);  // Set the value to the selected item's value (item.value)
                }}

            // renderLeftIcon={() => (
            //   <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            // )}
            />



            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                selectedCategory &&
                <FlatList
                    data={menuData[selectedCategory]}
                    keyExtractor={(item) => item.SrNo.toString()}
                    renderItem={renderItem}
                />
            )}

            {selectedItem && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Create Order</Text>

                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                // data={Array.isArray(menuData[selectedCategory]) ?
                                //   menuData[selectedCategory].map((item, index) => ({
                                //     ...item,
                                //     label: `${index + 1} . ${item.ItemName}  -  ${item.Rate}`,
                                //     value: item.SrNo, // Ensure the value is correctly mapped
                                //     index: index + 1,
                                //   })) : []
                                // }
                                data={menuData[selectedCategory].map((item, index) => ({
                                    ...item,
                                    label: `${index + 1} . ${item.ItemName}  -  ${item.Rate}`,
                                    value: item.SrNo,
                                    index: index + 1,
                                }))}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select item"
                                searchPlaceholder="Search..."
                                value={selectedItem.SrNo}
                                onChange={item => {
                                    setSelectedItem(item);
                                }}
                            />

                            {/* Dropdown for Quantity */}
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={dropdownValues}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select a number"
                                value={selectedQty}
                                onChange={item => {
                                    setSelectedQty(item.value);
                                }}
                            />

                            {/* Dropdown for TotTab */}
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={totTabData} // Pass TotTab data here
                                search
                                maxHeight={300}
                                labelField="label" // Field to display as label
                                valueField="value" // Field to use as value
                                placeholder="Select a Table"
                                searchPlaceholder="Select a Table"
                                value={selectedTotTab}
                                onChange={item => setSelectedTotTab(item.value)} // Update state on value change
                            />

                            {/* Dropdown for TotChair */}
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={totChairData} // Pass TotChair data here
                                search
                                maxHeight={300}
                                labelField="label" // Field to display as label
                                valueField="value" // Field to use as value
                                placeholder="Select a Chair"
                                searchPlaceholder="Search a Chair"
                                value={selectedTotChair}
                                onChange={item => setSelectedTotChair(item.value)} // Update state on value change
                            />



                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.buttonClose
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() => handleCloseModal()}
                                >
                                    <Text style={styles.textStyle}>Close Modal</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        isButtonDisabled ? styles.buttonDisabled : styles.buttonEnabled,
                                    ]}
                                    onPress={() => fetchAddItemToOrderList()}
                                    disabled={isButtonDisabled}
                                >
                                    <Text style={styles.textStyle}>Confirm Order</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>
            )}

        </View>
    )
}

export default MenuList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.DEFAULT_WHITE,

    },
    itemContainer: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        // marginTop: 10,
    },
    itemImage: {
        width: 90,
        height: 100,
        borderRadius: 20,
        // marginHorizontal: 10,
    },
    itemTitle: {
        width: '45%',
        // borderWidth:1,
    },
    itemName: {
        fontSize: 14,
        lineHeight: 14 * 1.4,
        color: Colors.DEFAULT_DARK_BLUE,
        fontFamily: Fonts.POPPINS_SEMI_BOLD,
        // marginHorizontal: 20,
        marginLeft: 10,
    },
    itemRate: {
        fontSize: 12,
        lineHeight: 12 * 1.4,
        color: Colors.DEFAULT_RED,
        fontFamily: Fonts.POPPINS_SEMI_BOLD,
        // marginHorizontal: 20,
        marginLeft: 10,
    },
    addItemButton: {
        backgroundColor: Colors.DEFAULT_DARK_GREEN,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent:'space-around',
        borderRadius: 8,
        // marginHorizontal: 10,
    },
    addItemText: {
        fontSize: 12,
        lineHeight: 12 * 1.4,
        paddingVertical: 10,
        paddingHorizontal: 8,
        color: Colors.DEFAULT_WHITE,
        fontFamily: Fonts.POPPINS_SEMI_BOLD,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 20,
        // marginHorizontal: 10,
        // borderWidth:1,
        // borderColor:'salmon'
    },
    categoryButton: {
        borderWidth: 2.5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        borderColor: Colors.DEFAULT_DARK_BLUE,
        marginHorizontal: 3,
    },
    categoryText: {
        fontSize: 10,
        lineHeight: 10 * 1.4,
        fontFamily: Fonts.POPPINS_SEMI_BOLD,
    },
    menuDropdown: {
        marginHorizontal: 10,
        marginVertical: 10,
        height: 50,
        borderBottomColor: 'gray',
        borderWidth: 0.5,
        padding: 10
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: Colors.DEFAULT_WHITE,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        height: '65%',
        width: '90%', // Increase the width to 90% of the screen width
        maxWidth: 400, // Set a maxWidth for larger screens
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 0.5
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 22,
        lineHeight: 22 * 1.4,
        fontFamily: Fonts.POPPINS_MEDIUM,
        color: Colors.DEFAULT_DARK_BLUE,
        textDecorationLine: 'underline'
    },

    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderWidth:2,
        gap: 10
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical: 10
    },
    buttonClose: {
        backgroundColor: Colors.DEFAULT_DARK_BLUE,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 22,
        lineHeight: 22 * 1.4,
        fontFamily: Fonts.POPPINS_MEDIUM,
        color: Colors.DEFAULT_DARK_BLUE,
        textDecorationLine: 'underline'
    },
    dropdown: {
        marginHorizontal: 18,
        marginVertical: 10,
        height: 50,
        borderBottomColor: 'gray',
        borderWidth: 0.6,
        padding: 10,
        width: '100%',
        // borderRadius:20,
    },
    buttonEnabled: {
        backgroundColor: Colors.DEFAULT_DARK_BLUE,
    },
    buttonDisabled: {
        backgroundColor: 'gray', // Button is grayed out when disabled
    },
})


