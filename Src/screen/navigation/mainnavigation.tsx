import { createStackNavigator } from "@react-navigation/stack";
import React from "react";


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
          <NavigationIndependentTree>
<NavigationContainer >
    <Stack.Navigator>
    
        <Stack.Screen name="Login" component={Login} options={{headerStyle:{backgroundColor:'rgb(30,129,176)'},
       gestureEnabled: true,headerShown:false }}/>
        <Stack.Screen name="Forget" component={Forget}/>
         <Stack.Screen name="Attendancs" component={Attendancs} options={{headerStyle:{backgroundColor:'rgb(30,129,176)'},
       headerTintColor:'white' ,headerBackTitle:""}}/>
        <Stack.Screen name="Otpverify" component={Otpverify}/> 
        <Stack.Screen name="createpassword" component={createpassword}/>
        <Stack.Screen name="Otp" component={Otp}/>
       <Stack.Screen name="Leaddetail" component={Leaddetail} options={{ headerStyle:{backgroundColor:'rgb(30,129,176)'},
         headerBackTitle:"",
        gestureEnabled: true, headerTintColor:'white',}}/>
       {/* <Stack.Screen name="LeadFollow" component={LeadFollow}/> */}
       <Stack.Screen name="Locationmap" component={Locationmap} options={{ headerStyle:{backgroundColor:'rgb(30,129,176)'},
       headerBackTitle:"", headerTintColor:'white'}}/>
      <Stack.Screen name="Mydrawer" component={Mydrawer} options={{headerShown:false}}/>
       
    </Stack.Navigator>    
</NavigationContainer>
</NavigationIndependentTree>
</GestureHandlerRootView>
    )
 }
 export default MainNavigation