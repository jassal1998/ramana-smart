import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { requestLogin } from "../../slices/thunk";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomToast from "../customTost/Tost";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const dispatch: any = useDispatch();
  const errorApi = useSelector((state: any) => state.Login.error);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
   const [isAllSelected, setIsAllSelected] = useState(false);
   const [toastVisible, setToastVisible] = useState(false);
     const [toastMessage, setToastMessage] = useState("");
  const navigation: any = useNavigation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const handleSelectionChange = (event:any) => {
    const { selection } = event.nativeEvent;

   
    if (selection.start === 0 && selection.end === email.length) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  };

  


  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return setErrorMessage("Please enter both email and password.");
    }

    if (!validateEmail(email)) {
      return setErrorMessage("Please enter a valid email.");
    }

    setErrorMessage("");
    setLoading(true);  
     
    try {
      const response = await dispatch(
        requestLogin(email, password, navigation)
        
      );
      
      const savetoken = await AsyncStorage.getItem("userToken");
       
     
      if (savetoken) {
         
        setTimeout(() => {
          navigation.navigate("Mydrawer", { screen: "LeadFollow" });
        }, 1000);
         
      } else {
        console.error("Failed to retrieve token from AsyncStorage.");
        setErrorMessage("Failed to save or retrieve token.");
        
      }
    } catch (error: any) {
     
      if (error) {
        setErrorMessage("Incorrect password. Please try again.");
      } else if (error.message?.includes("email not found")) {
        setErrorMessage("Email not found. Please check the entered email.");
      } else {
       
      }
    } finally {
  
      setLoading(false);
    
    }
  };

 useEffect(() => {
   const checkToken = async () => {
     setIsLoading(true); // Ensure loading state is set
     try {
       const token = await AsyncStorage.getItem("userToken");
       console.log("Retrieved token:", token);

       if (token) {
         console.log("Token found, navigating to LeadFollow screen.");
         navigation.reset({
           index: 0,
           routes: [{ name: "Mydrawer", params: { screen: "LeadFollow" } }],
         });
       } else {
         console.log("No token found, staying on login screen.");
         navigation.navigate("Login")
       }
     } catch (error) {
       console.error("Error checking token:", error);
     } finally {
       setIsLoading(false); // Stop loading once check is complete
     }
   };

   checkToken();
 }, []);

  if (isLoading) {
  
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10, color: "#000", fontSize: 16 }}>
          Checking authentication...
        </Text>
      </View>
    );
  }



 


  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: "#6F6AF0", flex: 1 }}
      //contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true} // Enable for Android
      keyboardOpeningTime={0} // Adjust the time for keyboard opening
    >
      <View>
        <View style={style.imagewrapper}>
          <Image
            source={require("../../../assets/location.jpg")}
            style={style.image}
          />
        </View>
        <View style={style.text}>
          <Text style={style.welcome}>Welcome for Login</Text>
          <Text style={style.account}> Login for account</Text>
        </View>
        <View style={style.input}>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="silver"
            value={email}
            onChangeText={setEmail}
            style={style.placeholder}
            selectionColor="silver"
            allowFontScaling={false}
          ></TextInput>

          <View style={{ paddingTop: 10 }}>
            <TextInput
              placeholder="Enter your Password"
              placeholderTextColor="silver"
              value={password}
              onChangeText={setPassword}
              style={style.placeholder}
              secureTextEntry={!isPasswordVisible}
              selectionColor="white"
              allowFontScaling={false}
            ></TextInput>
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons name="eye" size={20} color="white" style={style.icon} />
            </TouchableOpacity>
            {errorMessage ? (
              <Text
                style={{ color: "#fff", textAlign: "center", marginTop: 10 }}
              >
                {errorMessage}
              </Text>
            ) : null}
          </View>
          <View style={{ paddingTop: 5 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Forget")}>
              <Text style={style.forget}>Forget password</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingTop: 40, alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleLogin}
            style={[style.button, loading && { backgroundColor: "gray" }]}
          >
            <CustomToast
              visible={toastVisible}
              message={toastMessage}
              duration={15000}
            />
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={style.login}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
        {/* <View style={{paddingTop:5,flexDirection:"row"}}>
      
        <Text style={style.account}> Doesn't have an acconut?</Text>
        <TouchableOpacity  onPress={()=>navigation.navigate("Forget")}>
        <Text style={style.signup}>Sign up</Text></TouchableOpacity>
        
        
     </View> */}
      </View>
    </KeyboardAwareScrollView>
  );
};
const style = StyleSheet.create({
  imagewrapper: {
    width: "100%",
    height: height * 0.4,
    // height: "80%",
    borderBottomLeftRadius: "70%",
    borderBottomRightRadius: "70%",
    overflow: "hidden", // Ensures child respects borderRadius
    position: "relative",
  },
  image: {
    width: "100%",
    height: height * 0.4,
  },
  welcome: {
    fontSize: 25,
    fontFamily: "Arial",
    fontStyle: "italic",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    borderRadius: 5,
  },
  account: { fontSize: 15, textAlign: "center", color: "#B8B6F7" },
  text: { padding: 10, paddingTop: 10 },
  input: { paddingTop: 20, justifyContent: "center", alignSelf: "center" },

  placeholder: {
    fontSize: 15,
    padding: 10,
    fontFamily: "Arial",
    height: 40,
    color: "white",
    width: width * 0.8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,

    //backgroundColor:"#A6A4F4",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    width: width * 0.8,
    height: 50,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  login: {
    color: "balck",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  forget: { color: "white", textAlign: "right" },
  icon: { position: "absolute", alignSelf: "flex-end", bottom: 10, right: 10 },
});
export default Login;

