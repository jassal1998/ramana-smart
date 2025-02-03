import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { postAttendance } from "../../slices/thunk";
import CustomModal from "../modal/thankumodal";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

import { useNavigation, useRoute } from "@react-navigation/native";
type AttendanceState = {
  id: string;
  status: string;
  latitude: string;
  longitude: string;
  factoryName: string;
  photoUrl: string;
};

const { width, height } = Dimensions.get("window");

const Attendance: React.FC = () => {
  const route: any = useRoute();
  const { reset} = route.params || {};
    // const { factory, inLatitude, inlongitude, inPhotoUrl } = route.params || {}
  // console.log("csdsdsd", route.params);
  const navigation: any = useNavigation();
  let decoded: any = null;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const saveToken: any = await AsyncStorage.getItem("userToken");
        decoded = jwtDecode(saveToken);
        Setid(decoded.userid);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [id, Setid] = useState("");
  const [factoryName, setfactoryName] = useState("");
  const [status, setStatus] = useState<"IN" | "OUT" | null>();
  const [address, setAddress] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmittedIn, setIsSubmittedIn] = useState(false);
  const [isSubmittedOut, setIsSubmittedOut] = useState(false);
   
  const [attendenceData, setAttendenceData] = useState({
    id: "",
    status: "",
    latitude:  "", 
    longitude: "",
    factoryName: "",
    photoUrl: "",
  });



