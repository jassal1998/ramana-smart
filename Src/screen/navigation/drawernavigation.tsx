import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LeadFollow from "../leaddetails/leadfollowup";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomToast from "../customTost/Tost";
import { jwtDecode } from "jwt-decode";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

const Mydrawer = () => {
  const navigation: any = useNavigation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [department, setDepartment] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const saveToken: any = await AsyncStorage.getItem("userToken");
        if (saveToken) {
          const decoded: any = jwtDecode(saveToken);
          setId(decoded?.userid || null);
          setDepartment(decoded?.department || null);

          if (!decoded?.department) {
            setShowContent(false);
          }
        } else {
          setShowContent(false);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        setShowContent(false);
      }
    };

    fetchToken();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("user_id");

      setToastMessage("Logout Successful");
      setToastVisible(true);

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error: any) {
      setToastMessage("Logout Failed");
      setToastVisible(true);
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };


  if (!showContent) {
    return (
      <View style={styles.emptyScreen}>
        <Text style={styles.noDepartmentText}>No department found</Text>
        <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
          <Ionicons name="log-in" size={30} color="black" style={styles.icon} />
          <Text allowFontScaling={false} style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
 useFocusEffect(
   React.useCallback(() => {
     const onBackPress = () => {
       Alert.alert(
         "Exit App",
         "Are you sure you want to exit?",
         [
           { text: "Cancel", style: "cancel" },
           { text: "Exit", onPress: () => BackHandler.exitApp() },
         ],
         { cancelable: false }
       );
       return true;
     };

     BackHandler.addEventListener("hardwareBackPress", onBackPress);

     return () =>
       BackHandler.removeEventListener("hardwareBackPress", onBackPress);
   }, [])
 );


  
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
        <View style={styles.drawerContent}>
          <View style={styles.container}>
            <ImageBackground
              source={require("../../../assets/1669189107737.jpeg")}
              style={styles.image}
            />
          </View>

          {department?.toUpperCase() !== "TECHNICIAN" && (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("Mydrawer", { screen: "LeadFollow" })
                }
              >
                <Ionicons
                  name="navigate"
                  size={20}
                  color="white"
                  style={styles.icon}
                />
                <Text allowFontScaling={false} style={styles.text}>
                  Lead
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Assignedlead")}
              >
                <Ionicons
                  name="pencil"
                  size={20}
                  color="white"
                  style={styles.icon}
                />
                <Text allowFontScaling={false} style={styles.text}>
                  Assigned lead
                </Text>
              </TouchableOpacity>
            </>
          )}

          {department?.toUpperCase() === "TECHNICIAN" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("AttendanceLead")}
            >
              <Ionicons
                name="pencil"
                size={20}
                color="white"
                style={styles.icon}
              />
              <Text allowFontScaling={false} style={styles.text}>
                Attendance
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.logoutContainer}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-in"
              size={30}
              color="black"
              style={styles.icon}
            />
            <Text allowFontScaling={false} style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>

          {isLoading && (
            <ActivityIndicator
              size="large"
              color="silver"
              style={[styles.loader, { transform: [{ scale: 2 }] }]}
            />
          )}
          <CustomToast
            visible={toastVisible}
            message={toastMessage}
            duration={15000}
          />
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
          headerStyle: { backgroundColor: "rgb(30,129,176)" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
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

const styles = StyleSheet.create({
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
  emptyScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  noDepartmentText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
});

export default Mydrawer;
