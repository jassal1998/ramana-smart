import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LeadFollow from "../leaddetails/leadfollowup";
import { NavigationContainer, NavigationIndependentTree, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import CustomToast from "../customTost/Tost";

const Drawer = createDrawerNavigator()
const stack = createStackNavigator()
const {width,height}= Dimensions.get('window')

const  Mydrawer = ()=>{
 const navigation:any = useNavigation();
const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
const [isLoading, setIsLoading] = useState(false);


  const handleLogout = async (auth:any) => {
    try {
 setIsLoading(true)
    await AsyncStorage.removeItem("userToken"); 
    // Alert.alert("Logout Successful", "You have been logged out.");
      setToastMessage("Logout Successful");
      // setToastVisible(true);
    setTimeout(() => {
        setToastVisible(false);
    

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }], 
      
    });
    setIsLoading(false)
      },1000);
    setToastVisible(true);
  } catch (error) {
     setToastMessage("Logout Failed");
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false); 
      }, 2000);
  }
};





    return(
      
      
<Drawer.Navigator
     initialRouteName="LeadFollow"
      screenOptions={{
   
        drawerStyle: {
         backgroundColor: 'rgb(30,129,176)', 
           
          width: '80%', 
          borderLeftWidth: 2, 
          borderRightWidth: 2, 
          borderLeftColor: '#000', 
          borderRightColor: '#000', 
          borderRadius: 30, 
          shadowColor: '#000', 
          shadowOffset: { width: -2, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 5, 
        },
        drawerLabelStyle: {
          fontSize: 18, 
          fontWeight: 'bold', 
          color: '#333', 
        },
       drawerType: 'slide',  
        
      }}
    
       drawerContent={() => (
        <View style={style.drawerContent}>
          
        <View style={style.container}>
  <ImageBackground 
    source={require('../../../assets/1669189107737.jpeg')} 
    style={style.image}
  >
  </ImageBackground>
</View>
        <View style={{position:'absolute',flexDirection:"row",}}>
           <TouchableOpacity style={style.button} onPress={()=>navigation.navigate('Leaddetail')}>
        <Ionicons name="navigate" size={20} color="white" style={style.icon} />
        <Text style={style.text}>Lead Create</Text>
      </TouchableOpacity>
        </View>
         <TouchableOpacity style={style.button2} onPress={()=>navigation.navigate('Attendancs')}>
        <Ionicons name='pencil' size={20} color="white" style={style.icon} />
        <Text style={style.text}>Attendence</Text>
      </TouchableOpacity>
        <View style={{position:'absolute',bottom:50}}>
          <TouchableOpacity style={{flexDirection:'row'}} onPress={handleLogout}>
        <Ionicons name="log-in" size={30} color="balck" style={style.icon} />
        <Text style={style.logout}>Logout</Text>
         {isLoading && (
                  <ActivityIndicator
                    size='large'
                    color="silver"
                    style={[style.loader, { transform: [{ scale: 2 }] }]}
                  />
                )}
      </TouchableOpacity>
     <CustomToast visible={toastVisible} message={toastMessage}/>
        </View>

       
        </View>
)}
    
    >
        

      <Drawer.Screen
        name="LeadFollow"
        component={LeadFollow}
        options={{
          title: 'Daily Visits', 
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor:'rgb(30,129,176)', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
           headerRight: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('Leaddetail')} 
        style={{ marginRight: 20 }}
      >
        
        <Ionicons name="add-circle" size={30} color="#fff"  style={{left:20}}/> 
        <Text style={{color:'white',bottom:5}}>Create Lead</Text>
      </TouchableOpacity>
    
    ),

        }}
         
    
      />
    </Drawer.Navigator>


    )

}
const style =StyleSheet.create({

     drawerContent: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'white',
    
  },
  drawerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
  width: '60%', 
  height:200,
  top:50,
  position:"absolute",    
  justifyContent: 'center', 
  alignItems: 'center',
  borderRadius: 20,  
  overflow: 'hidden', 
  marginTop: 10,  
},

image: {
  width: '100%',  
  height: '100%', 
  borderBottomEndRadius: 20, 
  borderBottomLeftRadius: 20, 
  overflow: 'hidden',  
},
   customDrawerView: {
    padding:20,
    
    borderWidth: 1,
    width: width * 0.7,
    height: height * 0.3,
    backgroundColor: 'rgb(30,129,176)',
    position: 'absolute', // Use absolute positioning
    top: 0, // Position the view at the top
  },
  view:{  width:width*0.3, // Set width of your inner view
    height:116, // Set height of your inner view
    backgroundColor: 'red', // Set color for visibility
    position: 'absolute',
     bottom:'25%',// Align to the bottom of the container
   left:'10%',
   borderRadius:100
    
  },
   
  button: {
    
    width:width*0.7,
    top: '35%', 
   flexDirection:'row',
    alignItems: 'center', 
    backgroundColor: 'rgb(30,129,176)', 
    padding: 10, // Add some padding around the button
    borderRadius: 8, // Round the corners of the button
    opacity: 0.8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 5, // Space between the icon and the text
  },
  text: {
    color: 'white', // Text color
    fontSize: 16, // Text font size
    fontWeight: 'bold', // Bold text
  },
  logout:{
    color: 'Balck', // Text color
    fontSize: 16, // Text font size
    fontWeight: 'bold', // Bold text
    top:5
  },
  button2:{ width:width*0.7,
    top: '45%', 
    position:'absolute',
   flexDirection:'row',
    alignItems: 'center', 
    backgroundColor: 'rgb(30,129,176)', 
    padding: 10, // Add some padding around the button
    borderRadius: 8, // Round the corners of the button
    opacity: 0.8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,},
     loader: {
      justifyContent:"center",
      bottom:350,
      color:"red",
    position: 'absolute',
  },
})
export default Mydrawer







