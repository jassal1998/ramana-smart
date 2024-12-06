import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { requestOTP } from "../redux/slices/forgetslice/forgetthunk";


const { width, height } = Dimensions.get("window");
const Forget = ()=>{
    const navigation:any = useNavigation();
 const [email, setEmail] = useState("");
 const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);  
   
  const handleSubmit = async () => {
    navigation.navigate('Otpverify' ,{email})
    if (!email) {
      console.error("Email is required!");
      return;  // Ensure the email field is not empty
    }
    setLoading(true)
     
    
    try {
      // Request OTP when the form is submitted
      const result = await requestOTP(email);
      console.log("OTP sent successfully:", result);
    } catch (error: any) {
      console.error("Failed to request OTP:", error.message);
   } finally {
    // Stop loading after the request is finished (success or failure)
    setLoading(false);
  }
};

return(

<KeyboardAwareScrollView
      style={{ backgroundColor:'#6F6AF0',flex:1,}}
      //contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true} // Enable for Android
      keyboardOpeningTime={0} // Adjust the time for keyboard opening
    >
    <View style={style.imagewrapper}>
<Image source={require("../../../assets/forget.jpg")} style={style.image}/>
   </View>
    <View style={{paddingTop:10}}>
        <Text style={style.forget}>Forget Password?</Text>
       <View style={{padding:10}}> <Text style={style.email}>Enter your registered email below to receive </Text>
       <Text style={style.password}>password rest instruction</Text></View>
       <View style={{alignSelf:'center',paddingTop:20}}>
        <Ionicons name="mail-outline" size={20} color="#fff" style={style.icon} />
      {/* TextInput for Email */}
      <TextInput
        style={style.placeholder}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
       
        keyboardType="email-address"
        autoCapitalize="none"
      />
       </View>
       <View style={{paddingTop:10,marginTop:30,alignSelf:'center'}}>
        
        <TouchableOpacity
        style={style.button} // Reduce opacity when loading
        onPress={handleSubmit}
       
      >
        {loading ? (
          <ActivityIndicator size="small" color="#silver" /> // Show spinner when loading
        ) : (
          <Text style={style.verify}>Verify</Text> // Show text when not loading
        )}
      </TouchableOpacity>
        
        
        
        </View>
    </View>
   
</KeyboardAwareScrollView>
)
}
const style= StyleSheet.create({
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
     forget:{textAlign:'center',fontSize:25,color:'white'},
     email:{textAlign:'center',color:'white'},
     password:{textAlign:"center",color:'white'},

      placeholder:{
    height: 40,
    color:"white",
    width:width* 0.8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 40,
    fontSize: 16,
    //backgroundColor:"#A6A4F4",
    },
    icon:{position: 'absolute',
    top:20,
   
    //backgroundColor: '#007AFF',
    borderRadius: 40,
    padding: 10,},
    button:{ width:width* 0.9,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,},
    verify:{textAlign:'center',color:'balck',fontWeight:'500'}
})
export default Forget
