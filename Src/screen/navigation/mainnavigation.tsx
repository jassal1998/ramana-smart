import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
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


const Stack = createStackNavigator()

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
    return(
        <GestureHandlerRootView style={{flex:1}}>
<NavigationContainer independent={true} >
    <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown:true}}/>
        <Stack.Screen name="Forget" component={Forget}/>
        <Stack.Screen name="Otpverify" component={Otpverify}/> 
        <Stack.Screen name="createpassword" component={createpassword}/>
        <Stack.Screen name="Otp" component={Otp}/>
       <Stack.Screen name="Leaddetail" component={Leaddetail}/>
       <Stack.Screen name="LeadFollow" component={LeadFollow}/>
       <Stack.Screen name="Locationmap" component={Locationmap}/>
    </Stack.Navigator>    
</NavigationContainer>
</GestureHandlerRootView>
    )
 }
 export default MainNavigation