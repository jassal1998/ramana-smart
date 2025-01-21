import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Button,
  Dimensions,
  Easing,
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
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { postData } from "../../slices/lead details/leaddetails";
import CustomModal from "../modal/thankumodal";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
interface ApiResponse {
  success: boolean;
  message: string;
}

const { width, height } = Dimensions.get("window");

type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: "Cold Call", value: "cold_call" },
  { label: "Follow-up Call", value: "follow_up_call" },
  { label: "Routine Call", value: "routine_call" },
  { label: "Not Interested", value: "not_interested" },
  { label: "won", value: "won" },
];
const Leaddetail = () => {
  let decoded: any = null;
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const saveToken: any = await AsyncStorage.getItem("userToken");
        decoded = jwtDecode(saveToken);
        setId(decoded.userid);

        console.log(decoded, "bbbbbbb");
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    fetchToken();
  }, []);
  const route: any = useRoute();
  const { item } = route.params || {};
  // const { latitude, longitude, address: routeAddress } = route.params || {};
  const dispatch: any = useDispatch();
  // console.log(latitude, "kmfkmkem")
  const send = useSelector((state: any) => state.SendData?.Data);
  const [id, setId] = useState<string>("");

  const [formData, setFormData] = useState({
    retailerName: item?.name || "",
    mobile: item?.contractNumber || "",
    outletAddress: item?.outletAddress || "",
    leadPhase: item?.leadPhase || "",
    newImage: item?.newImage || "",
    followUpDate: item?.followUpDate || "",
    latitudeNew: item?.latitudeNew || "",
    longitudeNew: item?.longitudeNew || "",
    userid: id,
  });

  // useEffect(() => {
  //   if (latitude && longitude) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       latitudeNew: latitude.toString(),
  //       longitudeNew: longitude.toString(),
  //     }));
  //   }
  // }, [latitude, longitude]);

  console.log(formData.latitudeNew, "latitudeNewlatitudeNew");

  const [address, setAddress] = useState<string>("");

  const [Loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [contractNumber, setContractNumber] = useState<string>("");

  //const selectedContract = useSelector((state: RootState) => state.contracts.selectedContract);
  //console.log("Selected Contract:", selectedContract);
  const navigation: any = useNavigation();

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState([]);
  const [datePickerConfirmed, setDatePickerConfirmed] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const getLocation = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);

      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      // Get the current location coordinates
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLatitude(latitude.toString());
      setLongitude(longitude.toString());
      setFormData((prevData) => ({
        ...prevData,
        latitudeNew: latitude.toString(),
        longitudeNew: longitude.toString(),
      }));

      // Reverse geocode the location to get the address
      const geocodedLocation = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (geocodedLocation.length > 0) {
        const { street, city, country } = geocodedLocation[0];
        const fullAddress = `${street}, ${city}, ${country}`;
        setAddress(fullAddress.trim()); // Set the address in the state
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error getting location or address:", error);
    } finally {
      setIsLoading(false); // Ensure the loading state is turned off after fetching location
    }
  };

  const handlechange = (text: any) => {
    if (text.length < 10) {
      setErrorMessage("Contract number must be at least 10 digits");
    } else if (text.length > 10) {
      setErrorMessage("Contract number should be exactly 10 digits");
    } else {
      setErrorMessage("");
    }

    setFormData({ ...formData, mobile: text });
  };
  useEffect(() => {
    if (item) {
      setAddress(item.outletAddress || "No Address");
      setSelectedDate(item.followUpDate || "No Date");
      setSelectedOption(item.leadPhase || "No leadphase");
      setImageUri(item.newImage || "No Image");
    }
  }, []);
  useEffect(() => {
    if (item) {
      console.log("Item received:", item);

      setFormData((prevData) => ({
        ...prevData,
        latitudeNew: item.latitude,
        longitudeNew: item.longitude,
      }));
      console.log("Latitude set to:", item.latitude || "No Address");
      console.log("Longitude set to:", item.longitude || "");
    }
  }, []);

  const toggleDatePicker = () => {
    setDatePickerVisible(true);
  };

  // Handle the date selection
  const handleDateConfirm = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setDatePickerVisible(false); // Close the picker after selecting a date
    }

    if (date) {
      const formattedDate = date.toISOString(); // Convert to ISO string
      setSelectedDate(formattedDate); // Save the selected date
    }
  };

  // Function to close the picker for iOS
  const handleClose = () => {
    setDatePickerVisible(false);
  };

  const isValidContractNumber = contractNumber.length === 10;

  const [isOpen, setIsOpen] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;

  const handleFile = (fileUri: string) => {
    const formData = new FormData();

    // Option 1: Bypass strict typing
    formData.append("newImage", {
      uri: fileUri,
      name: "uploaded_image.jpg",
      type: "image/jpeg",
    } as any);

    return formData;
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

  const handlePress = async () => {
    if (!formData.retailerName || !formData.mobile || !address || !imageUri) {
      alert("Please fill all required fields and select an image!");
      return; // Stop execution if any field is missing
    }
    if (formData.mobile.length === 10) {
      console.log("Form submitted with data:", formData);
    }

    try {
      console.log("Image URI:", imageUri);

      if (!imageUri) {
        alert("No image selected!");
        return;
      }
      setIsLoading(true);
      const newFormData = new FormData();
      newFormData.append("retailerName", formData.retailerName);
      newFormData.append("mobile", formData.mobile);
      newFormData.append("userid", id);
      newFormData.append("followUpDate", selectedDate);
      newFormData.append("leadPhase", selectedOption || "");
      newFormData.append("latitude", latitude);
      newFormData.append("longitude", longitude);
      newFormData.append("outletAddress", address);

      // Append the image
      newFormData.append("newImage", {
        uri: imageUri,
        name: "uploaded_image.jpg",
        type: "image/jpeg",
      } as any);

      console.log("Form Data neww Submitted:", newFormData);
      await dispatch(postData(newFormData));
      resetFormData();
      setIsLoading(false);
      setModalVisible(true);
    } catch (error) {
      console.error("Error submitting data:", error);
      setIsLoading(false);
      alert("An error occurred while submitting the data. Please try again.");
    }
  };
  const resetFormData = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      retailerName: "",
      mobile: "",
      latitudeNew: "",
      longitudeNew: "",
    }));

    setSelectedDate("");
    setSelectedOption("");
    setAddress("");
    setImageUri("");
  };
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
    if (value === "not_interested") {
      setDatePickerVisible(false);
      setSelectedDate("");
    } else {
      setDatePickerVisible(false);
    }
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, options.length * 40],
  });
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "white", padding: 10 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      enableOnAndroid
      extraHeight={100} // Adjust extra height when keyboard opens
      keyboardShouldPersistTaps="handled" // Allow taps outside to dismiss keyboard
    >
      {/* <View style={style.lead}>
        <Text style={style.details}>LEAD DETAILS</Text>
      </View> */}
      {/* <View style={style.retailer}>
        <Text style={style.name}>UserId</Text>
        <Text style={style.star}>***</Text>
      </View> */}
      {/* <View style={{ paddingTop: 10, alignItems: "center" }}>
        
        <TextInput
          value={id}
          // onChangeText={(text) => setFormData({ ...formData, userid: text })}
          style={style.input2}
        ></TextInput>
      </View> */}
      <View style={style.retailer}>
        <Text style={style.name}>RETAILER NAME</Text>
        <Text style={style.star}>***</Text>
      </View>
      <View style={{ paddingTop: 10, alignItems: "center" }}>
        <TextInput
          value={formData.retailerName}
          onChangeText={(text) =>
            setFormData({ ...formData, retailerName: text })
          }
          style={style.input2}
        ></TextInput>
      </View>
      <View style={style.retailer}>
        <Text style={style.name}>CONTACT NO</Text>
        <Text style={style.star}>***</Text>
      </View>

      <View style={style.inputWrapper}>
        <TouchableOpacity style={{ bottom: 10 }}>
          <Image
            source={require("../../../assets/phone-call.png")}
            style={style.iconLeft}
          />
        </TouchableOpacity>
        <TextInput
          style={style.input}
          value={formData.mobile}
          placeholder="Enter contract number"
          placeholderTextColor="gray"
          keyboardType="numeric"
          onChangeText={handlechange}
        />
        {errorMessage ? (
          <Text style={{ color: "red", textAlign: "left", top: 35 }}>
            {errorMessage}
          </Text>
        ) : null}
        <TouchableOpacity style={{ bottom: 10 }}>
          <Image
            source={require("../../../assets/login.png")}
            style={style.iconRight}
          />
        </TouchableOpacity>
        {isValidContractNumber && (
          <Image
            source={require("../../../assets/check.png")}
            style={style.tick}
          />
        )}
      </View>
      {/* <View style={style.retailer}>
        <Text style={style.name}>OUTLET ADDRESS</Text>
        <Text style={style.star}>***</Text>
       </View>
 <View style={{paddingTop:10,alignItems:'center'}}> 
    <TextInput 
         value={formData.outletAddress}
         onChangeText={(text)=> setFormData({...formData,outletAddress:text})}
    style={style.input2}>   
    </TextInput>
 </View> */}

      <View style={{ flexDirection: "row", left: 20, paddingTop: 10 }}>
        <Text style={style.Latitude}>Latitude</Text>
        <TextInput
          value={formData.latitudeNew}
          style={style.num}
          editable={false}
        />
      </View>
      <View style={{ flexDirection: "row", left: 20 }}>
        <Text style={style.Latitude}>Longitude</Text>
        <TextInput
          value={formData.longitudeNew}
          style={style.num}
          editable={false}
        />
      </View>
      <View style={style.retailer}>
        <Text style={style.name}>OUTLET ADDRESS</Text>
        <Text style={style.star}>***</Text>
      </View>

      <View style={{ paddingTop: 10, alignItems: "center" }}>
        <TextInput
          value={address}
          style={style.input2}
          editable={true}
          onChangeText={(text: string) => setAddress(text)}
          placeholder="Enter your address"
        ></TextInput>
      </View>
      <View style={style.pick}>
        <TouchableOpacity onPress={getLocation} style={style.location}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: RFPercentage(15),
            }}
            adjustsFontSizeToFit={true}
          >
            PICK LOCATION
          </Text>
        </TouchableOpacity>
      </View>
      <View style={style.retailer}>
        <Text style={style.name}>LEAD PHASE</Text>
        <Text style={style.star}>***</Text>
      </View>
      <View style={{ paddingTop: 10, alignItems: "center" }}>
        <TouchableOpacity style={style.selector} onPress={togglePicker}>
          <Text style={style.selectorText}>
            {selectedOption
              ? options.find((opt) => opt.value === selectedOption)?.label
              : "Select an option"}
          </Text>
          <Ionicons name="arrow-down" size={20}></Ionicons>
        </TouchableOpacity>
        <Animated.View
          style={[style.optionsContainer, { height: heightInterpolation }]}
        >
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
      {selectedOption !== "not_interested" && (
        <View style={style.retailer}>
          <Text style={style.name}>FOLLOW UP DATE</Text>
          <Text style={style.star}>***</Text>
        </View>
      )}
      <View style={{ paddingTop: 10, alignItems: "center" }}>
        {selectedOption !== "not_interested" && (
          <View style={style.inputWrapper}>
            <TextInput
              style={style.input}
              placeholder="Select a date"
              placeholderTextColor="gray"
              value={
                selectedDate ? new Date(selectedDate).toLocaleDateString() : ""
              }
              editable={false}
            />
            <TouchableOpacity onPress={toggleDatePicker}>
              <Image
                source={require("../../../assets/schedule (1).png")}
                style={style.iconLeft2}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Show the date picker if selected option is not "Not Interested" */}
        {datePickerVisible && selectedOption !== "not_interested" && (
          <View>
            <DateTimePicker
              value={selectedDate ? new Date(selectedDate) : new Date()}
              mode="date"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateConfirm}
            />
            {Platform.OS === "ios" && !datePickerVisible && (
              <View style={style.confirmButtonWrapper}>
                <Button title="Confirm Date" onPress={handleClose} />
              </View>
            )}
          </View>
        )}
      </View>

      <View style={style.retailer}>
        <Text style={style.name}>NEW IMAGE</Text>
        <Text style={style.star}>***</Text>
      </View>
      <View style={{ paddingTop: 10, alignItems: "center" }}>
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
      <View style={{ paddingTop: 20, paddingBottom: 20, alignItems: "center" }}>
        <TouchableOpacity onPress={handlePress} style={style.next}>
          <Text style={{ color: "white" }}>Submit</Text>
          {isLoading && (
            <ActivityIndicator
              size="large"
              color="silver"
              style={[style.loader, { transform: [{ scale: 2 }] }]}
            />
          )}
        </TouchableOpacity>

        <CustomModal
          isVisible={isModalVisible}
          onClose={() => {
            setModalVisible(false);
            navigation.navigate("Mydrawer", { screen: "LeadFollow" });
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};
const style = StyleSheet.create({
  lead: { alignItems: "center", paddingTop: 10 },
  details: { fontSize: 20, fontWeight: "bold" },
  retailer: { flexDirection: "row", paddingTop: 10 },
  star: { color: "red", left: 5 },
  name: { fontWeight: "700" },
  input2: {
    height: 50,
    color: "balck",
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
  },

  input: {
    flex: 1,
    paddingLeft: 40,
    width: "100%",
    paddingRight: 40,

    fontSize: 16,
  },

  inputWrapper: {
    marginTop: 10,
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center the items vertically
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "center",
    borderRadius: 10,
    width: "100%",
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
  tick: { width: 20, height: 20, right: 10 },
  pick: { paddingTop: 10, alignSelf: "center", width: "100%" },

  location: {
    backgroundColor: "rgb(30,129,176)",
    paddingVertical: 10,
    width: "100%",
    height: 40,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  Latitude: { fontSize: 20 },
  num: { padding: 10, bottom: 5 },
  iconLeft2: { width: 20, height: 20, right: 20 },

  next: {
    backgroundColor: "rgb(30,129,176)",

    paddingVertical: 10,
    width: "100%",
    height: 50,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 5,
    width: "100%",
    borderWidth: 1,

    borderColor: "#ccc",
  },
  selectorText: {
    fontSize: 16,
  },
  optionsContainer: {
    overflow: "hidden",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 5,
    borderWidth: 0,
    borderTopWidth: 0,
    borderColor: "#ccc",
    marginTop: 5,
  },
  option: {
    padding: 9,
    width: "100%",

    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
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
    color: "#aaa",
    fontSize: 16,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#007AFF",
    borderRadius: 40,
    padding: 10,
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
  confirmButtonWrapper: {
    backgroundColor: "red",
    marginTop: 10,
  },
  loader: {
    justifyContent: "center",
    bottom: 500,
    color: "red",
    position: "absolute",
  },
});
export default Leaddetail;
