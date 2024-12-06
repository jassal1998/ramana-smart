import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LeadFollow from "../leaddetails/leadfollowup";
import { NavigationContainer, NavigationIndependentTree, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";



const Drawer = createDrawerNavigator()
const stack = createStackNavigator()
const {width,height}= Dimensions.get('window')

const  Mydrawer = ()=>{
 const navigation:any = useNavigation();

    return(
        
<Drawer.Navigator
     initialRouteName="LeadFollow"
      screenOptions={{
        drawerStyle: {
         backgroundColor: 'rgb(30,129,176)', // Set background color of the drawer
    
          
          width: '80%', // Set the width of the drawer
          borderLeftWidth: 2, // Set the left border width
          borderRightWidth: 2, // Set the right border width
          borderLeftColor: '#000', // Set the left border color
          borderRightColor: '#000', // Set the right border color
          borderRadius: 30, // Set the radius to make the corners rounded
          shadowColor: '#000', // Optional: add shadow for better effect on iOS
          shadowOffset: { width: -2, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 5, // Optional: shadow radius for the drawer effect
        },
        drawerLabelStyle: {
          fontSize: 18, 
          fontWeight: 'bold', 
          color: '#333', 
        },
      }}
       drawerContent={() => (
        <View style={style.drawerContent}>
        <ImageBackground source={require('../../../assets/logo2.jpeg')} style={style.image}>
        </ImageBackground>
        <View style={{position:'absolute',top:'35%',flexDirection:"row",}}>
           <TouchableOpacity style={style.button} onPress={()=>navigation.navigate('Attendancs')}>
        <Ionicons name="navigate" size={20} color="white" style={style.icon} />
        <Text style={style.text}>Attendence</Text>
      </TouchableOpacity>
        </View>
         <TouchableOpacity style={style.button2} onPress={()=>navigation.navigate('Leaddetail')}>
        <Ionicons name='pencil' size={20} color="white" style={style.icon} />
        <Text style={style.text}>Lead Create</Text>
      </TouchableOpacity>
        <View style={{position:'absolute',bottom:50}}>
          <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>navigation.navigate('Login')}>
        <Ionicons name="log-in" size={30} color="balck" style={style.icon} />
        <Text style={style.logout}>Logout</Text>
      </TouchableOpacity>
        </View>

       
        </View>
      )}
    >
        

      <Drawer.Screen
        name="LeadFollow"
        component={LeadFollow}
        options={{
          title: 'Lead Follow-up', 
          headerStyle: {
            backgroundColor: 'rgb(30,129,176)', 
          },
          
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold',
            
            fontSize: 20,
          },
        }}
      />
    </Drawer.Navigator>
 


 
    )

}
const style =StyleSheet.create({

     drawerContent: {
    flex: 1, // Take up the full height and width of the drawer
    justifyContent: 'center', // Vertically center the content
    alignItems: 'center', // Horizontally center the content
    backgroundColor: 'white',
    
  },
  drawerText: {
    fontSize: 20,
    fontWeight: 'bold',
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
   image: {
   width: Math.min(width * 0.8, width),
    height: height / 3, // Set the height to cover the top half of the screen
    resizeMode: 'cover', // Ensure the image covers the area (it might crop)
    position: 'absolute', // Position the image at the top
    top: 0, // Align the image to the top 
     borderBottomEndRadius: 20, // Round the bottom-right corner
    borderBottomLeftRadius: 20,
    overflow: 'hidden'
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
    shadowRadius: 2,}
})
export default Mydrawer







