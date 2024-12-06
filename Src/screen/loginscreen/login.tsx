import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, ImageBackground, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { requestLogin } from "../redux/slices/login/thunk";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";





const { width, height } = Dimensions.get("window");

const Login =()=>{

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
 const [errorMessage, setErrorMessage] = useState('');
   const navigation:any = useNavigation();





   const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };





const handleLogin = async () => {

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }
    
    setLoading(true);
    setErrorMessage(''); // Clear previous errors

    try {
      await requestLogin(email, password, navigation.navigate);
      setLoading(false)
      navigation.navigate('Mydrawer', { screen: 'LeadFollow' });
    } catch (error: any) {
      
      setLoading(false)
      setErrorMessage(error.message || 'Wrong Email Pasword');

if (error.message.includes("Wrong password")) {
      setErrorMessage("Incorrect password. Please try again.");
    } else if (error.message.includes("email not found")) {
      setErrorMessage("Email not found. Please check the entered email.");
    } else {
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }

    }
  };

  
 


   

return(
    <KeyboardAwareScrollView
      style={{ backgroundColor:'#6F6AF0',flex:1,}}
      //contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true} // Enable for Android
      keyboardOpeningTime={0} // Adjust the time for keyboard opening
    >
<View>
    <View style={style.imagewrapper}>
<Image source={require("../../../assets/location.jpg")} style={style.image}/>
   </View>
     <View style={style.text} >
    <Text style={style.welcome} >Welcome for Login</Text>
    <Text style={style.account} > Login for account</Text>
   </View>
   <View style={style.input}>
    
       
     <TextInput  placeholder="Enter your email" placeholderTextColor="silver" 
        value={email} onChangeText={setEmail}          style={[style.placeholder,{fontSize:RFPercentage(1.80)}]}> 
     </TextInput>
     <View style={{paddingTop:10}}>
      <TextInput  placeholder="Enter your Password" placeholderTextColor="silver"
       value={password}
       onChangeText={setPassword}
      style={[style.placeholder,{fontSize:RFPercentage(1.80)}]}> 
     </TextInput></View>
     <View style={{paddingTop:5,}}>
      <TouchableOpacity  onPress={()=>navigation.navigate("Forget")}>
        <Text style={style.forget}>Forget password</Text></TouchableOpacity>
        
     </View>


   </View>
      <View style={{paddingTop:40,alignItems:'center'}}>
       <TouchableOpacity 
            onPress={handleLogin} 
            style={[style.button, loading && { backgroundColor: 'gray' }]} 
           
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={style.login}>Login</Text>
            )}
          </TouchableOpacity>
     </View>
     {/* <View style={{paddingTop:5,flexDirection:"row"}}>
      
        <Text style={style.account}> Doesn't have an acconut?</Text>
        <TouchableOpacity  onPress={()=>navigation.navigate("Forget")}>
        <Text style={style.signup}>Sign up</Text></TouchableOpacity>
        
        
     </View> */}
     
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
      fontSize:10,
      padding:10,
      fontFamily:'Arial',
    height: 40,
    color:"white",
    width:width* 0.8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    
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
    forget:{color:"white",textAlign:'right',},
    signup:{}
})
export default Login;

function getResponsiveFontSize(basePercentage: number) {
  throw new Error("Function not implemented.");
}
