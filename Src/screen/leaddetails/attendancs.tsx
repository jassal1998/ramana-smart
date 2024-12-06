import React, { useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from "expo-camera";
import { Ionicons } from '@expo/vector-icons';







const { width, height } = Dimensions.get("window");
const Attendancs =()=>{
 const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [address, setAddress] = useState<string>('');
const [imageUri, setImageUri] = useState<string | null>(null);
 const [hasPermission, setHasPermission] = useState<boolean | null>(null);


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














const getLocation = async () => {
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Update the state with the latitude and longitude
      setLatitude(latitude.toString());
      setLongitude(longitude.toString());

      // Perform reverse geocoding to get the address
      const geocodedLocation = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      // Assuming the first result is the most relevant address
      if (geocodedLocation.length > 0) {
        const { street, city, country } = geocodedLocation[0];
        // Format address
        const fullAddress = `${street}, ${city}, ${country}`;
        setAddress(fullAddress); // Set the address in state
      } else {
        setAddress('Address not found');
      }

    } catch (error) {
      console.error("Error getting location or address:", error);
    }
  };





    return(
<KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "white", padding: 10 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      enableOnAndroid
      extraHeight={100} 
      keyboardShouldPersistTaps="handled" 
 >
 <View style={style.lead}>
<Text style={style.details}>Attendancs</Text>
    </View>
     <View style={style.retailer}>
        <Text style={style.name}>RETAILER NAME</Text>
        <Text style={style.star}>***</Text>
       </View>
<View    style={{paddingTop:10,alignItems:'center'}}   > 
    <TextInput 
            style={style.input2}></TextInput></View>
       <View style={style.retailer}></View>
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
         
          placeholder="Enter contract number"
          placeholderTextColor="gray"
          keyboardType="numeric"
           
        />
       <TouchableOpacity style={{bottom:10}}> <Image
          source={require("../../../assets/login.png")} style={style.iconRight}
          
        /></TouchableOpacity>
</View>
<View style={{flexDirection:'row',left:20,paddingTop:10}}>
<Text style={style.Latitude}>Latitude:</Text>
<TextInput   value={latitude}    style={style.num} editable={false}  />
</View>
<View style={{flexDirection:'row',left:20,}}>
<Text  style={style.Latitude} >Longitude:</Text>
   <TextInput  value={longitude}  style={style.num} editable={false}/>
</View>
<View style={style.retailer}>
        <Text style={style.name}>OUTLET ADDRESS</Text>
        <Text style={style.star}>***</Text>
       </View>
       
<View  style={{paddingTop:10,alignItems:'center'}}> 
  <TextInput  
  style={style.input2}
  value={address}
  onChangeText={(text)=>setAddress(text)}
  placeholder="Enter your address" ></TextInput>
</View>
{/* <View style={style.pick}><TouchableOpacity onPress={getLocation} style={style.location}>
        <Text style={{color:'white'}}>MARK UP</Text></TouchableOpacity></View> */}
<View style={style.retailer}>
        <Text style={style.name}>NEW IMAGE</Text>
        <Text style={style.star}>***</Text>
       </View>
       <View   style={{paddingTop:10,alignItems:'center'}}>

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
              <TouchableOpacity style={style.next} onPress={getLocation}>
                <Text style={{color:'white'}}>Make Up</Text></TouchableOpacity>
        </View>




 </KeyboardAwareScrollView>

    )
}
const style=StyleSheet.create({
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

  Latitude:{fontSize:20},

  pick:{paddingTop:10,alignSelf:'center'},

  location:{ 
    backgroundColor: 'rgb(30,129,176)',       
    paddingVertical: 10,
    width:width* 0.9,   
    height:40,          
    paddingHorizontal: 30,             
    borderRadius: 20,                
    alignItems: "center",             
    justifyContent: "center",         
    elevation: 3,                     
    shadowColor: "#000",              
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.8,               
    shadowRadius: 5, },

    num:{padding:10,bottom:5},
    iconLeft2:{width: 20,
    height: 20,
    right:20},

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
    

})

export default Attendancs;


