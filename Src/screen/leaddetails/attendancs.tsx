import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from "expo-camera";
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { postAttendance } from "../../slices/thunk";
import CustomModal from "../modal/thankumodal";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AttendanceState = {
  id: string;
  status: string;
  latitude: string;
  longitude: string;
  factoryName: string;
  photoUrl: string;
};

const { width, height } = Dimensions.get("window");

const Attendancs: React.FC = () => {
  let decoded:any = null;
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const saveToken:any = await AsyncStorage.getItem("userToken");
        decoded = jwtDecode(saveToken)
        Setid(decoded.userid)
        console.log(decoded, "DDDDD")
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);
  console.log(decoded, "decoded")
    const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [id, Setid] = useState("");
  const [factoryName, setfactoryName] = useState("");
   const [status, setStatus] = useState<'IN' | 'OUT' | null>(null);
  const [address, setAddress] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
const [isLoading, setIsLoading] = useState(false);
 const [imageUrl, setImageUrl]= useState([]);
const [isModalVisible, setModalVisible] = useState(false);
  const [attendenceData, setAttendenceData] = useState({
    id: "",
    status: "",
    latitude: "",
    longitude: "",
    factoryName: "",
    photoUrl: "",
  });

  const dispatch: any = useDispatch();




  



  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

   const handleFile = (fileUri: string) => {
     
  const formData = new FormData();
 
   // Option 1: Bypass strict typing
//    formData.append("newImage", {
//      uri: fileUri,
//      name: "uploaded_image.jpg",
//      type: "image/jpeg",
//    } as any);
   
//    console.log("FormData entries:");
//  console.log("fgghhgfffff", formData);
 
 
 
  //  return formData;
 };
 
 
   const openCamera = async () => {
     if (hasPermission === null) {
       alert("Requesting camera permissions...");
       return;
     }
 
     if (hasPermission === false) {
       alert("Camera access is denied. Please enable it in your settings.");
       return;
     }
 
     const result:any = await ImagePicker.launchCameraAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.Images,
       allowsEditing: true,
       aspect: [4, 3],
       quality: 1,
     }
  );
 
    
     if (!result.canceled) {
   try {
       
       const formData = await handleFile(result.assets[0].uri);
 
       
      //  console.log("FormData for Image Upload:", formData)
 
       setImageUri(result.assets[0].uri); 
       console.log('Check',result.assets[0])
       setImageUrl(result.assets[0]) // Set image preview
       console.log("Image URI:", result.assets[0].uri);
       console.log('result', result);
     } catch (error) {
       console.error('Error handling file:', error);
     }
   }
 };
    const deleteImage = () => {
     setImageUri(null);
   };
   

 const getLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return null; // Return null if permission is denied
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Reverse geocode the location to get the address
    const geocodedLocation = await Location.reverseGeocodeAsync({ latitude, longitude });
    const fullAddress =
      geocodedLocation.length > 0
        ? `${geocodedLocation[0].street}, ${geocodedLocation[0].city}, ${geocodedLocation[0].country}`
        : 'Address not found';

    return { latitude, longitude, fullAddress };
  } catch (error) {
    console.error('Error getting location or address:', error);
    return null; // Return null in case of errors
  }
};

const handleStatusChange = async (newStatus: 'IN' | 'OUT') => {
  if (status === newStatus) return; // Prevent unnecessary updates

  setStatus(newStatus); // Update status immediately

  setIsLoading(true); // Show loading indicator for location fetching

  const locationData = await getLocation();

  if (locationData) {
    const { latitude, longitude, fullAddress } = locationData;

    setLatitude(latitude.toString());
    setLongitude(longitude.toString());
    setAddress(fullAddress);

    // Update attendance data
    setAttendenceData((prevState) => ({
      ...prevState,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      address: fullAddress,
    }));
  }

  setIsLoading(false); // Stop loading indicator
};

  
console.log('status',status)

