import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LeadFollow from "../leaddetails/leadfollowup";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import CustomToast from "../customTost/Tost";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

const  Mydrawer = ()=>{
 const navigation:any = useNavigation();
const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
const [isLoading, setIsLoading] = useState(false);



 const handleLogout = async () => {
   setIsLoading(true); // Start loading when logout process starts

   try {
     // Remove tokens and other sensitive data
     await AsyncStorage.removeItem("userToken");
     await AsyncStorage.removeItem("user_id");

     // Check if token is removed
     const token = await AsyncStorage.getItem("userToken");
     console.log("Token after logout: ", token); // Should be null after removal

     // If everything is successful, show toast and navigate
     setToastMessage("Logout Successful");
     setToastVisible(true);

     // Reset the toast visibility after 2 seconds
     setTimeout(() => {
       setToastVisible(false);
     }, 2000);

     // Navigate to the Login screen after successful logout
     navigation.reset({
       index: 0,
       routes: [{ name: "Login" }], // Redirect to Login screen
     });
   } catch (error: any) {
     // If there's an error, show the error message in toast
     setToastMessage("Logout Failed");
     setToastVisible(true);

     setTimeout(() => {
       setToastVisible(false);
     }, 2000);

     console.error("Error during logout:", error);
   } finally {
     setIsLoading(false); // Stop loading when the logout process is complete
   }
 };




    return (
      <Drawer.Navigator
        initialRouteName="LeadFollow"
        screenOptions={{
          drawerStyle: {
            backgroundColor: "rgb(30,129,176)",
            width: "80%",
            borderLeftWidth: 2,
            borderRightWidth: 2,
            borderLeftColor: "#000",
            borderRightColor: "#000",
            borderRadius: 30,
            elevation: 10,
          },
          drawerLabelStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
          },
          drawerType: "slide",
        }}
        drawerContent={() => (
          <View style={style.drawerContent}>
            <View style={style.container}>
              <ImageBackground
                source={require("../../../assets/1669189107737.jpeg")}
                style={style.image}
              />
            </View>
            <TouchableOpacity
              style={style.button}
              onPress={() =>
                navigation.navigate("Mydrawer", { screen: "LeadFollow" })
              }
            >
              <Ionicons
                name="navigate"
                size={20}
                color="white"
                style={style.icon}
              />
              <Text allowFontScaling={false} style={style.text}>
                Lead
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.button}
              onPress={() => navigation.navigate("Assignedlead")}
            >
              <Ionicons
                name="pencil"
                size={20}
                color="white"
                style={style.icon}
              />
              <Text allowFontScaling={false} style={style.text}>
                Assignedlead
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={style.button}
              onPress={() => navigation.navigate("AttendanceLead")}
            >
              <Ionicons
                name="pencil"
                size={20}
                color="white"
                style={style.icon}
              />
              <Text allowFontScaling={false} style={style.text}>
                Attendance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.logoutContainer}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-in"
                size={30}
                color="black"
                style={style.icon}
              />
              <Text allowFontScaling={false} style={style.logoutText}>
                Logout
              </Text>
            </TouchableOpacity>
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="silver"
                style={[style.loader, { transform: [{ scale: 2 }] }]}
              />
            )}
            <CustomToast visible={toastVisible} message={toastMessage} />
          </View>
        )}
      >
        <Drawer.Screen
          name="LeadFollow"
          component={LeadFollow}
          options={{
            title: "Daily Visits",
            swipeEnabled: false,
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "rgb(30,129,176)",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate("Leaddetail")}
              >
                <Ionicons name="add-circle-outline" size={28} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
      </Drawer.Navigator>
    );
};

const style = StyleSheet.create({
  drawerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  container: {
    width: "60%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  button: {
    width: width * 0.7,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(30,129,176)",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutContainer: {
    flexDirection: "row",
    marginTop: 50,
  },
  logoutText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    justifyContent: "center",
    bottom: 350,
    color: "red",
    position: "absolute",
  },
});

export default Mydrawer;
