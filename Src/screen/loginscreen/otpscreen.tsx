import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const { width, height } = Dimensions.get("window");

const Otp =()=> {
    const navigation:any = useNavigation();
    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
   const inputs = useRef<Array<TextInput | null>>([]);


const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;

    if (text.length === 1) {
      // Move to the next input if filled
      if (index < otp.length - 1) {
        inputs.current[index + 1]?.focus();
      }
    } else if (text.length === 0 && index > 0) {
      // Move to the previous input if cleared
      inputs.current[index - 1]?.focus();
    }

    setOtp(newOtp); // Always update the OTP state
  };


  const handleSubmit = () => {
      navigation.navigate("Leaddetail");
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);
    if (enteredOtp.length === 4) {
     
    } else {
      alert("Please enter a valid 4-digit OTP.");
    }
  };

const simulateOtp = (receivedOtp: string) => {
    if (receivedOtp.length === 4) {
      const newOtp = receivedOtp.split('');
      setOtp(newOtp); // Update OTP state to auto-fill TextInputs
    }
  };

return(
<KeyboardAwareScrollView
      style={{ backgroundColor:'#6F6AF0',flex:1,}}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true} // Enable for Android
      keyboardOpeningTime={0} // Adjust the time for keyboard opening
    >
<View >
     <View style={style.imagewrapper}>
<Image source={require("../../../assets/otp.jpg")} style={style.image}/>
   </View>
   <View style={{paddingTop:10,flexDirection:"row",alignSelf:'center'}}>
    <Text style={style.otp}>OTP Code </Text>
    <Text style={style.verify}>Verification </Text>
   </View>
   <View style={{paddingTop:5,padding:10}}>
    <Text style={style.phone}>We have sent an OTP code to your Phone No
        +91******88 Enter the code below to verify
    </Text>
   </View>
    <View style={style.otpContainer}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              style={style.otpBox}
              value={value}
             onChangeText={(text)=>handleChange(text,index)}
              keyboardType="numeric"
              maxLength={1}
              ref={(ref) => (inputs.current[index] = ref)}
              returnKeyType="done"
               accessibilityLabel={`OTP Input ${index + 1}`}
            />
          ))}
        </View>
         <View style={style.submitButtonContainer}>
          <TouchableOpacity style={style.submitButton} onPress={handleSubmit}>
            <Text style={style.submitButtonText}>Verify</Text>
          </TouchableOpacity>
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
otp:{fontSize:25,fontWeight:'500',color:'white'},
verify:{fontSize:25,fontWeight:"300",color:'white'},
phone:{textAlign:"center",color:"white"},
 otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    backgroundColor: "#6F6AF0",
  },
  submitButtonContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  submitButton: {
    width:width* 0.9,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  submitButtonText: {
    textAlign:'center',
    color: "#6F6AF0",
    fontWeight: "bold",
    fontSize: 16,
  },
})
export default Otp 