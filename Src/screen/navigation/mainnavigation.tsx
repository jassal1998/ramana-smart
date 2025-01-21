import React from "react";
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

const Stack = createStackNavigator();

const MainNavigation = () => {
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
        <Stack.Screen
          name="Attendancs"
          component={Attendancs}
          options={{
            title: "Attendance",
            headerStyle: { backgroundColor: "rgb(30,129,176)" },
            headerTintColor: "white",
            headerBackTitle: "",
            headerTitleAlign: "center",
          }}
        />
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
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
};

export default MainNavigation;
