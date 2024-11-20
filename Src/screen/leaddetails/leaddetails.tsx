import React, { useEffect, useRef, useState } from "react";
import { Animated, Button, Dimensions, Easing, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


import DatePickerModal from "../modal/datepicker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from "expo-camera";





const { width, height } = Dimensions.get("window");


type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: 'Cold Call', value: 'cold_call' },
  { label: 'Follow-up Call', value: 'follow_up_call' },
  { label: 'Routine Call', value: 'routine_call' },
  { label: 'Not Interested', value: 'not_interested' },
  {label: 'won', value: 'won'}
];
const Leaddetail = ()=>{
  
  const [address, setAddress] = useState<string>('');

    const [contractNumber, setContractNumber] = useState<string>("");
    const dispatch = useDispatch();
 

const selectedContract = useSelector((state: RootState) => state.contracts.selectedContract);
console.log("Selected Contract:", selectedContract);
    const navigation:any = useNavigation();
    const route:any = useRoute();
    const { latitude, longitude, address:routeAddress } = route.params || {};
 const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date.toLocaleDateString());
  };
const isValidContractNumber = contractNumber.length === 10;
 useEffect(() => {
    if (routeAddress) {
      setAddress(routeAddress); // Set the initial address value from route params
    }
  }, [routeAddress]);
 const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const animation = useRef(new Animated.Value(0)).current;

  const togglePicker = () => {
    setIsOpen(!isOpen);
    Animated.timing(animation, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const handleOptionPress = (value: string) => {
    setSelectedOption(value);
    togglePicker();
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, options.length * 40],
  });
   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const openCamera = async () => {
    if (hasPermission === null) {
      alert('Requesting camera permissions...');
      return;
    }

    if (hasPermission === false) {
      alert('Camera access is denied. Please enable it in your settings.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
    }
const deleteImage = () => {
    setImageUri(null);
  };


  
    return(
<KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "white", padding: 10 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      enableOnAndroid
      extraHeight={100} // Adjust extra height when keyboard opens
      keyboardShouldPersistTaps="handled" // Allow taps outside to dismiss keyboard
    >
    <View style={style.lead}>
<Text style={style.details}>LEAD DETAILS</Text>
    </View>
    <View style={style.retailer}>
        <Text style={style.name}>RETAILER NAME</Text>
        <Text style={style.star}>***</Text>
       </View>
       <View style={{paddingTop:10,alignItems:'center'}}> <TextInput  
            value={selectedContract?.name}              style={style.input2}></TextInput></View>
       <View style={style.retailer}>
        <Text style={style.name}>CONTACT NO</Text>
        <Text style={style.star}>***</Text>
       </View>
    
   <View style={style.inputWrapper}>
<TouchableOpacity style={{bottom:10}}>
    <Image
          source={require("../../../assets/phone-call.png")} style={style.iconLeft}
          
        /></TouchableOpacity>
        <TextInput
          style={style.input}
          value={selectedContract?.contractNumber}
          placeholder="Enter contract number"
          placeholderTextColor="gray"
          keyboardType="numeric"
            onChangeText={(text) => setContractNumber(text)}
        />
       <TouchableOpacity style={{bottom:10}}> <Image
          source={require("../../../assets/login.png")} style={style.iconRight}
          
        />   </TouchableOpacity>
   {isValidContractNumber && (
        <Image source={require("../../../assets/check.png")} style={style.tick} />
      )}
        </View>
        <View style={style.retailer}>
        <Text style={style.name}>OUTLET ADDRESS</Text>
        <Text style={style.star}>***</Text>
       </View>
 <View style={{paddingTop:10,alignItems:'center'}}> 
    <TextInput style={style.input2}></TextInput>
 </View>
 <View style={style.retailer}>
        <Text style={style.name}>OUTLET ADDRESS</Text>
        <Text style={style.star}>***</Text>
       </View>
       <View style={style.pick}><TouchableOpacity onPress={()=>navigation.navigate("Locationmap")} style={style.location}>
        <Text style={{color:'white'}}>PICK LOCATION</Text></TouchableOpacity></View>
<View style={{flexDirection:'row',left:20,paddingTop:10}}>
<Text style={style.Latitude}>Latitude</Text>
<TextInput value={latitude ? latitude.toString() : ""}style={style.num} editable={false} />
</View>
<View style={{flexDirection:'row',left:20,}}>
<Text style={style.Latitude}>Longitude</Text>
   <TextInput value={longitude ? longitude.toString() : ""} style={style.num} editable={false} />
</View>
<View style={{paddingTop:10,alignItems:'center'}}> 
  <TextInput value={address} style={style.input2} editable={true} 
  onChangeText={(text : string)=>setAddress(text)}
  placeholder="Enter your address" >
    
    </TextInput></View>
<View style={style.retailer}>
        <Text style={style.name}>FOLLOW UP DATE</Text>
        <Text style={style.star}>***</Text>
       </View>
       <View style={{ paddingTop: 10, alignItems: "center" }}>
        <View style={style.inputWrapper}>
          <TextInput
            style={style.input}
            placeholder="Select a date"
            placeholderTextColor="gray"
            value={selectedDate}
            editable={false}
          />
          <TouchableOpacity onPress={() => setDatePickerVisible(true)} >
            <Image
              source={require("../../../assets/schedule (1).png")} // Replace with your icon
              style={style.iconLeft2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={handleDateConfirm}
      />
     
    <View style={style.retailer}>
        <Text style={style.name}>LEAD PHASE</Text>
        <Text style={style.star}>***</Text>
       </View>
       <View style={{paddingTop:10,alignItems:'center'}}> 
         <TouchableOpacity style={style.selector} onPress={togglePicker}>
        <Text style={style.selectorText}>
          {selectedOption
            ? options.find((opt) => opt.value === selectedOption)?.label
            : 'Select an option'}
        </Text>
        
      </TouchableOpacity>
      <Animated.View style={[style.optionsContainer, { height: heightInterpolation }]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={style.option}
            onPress={() => handleOptionPress(option.value)}
          >
            <Text style={style.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
       
    </View>
    
        <View style={style.retailer}>
        <Text style={style.name}>NEW IMAGE</Text>
        <Text style={style.star}>***</Text>
       </View>
       <View style={{paddingTop:10,alignItems:'center'}}> 

<View style={style.card}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={style.image} />
        ) : (
          <Text style={style.placeholderText}>No image selected</Text>
          
        )}
        
         
        <TouchableOpacity style={style.cameraIcon} onPress={openCamera}>
          <Ionicons name="camera-outline" size={30} color="#fff" />
        </TouchableOpacity>

        {imageUri && (
    <TouchableOpacity
      style={style.deleteIcon}
      onPress={deleteImage} // Add your delete function here
    >
      <Ionicons name="trash-outline" size={20} color="#ff0000" />
    </TouchableOpacity>
  )}
      </View>



        </View>
        <View style={{paddingTop:20,paddingBottom:20,alignItems:'center'}}>
            <TouchableOpacity onPress={()=>navigation.navigate("LeadFollow")} style={style.next}><Text style={{color:'white'}}>Next</Text></TouchableOpacity>
        </View>


</KeyboardAwareScrollView>
    )
}
const style = StyleSheet.create({
    lead:{alignItems:'center',paddingTop:10},
details:{fontSize:20,fontWeight:'bold',},
retailer:{flexDirection:'row',paddingTop:10},
star:{color:'red',left:5},
name:{fontWeight:"700"},
input2:{ 
    height: 50,
    color:"balck",
    width:width* 0.9,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,},

input:{ flex: 1, 
    paddingLeft: 40, 
    paddingRight: 40,
  
    fontSize: 16,},

 inputWrapper: {
    marginTop:10,
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center the items vertically
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf:'center',
    borderRadius: 10,
    width: width * 0.9, // Width of the text input container
    height: 50, // Height of the container
  },
   
    iconLeft: {
    position: "absolute",
    left: 10, // Position it on the left side of the input field
    width: 20,
    height: 20,
},
 iconRight: {
    position: "absolute",
    right: 10, // Position it on the right side of the input field
    width: 20,
    height: 20,
  },
  tick:{width:20,height:20,right:10},
  pick:{paddingTop:10,alignSelf:'center'},

  location:{ 
    backgroundColor: 'rgb(30,129,176)',       
    paddingVertical: 10,
    width:width* 0.9,   
    height:50,          
    paddingHorizontal: 30,             
    borderRadius: 10,                
    alignItems: "center",             
    justifyContent: "center",         
    elevation: 3,                     
    shadowColor: "#000",              
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.8,               
    shadowRadius: 5, },
    Latitude:{fontSize:20},
    num:{padding:10,bottom:5},
    iconLeft2:{width: 20,
    height: 20,
    right:20},

    next:{backgroundColor: 'rgb(30,129,176)',       
    paddingVertical: 10,
    width:width* 0.9,   
    height:50,          
    paddingHorizontal: 30,             
    borderRadius: 10,                
    alignItems: "center",             
    justifyContent: "center",         
    elevation: 3,                     
    shadowColor: "#000",              
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.8,               
    shadowRadius: 5,},
    
     container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width:width* 0.9,
    borderWidth: 1,

    borderColor: '#ccc',
  },
  selectorText: {
    fontSize: 16,
  },
  optionsContainer: {
    
    overflow: "hidden",
    bottom:5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 5,
  },
  option: {
    
    padding: 10,
    width:width* 0.9,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  card: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007AFF',
    borderRadius: 40,
    padding: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
  },
})
export default Leaddetail