useEffect(() => {
  console.log("Status:", status);

  if (status === "OUT" && route.params) {
    const { factoryName, inLatitude, inLongitude, inPhotoUrl } = route.params;
    console.log("cvdgdd", route.params);

    setAttendenceData((prevState) => ({
      ...prevState,
      factoryName: factoryName || "",
      latitude: inLatitude || "",
      longitude: inLongitude || "",
      photoUrl: inPhotoUrl || "",
    }));
  } else {
    console.log("No item in route.params or status is not OUT");
  }
}, [status, route.params]);





  const dispatch: any = useDispatch();

  useEffect(() => {
    if (reset) {
      console.log("Resetting data...");

      setLatitude("");
      setLongitude("");
      setImageUri(null);
      setStatus(null);
      setAddress("");
      setIsSubmitted(false);
      setIsSubmittedIn(false);
      setIsSubmittedOut(false);

       AsyncStorage.removeItem("attendanceStatus");
    AsyncStorage.removeItem("factoryName");
    AsyncStorage.removeItem("isSubmitted");
    }
    
    console.log("States reset on navigating to Attendance.");
  }, [reset]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const compressImage = async (uri: string) => {
    try {
      // Remove 'file://' prefix for iOS
      if (Platform.OS === "ios" && uri.startsWith("file://")) {
        uri = uri.replace("file://", "");
      }

      // Compress and resize the image
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }], // Maintain aspect ratio, reduce width
        { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG } // Reduce quality to 30%
      );

      // Log compressed file size
      const fileInfo: any = await FileSystem.getInfoAsync(resizedImage.uri);
      console.log(`Compressed Image Size: ${fileInfo.size} bytes`);

      // Ensure file size is below 5MB (5 * 1024 * 1024 bytes)
      if (fileInfo.size > 4 * 1024 * 1024) {
        throw new Error("Image is still too large after compression.");
      }

      return resizedImage.uri;
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  };

  const handleFile = async (fileUri: string) => {
    try {
     
      const compressedUri = await compressImage(fileUri);

      
      const formData = new FormData();
      formData.append("newImage", {
        uri: Platform.OS === "ios" ? compressedUri : compressedUri,
        name: "uploaded_image.jpg",
        type: "image/jpeg",
      } as any);

      console.log("Prepared FormData for upload:", formData);
      return formData;
    } catch (error) {
      console.error("Error handling file:", error);
      Alert.alert("Error", "Failed to prepare the image for upload.");
      return null;
    }
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

    const result: any = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const formData = await handleFile(result.assets[0].uri);

        console.log("FormData for Image Upload:", formData);

        setImageUri(result.assets[0].uri);
        console.log("gssss", result.assets[0]);
        setImageUrl(result.assets[0]); // Set image preview
        console.log("Image URI:", result.assets[0].uri);
        console.log("result", result);
      } catch (error) {
        console.error("Error handling file:", error);
      }
    }
  };
  const deleteImage = () => {
    setImageUri(null);
  };

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const savedStatus: any = await AsyncStorage.getItem("attendanceStatus");
        const savedFactoryName = await AsyncStorage.getItem("factoryName");
        const isSubmitted = await AsyncStorage.getItem("isSubmitted");

        if (savedStatus) {
          setStatus(savedStatus);
          if (savedStatus === "IN") {
            setIsSubmittedIn(true);
            setIsSubmittedOut(false);
          } else if (savedStatus === "OUT") {
            setIsSubmittedIn(false);
            setIsSubmittedOut(true);
          }
        }
        if (savedFactoryName) {
          setfactoryName(savedFactoryName);
        }

        if (isSubmitted === "true") {
          setIsSubmitted(true);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error retrieving saved status:", error);
        setIsLoading(false);
      }
    };

    checkSavedStatus();
  }, []);
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return null; 
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode the location to get the address
      const geocodedLocation = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const fullAddress =
        geocodedLocation.length > 0
          ? `${geocodedLocation[0].street}, ${geocodedLocation[0].city}, ${geocodedLocation[0].country}`
          : "Address not found";

      return { latitude, longitude, fullAddress };
    } catch (error) {
      console.error("Error getting location or address:", error);
      return null;
    }
  };

  const handleStatusChange = async (newStatus: "IN" | "OUT") => {
    if (status === newStatus) return;

   if (newStatus === "IN" && isSubmittedIn) {
     Alert.alert(
       "Error",
       "You have already submitted IN. Please submit OUT first."
     );
     return;
   }

   if (newStatus === "OUT" && isSubmittedOut) {
     Alert.alert(
       "Error",
       "You have already submitted OUT. Please submit IN first."
     );
     return;
   }
    setStatus(newStatus); 

  await AsyncStorage.setItem("attendanceStatus", newStatus);
  if (newStatus === "IN") {
    setIsSubmittedIn(true); 
    setIsSubmittedOut(false);
  } else {
    setIsSubmittedOut(true);
    setIsSubmittedIn(false); 
    
  }

  if (newStatus === "OUT") {
    setIsSubmittedOut(true);
  }


    setIsLoading(true); 
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
    if (newStatus === "OUT" && factoryName) {
      setfactoryName(factoryName);

    } else if (newStatus === "OUT") {
     
    }
    
    

    setIsLoading(false); 
    
  };

  const handlePress = async () => {
    
    console.log(imageUri, "imageUrlimageUrl");

    if (!status) {
      Alert.alert("Missing Field", "Please select a status: IN or OUT.");
      return;
    }
    if (!imageUri) {
      Alert.alert("latitude");
      return;
    }
    const newFormData = new FormData();

    newFormData.append("id", id);
    newFormData.append("status", status);
    newFormData.append("latitude", attendenceData.latitude);
    newFormData.append("longitude", attendenceData.longitude);
    newFormData.append("factoryName", attendenceData.factoryName);
    newFormData.append("photoUrl", {
      uri: imageUri,
      name: "uploaded_image.jpg",
      type: "image/jpeg",
    } as any);

    // console.log("Form Data Submitted (photoUrl):", formData);

    setIsLoading(true);

    try {
      console.log("Sending request...");

      const response = await dispatch(postAttendance(newFormData));

      setTimeout(() => {
        setIsLoading(false);
      }, 4000);

      await AsyncStorage.setItem("attendanceStatus", status);
      await AsyncStorage.setItem("factoryName", factoryName);
      await AsyncStorage.setItem("isSubmitted", "true");

      setModalVisible(true);
      setIsSubmitted(true);

      if (status === "IN") {
        setIsSubmittedIn(true); // Mark IN as submitted
        
      } else if (status === "OUT") {
      
       setIsSubmittedOut(true);
      }
      setLatitude("");
      setLongitude("");
      setImageUri(null);

      

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

  const handleModalClose = async () => {
    setModalVisible(false);

    const validStatus = status ?? "IN"; 
    await AsyncStorage.setItem("status", validStatus);

    navigation.navigate("AttendanceLead", { status: validStatus });
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
              status === "IN" && { backgroundColor: "rgb(30,129,176)" },
              isSubmittedIn && { backgroundColor: "green" },
            ]}
            onPress={() => handleStatusChange("IN")}
            disabled={
              status === "IN" || status === "OUT" || isSubmittedIn || isLoading
            }
          >
            <Text style={style.buttonText}>IN</Text>
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="silver"
                style={[style.loader, { transform: [{ scale: 2 }] }]}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              style.button,
              status === "OUT" && { backgroundColor: "rgb(30,129,176)" },
              isSubmittedOut && { backgroundColor: "green" },
            ]}
            onPress={() => handleStatusChange("OUT")}
          >
            <Text style={style.buttonText}>OUT</Text>
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="silver"
                style={[style.loader, { transform: [{ scale: 2 }] }]}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: "row", left: 20, paddingTop: 10 }}>
        <Text style={style.Latitude}>Latitude:</Text>
        <TextInput
          value={attendenceData.latitude}
          style={style.num}
          editable={false}
        />
      </View>
      <View style={{ flexDirection: "row", left: 20 }}>
        <Text style={style.Latitude}>Longitude:</Text>
        <TextInput
          value={attendenceData.longitude}
          style={style.num}
          editable={false}
        />
      </View>
      <View style={style.retailer}>
        <Text style={style.name}>Factory Name</Text>
        <Text style={style.star}>***</Text>
      </View>
      <View style={{ paddingTop: 10, alignItems: "center" }}>
        <TextInput
          value={attendenceData.factoryName || ""}
          onChangeText={(text) => {
            setAttendenceData((prevState) => ({
              ...prevState,
              factoryName: text,
            }));
          }}
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
      <View style={{ paddingTop: 10, alignItems: "center" }}>
        <View style={style.card}>
          {imageUri || attendenceData.photoUrl ? (
            <Image
              source={{ uri: imageUri || attendenceData.photoUrl }}
              style={style.image}
            />
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
              size="large"
              color="silver"
              style={[style.loader, { transform: [{ scale: 2 }] }]}
            />
          )}
        </TouchableOpacity>
        <CustomModal isVisible={isModalVisible} onClose={handleModalClose} />
      </View>
    </KeyboardAwareScrollView>
  );
};