const handlePress = async () => {
  // Step 1: Prepare attendance data
 console.log(imageUri, "imageUrlimageUrl")

  if (!status) {
    Alert.alert('Missing Field', 'Please select a status: IN or OUT.');
    return;
  }
  const newFormData = new FormData();

  
  newFormData.append("id", id);
  newFormData.append("status", status);
  newFormData.append("latitude", attendenceData.latitude);
  newFormData.append("longitude", attendenceData.longitude);
  newFormData.append("factoryName", factoryName);
  newFormData.append("photoUrl", {
      uri: imageUri,
      name: "uploaded_image.jpg", 
      type: "image/jpeg", 
    }as any);
    
  // console.log("Form Data Submitted (photoUrl):", formData);

  console.log("Form Data new Submitted:", newFormData);

  setIsLoading(true);

  try {
    console.log("Sending request...");

  
    const response = await dispatch(postAttendance(newFormData));
    console.log("Response from backend:", response);

  
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    setModalVisible(true);

    if (response?.success) {
    
    }
  } catch (error: any) {
    console.error("Error submitting attendance:", error);
    if (error.response) {
      console.log("Backend error response:", error.response.data);
    }
    alert("An error occurred while submitting attendance. Please try again.");
    setIsLoading(false); 
  }
};
 
 

  
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "white", padding: 10 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      enableOnAndroid
      extraHeight={100}
      keyboardShouldPersistTaps="handled"
    >
      <View style={style.lead}></View>

      <View style={style.retailer}>
        <Text style={style.name}>Status</Text>
        <Text style={style.star}>***</Text>
      </View>
      <View style={style.inputWrapper}>
         <View style={style.buttonWrapper}>
        <TouchableOpacity
          style={[
            style.button,
            status === 'IN' && { backgroundColor: 'rgb(30,129,176)' },
          ]}
          onPress={() => handleStatusChange('IN')}
        >
          <Text style={style.buttonText}>IN</Text>
           {isLoading && (
          <ActivityIndicator
            size='large'
            color="silver"
            style={[style.loader, { transform: [{ scale: 2 }] }]}
          />
        )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            style.button,
            status === 'OUT' && { backgroundColor: 'rgb(30,129,176)'},
          ]}
          onPress={() => handleStatusChange('OUT')}
        >
          <Text style={style.buttonText}>OUT</Text>
           {isLoading && (
          <ActivityIndicator
            size='large'
            color="silver"
            style={[style.loader, { transform: [{ scale: 2 }] }]}
          />
        )}
        </TouchableOpacity>
      </View>
      </View>
      <View style={{ flexDirection: 'row', left: 20, paddingTop: 10 }}>
        <Text style={style.Latitude}>Latitude:</Text>
        <TextInput
          value={latitude}
          style={style.num}
          editable={false}
        />
      </View>
      <View style={{ flexDirection: 'row', left: 20 }}>
        <Text style={style.Latitude}>Longitude:</Text>
        <TextInput
          value={longitude}
          style={style.num}
          editable={false}
        />
      </View>
      <View style={style.retailer}>
        <Text style={style.name}>Factory Name</Text>
        <Text style={style.star}>***</Text>
      </View>
      <View style={{ paddingTop: 10, alignItems: 'center' }}>
        <TextInput
          value={factoryName}
          onChangeText={setfactoryName}
          style={style.input2}
          placeholder="Enter Factory Name"
          placeholderTextColor="gray"
        />
      </View>
      {/* <View style={style.pick}>
        <TouchableOpacity onPress={getLocation} style={style.location}>
          <Text style={{ color: 'white' }}>MARK UP</Text>
        </TouchableOpacity>
      </View> */}
      <View style={style.retailer}>
        <Text style={style.name}>NEW IMAGE</Text>
        <Text style={style.star}>***</Text>
      </View>
      <View style={{ paddingTop: 10, alignItems: 'center', }}>
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
            <TouchableOpacity style={style.deleteIcon} onPress={deleteImage}>
              <Ionicons name="trash-outline" size={20} color="#ff0000" />
            </TouchableOpacity>
          )}
        </View>
      </View>
     <View style={style.container}>
      <TouchableOpacity style={style.next2} onPress={handlePress}>
        <Text style={style.buttonText}>Submit</Text>
        {isLoading && (
          <ActivityIndicator
            size='large'
            color="silver"
            style={[style.loader, { transform: [{ scale: 2 }] }]}
          />
        )}
      </TouchableOpacity>
       <CustomModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />
    </View>
    </KeyboardAwareScrollView>
  );
};

const style = StyleSheet.create({
  lead: { alignItems: 'center', paddingTop: 10 },
  retailer: { flexDirection: 'row', paddingTop: 10 },
  star: { color: 'red', left: 5 },
  name: { fontWeight: "700" },
  input2: {
    height: 50,
    color: "black",
    width:'100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  input: { flex: 1, padding: 10, fontSize: 16 },
  inputWrapper: {
    marginTop: 10,
    borderColor: "#ccc",
     width:"100%",
    
  },
  Latitude: { fontSize: 20 },
  pick: { paddingTop: 10, alignSelf: 'center',width:'100%' },
  location: {
    backgroundColor: 'rgb(30,129,176)',
    paddingVertical: 10,
    width: "100%",
    borderRadius: 10,
    alignItems: 'center',
  },
  card: {
    width: "90%",
    height: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  placeholderText: {
    color: 'gray',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor:  'rgb(30,129,176)',
    borderRadius: 20,
    padding: 5,
  },
  deleteIcon: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 20,
    padding: 5,
  },
  next: {
    backgroundColor: 'rgb(30,129,176)',
    paddingVertical: 10,
    width: "100%",
    borderRadius: 10,
    alignItems: 'center',
  },
  num:{padding:10,bottom:5},
    iconLeft2:{width: 20,
    height: 20,
    right:20},
     loader: {
      justifyContent:"center",
      bottom:350,
      color:"red",
    position: 'absolute',
  },
  container: {
    marginTop:10,
    flex: 1,
    borderRadius:8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
    
  },
  next2: {
 backgroundColor: 'rgb(30,129,176)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Ensure spinner is positioned relative to the button
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignSelf:"center",
    justifyContent: 'space-between',
    width: '60%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#ccc', // Default color
    alignItems: 'center',
  },
  
});

export default Attendancs;
