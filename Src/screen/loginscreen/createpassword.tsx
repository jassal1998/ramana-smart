import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";



import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get("window");

const Createpassword = () =>{
    const navigation:any = useNavigation();

    return(
 <KeyboardAwareScrollView
      style={{ backgroundColor:'#6F6AF0',flex:1,}}
      //contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true} // Enable for Android
      keyboardOpeningTime={0} // Adjust the time for keyboard opening
    >
<View>
    <View style={style.imagewrapper}>
<Image source={require("../../../assets/user.jpg")} style={style.image}/>
   </View>
     <View style={style.text} >
    <Text style={style.welcome} >Create new password</Text>
    <Text style={style.account} > your new password must vi different from</Text>
    <Text style={style.account}>previously used password</Text>
   </View>
   <View style={style.input}>
    
       
     <TextInput  placeholder="New password" placeholderTextColor="silver" style={style.placeholder}> 
     </TextInput>
     <View style={{paddingTop:10}}>
      <TextInput  placeholder="Match password" placeholderTextColor="silver" style={style.placeholder}> 
     </TextInput></View>
     <View style={{paddingTop:5}}>
      
     </View>


   </View>
      <View style={{paddingTop:40,alignItems:'center'}}>
        <TouchableOpacity   onPress={()=>navigation.navigate("Login")}
         style={style.button}><Text style={style.login}>Change password</Text></TouchableOpacity>
     </View>
   </View>
   </KeyboardAwareScrollView>

    )
}
const style = StyleSheet.create({
imagewrapper:{
     width: "100%",
      height: height * 0.4 ,
   // height: "80%",
    borderBottomLeftRadius: "70%",
    borderBottomRightRadius: '70%',
    overflow: "hidden", // Ensures child respects borderRadius
    position: "relative",},
     image:{
   width: "100%",
    height: height*0.4
     },
     welcome:{ fontSize: 25,
        fontFamily:"Arial",
        fontStyle:"italic",
    color: "white",
    fontWeight: "bold", 
    textAlign: "center", 
    padding: 10, 
    borderRadius: 5, 
    },
    account:{fontSize:15,textAlign:'center',color:"#B8B6F7"},
     text:{ padding:10,paddingTop:10},
     input:{paddingTop:20,justifyContent:'center',alignSelf:'center'},
    
     placeholder:{
    height: 40,
    color:"white",
    width:width* 0.8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    //backgroundColor:"#A6A4F4",
    },
    button:{
      backgroundColor: '#fff',       
    paddingVertical: 10,
    width:width* 0.8,   
    height:50,          
    paddingHorizontal: 30,             
    borderRadius: 30,                
    alignItems: "center",             
    justifyContent: "center",         
    elevation: 3,                     
    shadowColor: "#000",              
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.8,               
    shadowRadius: 5,  },
login:{ color: "balck",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"},
    forget:{color:"white",left:10}

})
export default Createpassword