const style = StyleSheet.create({
  lead: { alignItems: "center", paddingTop: 10 },
  retailer: { flexDirection: "row", paddingTop: 10 },
  star: { color: "red", left: 5 },
  name: { fontWeight: "700" },
  input2: {
    height: 50,
    color: "black",
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  input: { flex: 1, padding: 10, fontSize: 16 },
  inputWrapper: {
    marginTop: 10,
    borderColor: "#ccc",
    width: "100%",
  },
  Latitude: { fontSize: 20 },
  pick: { paddingTop: 10, alignSelf: "center", width: "100%" },
  location: {
    backgroundColor: "rgb(30,129,176)",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
  },
  card: {
    width: "90%",
    height: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  placeholderText: {
    color: "gray",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgb(30,129,176)",
    borderRadius: 20,
    padding: 5,
  },
  deleteIcon: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 20,
    padding: 5,
  },
  next: {
    backgroundColor: "rgb(30,129,176)",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
  },
  num: { padding: 10, bottom: 5 },
  iconLeft2: { width: 20, height: 20, right: 20 },
  loader: {
    justifyContent: "center",
    bottom: 350,
    color: "red",
    position: "absolute",
  },
  container: {
    marginTop: 10,
    flex: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282c34",
  },
  next2: {
    backgroundColor: "rgb(30,129,176)",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Ensure spinner is positioned relative to the button
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonWrapper: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    width: "60%",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#ccc", // Default color
    alignItems: "center",
  },
});

export default Attendance;
