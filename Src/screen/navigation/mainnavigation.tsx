import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../loginscreen/login";
import Forget from "../loginscreen/forgetscreen";
import Otp from "../loginscreen/otpscreen";
import Otpverify from "../loginscreen/otpverify";
import CreatePassword from "../loginscreen/createpassword";
import Leaddetail from "../leaddetails/leaddetails";
import Attendancs from "../leaddetails/attendancs";
import Locationmap from "../locationscreen/location";
import Mydrawer from "./drawernavigation";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AttendanceLead from "../leaddetails/attendancslead";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { jwtDecode } from "jwt-decode";
import Attendance from "../leaddetails/attendancs";
import { useSelector } from "react-redux";
import Assignedlead from "../assignedlead/assignedlead";

const Stack = createStackNavigator();
interface MainNavigatorProps {}

const MainNavigation: React.FC<MainNavigatorProps> = () => {
  ;
  const [id, setId] = useState<string>("");
   const [role, setRole] = useState<string>("");
   const [department, setDepartment] = useState<string>("");
  const navigation: any = useNavigation();
   let decoded: any = null;
useEffect(() => {
  const fetchToken = async () => {
    try {
      const saveToken: any = await AsyncStorage.getItem("userToken");
      decoded = jwtDecode(saveToken);
      setId(decoded.userid);
      setDepartment(decoded.department);
      console.log(decoded, "smddy");
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };
  fetchToken();
  console.log("TokenDecoded :", decoded);
}, []);


   







  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerStyle: { backgroundColor: "rgb(30,129,176)" },
            gestureEnabled: true,
            headerShown: false,
          }}
        />

        <Stack.Screen name="Forget" component={Forget} />

        {department.toUpperCase() === "TECHNICIAN" && (
          <>
            <Stack.Screen
              name="Attendance"
              component={Attendance}
              options={{
                title: "Attendance",
                headerStyle: { backgroundColor: "rgb(30,129,176)" },
                headerTintColor: "white",
                headerBackTitle: "",
                headerTitleAlign: "center",
              }}
            />
            <Stack.Screen
              name="AttendanceLead"
              component={AttendanceLead}
              options={{
                title: "Attendance Lead",
                headerStyle: { backgroundColor: "rgb(30,129,176)" },
                headerBackTitle: "",
                gestureEnabled: true,
                headerTintColor: "white",
                headerTitleAlign: "center",
              }}
            />
          </>
        )}

        <Stack.Screen name="Otpverify" component={Otpverify} />
        <Stack.Screen name="CreatePassword" component={CreatePassword} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen
          name="Leaddetail"
          component={Leaddetail}
          options={{
            title: "Create Lead",
            headerStyle: { backgroundColor: "rgb(30,129,176)" },
            headerBackTitle: "",
            gestureEnabled: true,
            headerTintColor: "white",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Locationmap"
          component={Locationmap}
          options={{
            headerStyle: { backgroundColor: "rgb(30,129,176)" },
            headerBackTitle: "",
            headerTintColor: "white",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Mydrawer"
          component={Mydrawer}
          options={{ headerShown: false, gestureEnabled: false }}
        />

        <Stack.Screen
          name="Assignedlead"
          component={Assignedlead}
          options={{
            title: "Assigned lead",
            headerStyle: { backgroundColor: "rgb(30,129,176)" },
            headerBackTitle: "",
            gestureEnabled: false,
            headerTintColor: "white",
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
};

export default MainNavigation;
