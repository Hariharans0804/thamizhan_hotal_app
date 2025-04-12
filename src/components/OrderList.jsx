import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Colors, Fonts, Images } from '../contants';
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useFocusEffect } from '@react-navigation/native';
import { MyContext } from './MyContext';
import Toast from 'react-native-toast-message';

const OrderList = () => {

  const { empidNumber } = useContext(MyContext);


  const [loading, setLoading] = useState(true);
  const [orderDataList, setOrderDataList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderCancel, setOrderCancel] = useState(null);


  const fetchCancelOrder = async (item) => {
    try {
      const cancelItem = {
        empid: empidNumber,
        tabNo: item.TabNo,
        chairNo: item.ChairNo,
      }
      const response = await axios.post('http://168.187.108.222:65534/api/employee/CancelOrder', cancelItem);
      setOrderCancel(response.data);
      console.log('WWWWWW', response.data);
      Toast.show({
        type: 'success',
        text1: 'Item Deleted Successfully!',
        // text2: 'This is some something 👋'
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  const fetchOrderDataList = async () => {
    try {
      const response = await axios.get('http://168.187.108.222:65534/api/employee/waitersAlltask');
      // Filter data where OrdName is 'RAJA'
      const filterData = response.data.AllTabNo.filter(item => item.OrdName === 'RAJA');
      setOrderDataList(filterData);
      setLoading(false);
      // console.log('888888888888888', filterData);
    } catch (error) {
      console.log('Error', error.message);
      setLoading(false);
    }
  }
  // console.log('777777777777777', orderDataList);

  useFocusEffect(
    useCallback(() => {
      fetchOrderDataList();
      // console.log('wwwww',orderDataList[1]);
      fetchCancelOrder();
    }, [])
  );

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
    console.log('table', item.TabNo);
    console.log('chair', item.ChairNo);
  }

  // const cancelItemPress = (item) => {
  //   setOrderCancel(item);
  //   console.log(item);
  // }



  const renderItem = ({ item, index }) => {
    return (
      <>
        <View style={styles.flatlistContainer}>
          <View style={styles.dataContainerFirst}>
            <Text style={styles.tableNoText}>Table No : {item.TabNo}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleItemPress(item)}>
              <Text style={styles.chairNoText}>Chair No : {item.ChairNo}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.billButton}
              activeOpacity={0.8}
              onPress={() => handleItemPress(item)}>
              <Text style={styles.billText}>Bill : {item.TrAmt} KWD</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dataContainerSecond}>
            <Image source={Images.CHICKEN_BIRIYANI} resizeMode='contain' style={styles.itemImage} />
            <View style={styles.itemNameContainer}>
              <Text style={styles.itemName}>{index + 1} . {item.ItemName} ({item.Rate})</Text>
              <Text style={styles.itemQty}>Total Ordqty : {item.Ordqty}</Text>
              <Text style={styles.itemPrice}>Total Price : {item.TrAmt}</Text>
            </View>
            <View style={styles.itemUpdateDeleteContainer}>
              <TouchableOpacity>
                <Feather name='edit' size={25} color={Colors.DEFAULT_DARK_BLUE} style={{ marginLeft: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => fetchCancelOrder(item)}>
                <AntDesign name='delete' size={25} color={Colors.DEFAULT_RED} style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: '#B3C8CF', height: 1 }}></View>
      </>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <FlatList
          data={orderDataList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} activeOpacity={0.8} onPress={() => setModalVisible(false)}>
              <MaterialIcons name='cancel' size={35} color={Colors.DEFAULT_DARK_BLUE} /*style={{ marginLeft: 250 }}*/ />
            </TouchableOpacity>
            <Text style={styles.modalText}>Order Details</Text>
            {selectedItem && (
              <>
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>Table No : {selectedItem.TabNo}</Text>
                  <Text style={styles.itemText}>Chair No : {selectedItem.ChairNo}</Text>
                  <Text style={styles.itemText}>Bill : {selectedItem.TrAmt} KWD</Text>
                </View>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle}>S.No</Text>
                  <Text style={styles.itemTitleName}>Item</Text>
                  <Text style={styles.itemTitle}>Qty</Text>
                  <Text style={styles.itemTitle}>Amount</Text>
                </View>
                <View style={styles.itemNameList}>
                  <Text style={styles.itemSNo}>1</Text>
                  <Text style={styles.itemNameData}>{selectedItem.ItemName}</Text>
                  <Text style={styles.itemQtyData}>{selectedItem.Ordqty}</Text>
                  <Text style={styles.itemAmountData}>{selectedItem.TrAmt}</Text>
                </View>
                <View style={styles.grandTotalContainer}>
                  <Text style={styles.grandTotalText}>Grand Total</Text>
                  <Text style={styles.grandTotalAmount}>{selectedItem.TrAmt}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default OrderList

const styles = StyleSheet.create({
  flatlistContainer: {
    // borderWidth: 1,
    // borderColor: 'red',
    marginHorizontal: 10,
    marginTop: 10,
  },
  dataContainerFirst: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableNoText: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    padding: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
  },
  chairNoText: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    padding: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
  },
  billButton: {
    backgroundColor: Colors.DEFAULT_DARK_GREEN,
    borderRadius: 5,
  },
  billText: {
    fontSize: 13,
    lineHeight: 13 * 1.4,
    padding: 10,
    color: Colors.DEFAULT_WHITE,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  dataContainerSecond: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginVertical:10,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    // marginHorizontal: 10,
  },
  itemNameContainer: {
    padding: 5,
    marginVertical: 10,
    // borderWidth:1,
    width: '60%',
  },
  itemName: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    paddingVertical: 8,
    color: Colors.DEFAULT_DARK_BLUE,
    textTransform: 'capitalize',
    marginLeft: 10,
  },
  itemQty: {
    fontSize: 12,
    lineHeight: 12 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
    paddingVertical: 5,
    marginLeft: 10,
  },
  itemPrice: {
    fontSize: 12,
    lineHeight: 12 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
    marginLeft: 10
  },
  itemUpdateDeleteContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 30,
    // borderWidth:1,
    padding: 5,
    marginHorizontal: 5,
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
  closeButton: {
    marginLeft: 250,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '115%',
    marginVertical: 10,
    // borderWidth:1
    // gap:5
  },
  itemText: {
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    backgroundColor: Colors.DEFAULT_DARK_GREEN,
    color: Colors.DEFAULT_WHITE,
    padding: 8,
    borderRadius: 5
  },
  itemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    width: '115%',
    // marginVertical: 10,
    marginTop: 10,
    backgroundColor: Colors.DEFAULT_GREY,
    paddingVertical: 15,
  },
  itemTitle: {
    marginRight: 8,
    marginLeft: 8,
    color: Colors.DEFAULT_BLACK,
    fontSize: 14,
    // fontFamily:Fonts.POPPINS_REGULAR
  },
  itemTitleName: {
    marginLeft: 3,
    color: Colors.DEFAULT_BLACK,
    fontSize: 14,
    flex: 1,
    // borderWidth:1,
    // fontFamily:Fonts.POPPINS_REGULAR
  },
  itemNameList: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    width: '115%',
    // marginVertical: 10,
    // backgroundColor: Colors.DEFAULT_GREY,
    paddingVertical: 15,
  },
  itemSNo: {
    marginLeft: 15,
    color: Colors.DEFAULT_BLACK,
    fontSize: 14,
    // fontFamily:Fonts.POPPINS_REGULAR
  },
  itemNameData: {
    marginLeft: 25,
    color: Colors.DEFAULT_BLACK,
    fontSize: 14,
    flex: 0.9,
    // fontFamily:Fonts.POPPINS_REGULAR,
    // borderWidth:1
  },
  itemQtyData: {
    marginLeft: 8,
    color: Colors.DEFAULT_BLACK,
    fontSize: 14,
    marginRight: 14,
    // fontFamily:Fonts.POPPINS_REGULAR
  },
  itemAmountData: {
    marginLeft: 8,
    color: Colors.DEFAULT_BLACK,
    fontSize: 14,
    // fontFamily:Fonts.POPPINS_REGULAR
  },
  grandTotalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '115%',
    // marginVertical: 10,
    backgroundColor: Colors.DEFAULT_GREY,
    paddingVertical: 15,
  },
  grandTotalText: {
    marginLeft: 47,
    color: Colors.DEFAULT_BLACK,
    fontSize: 14,
    // borderWidth:1
  },
  grandTotalAmount: {
    marginLeft: 148,
    color: Colors.DEFAULT_BLACK,
    fontSize: 14,
  }


})

// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const OrderList = () => {
//   return (
//     <View>
//       <Text>OrderList</Text>
//     </View>
//   )
// }

// export default OrderList

// const styles = StyleSheet.create({})


