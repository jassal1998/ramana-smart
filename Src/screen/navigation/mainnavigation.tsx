import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";


import Frist from "../loginscreen/login";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Login from "../loginscreen/login";
import Leaddetail from "../leaddetails/leaddetails";
import LeadFollow from "../leaddetails/leadfollowup";
import Location from "../locationscreen/location";
import Locationmap from "../locationscreen/location";
import Otp from "../loginscreen/otpscreen";
import Forget from "../loginscreen/forgetscreen";
import Otpverify from "../loginscreen/otpverify";
import createpassword from "../loginscreen/createpassword";
import Attendancs from "../leaddetails/attendancs";
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import Mydrawer from "./drawernavigation";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";






const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()
const headerOptions = {
  headerStyle: {
    backgroundColor: "#f4511e",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};
 const MainNavigation =()=>{
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken"); // Check if a token exists
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return null; // Show a splash screen or loading indicator if needed
  }
    return(
        <GestureHandlerRootView style={{flex:1}}>
          <NavigationIndependentTree>
<NavigationContainer  >
    <Stack.Navigator initialRouteName={isLoggedIn ? "Mydrawer" : "Login"} >
    <Stack.Screen name=" Mydrawer" component={Mydrawer} options={{gestureEnabled:false,headerShown:false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerStyle:{backgroundColor:'rgb(30,129,176)'},
       gestureEnabled: false,headerShown:false }}/>
        <Stack.Screen name="Forget" component={Forget}/>
         <Stack.Screen name="Attendancs" component={Attendancs} options={{ title: 'Attendance',
          headerStyle:{ backgroundColor:'rgb(30,129,176)'},
       headerTintColor:'white' ,headerBackTitle:"",headerTitleAlign: 'center'}}/>
        <Stack.Screen name="Otpverify" component={Otpverify}/> 
        <Stack.Screen name="createpassword" component={createpassword}/>
        <Stack.Screen name="Otp" component={Otp}/>
       <Stack.Screen name="Leaddetail" component={Leaddetail} options={ {  title: 'Create Lead', headerStyle:{backgroundColor:'rgb(30,129,176)'},
         headerBackTitle:"",
        gestureEnabled: false, headerTintColor:'white',  headerTitleAlign: 'center'}}/>
       {/* <Stack.Screen name="LeadFollow" component={LeadFollow} options={{gestureEnabled:false}}/> */}
       <Stack.Screen name="Locationmap" component={Locationmap} options={{ headerStyle:{backgroundColor:'rgb(30,129,176)'},
       headerBackTitle:"", headerTintColor:'white',headerTitleAlign: 'center'}}/>
      <Stack.Screen name="Mydrawer" component={Mydrawer} options={{headerShown:false}}/>
       
    </Stack.Navigator>    
</NavigationContainer>
</NavigationIndependentTree>
</GestureHandlerRootView>
    )
 }
 export default MainNavigation