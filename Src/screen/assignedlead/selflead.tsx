import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View,KeyboardAvoidingView,Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { selfpost } from "../../slices/thunk";
import CustomToast from "../customTost/Tost";




const SelfLead = ()=>{

     const [id, setId] = useState<string>("");
     let decoded: any = null;
    const dispatch: any = useDispatch();

     useEffect(() => {
       const fetchToken = async () => {
         try {
           const saveToken: any = await AsyncStorage.getItem("userToken");
           decoded = jwtDecode(saveToken);
           setId(decoded.employeeId);
           console.log("sdsds", decoded);
         } catch (error) {
           console.error("Error fetching token:", error);
         }
       };
       fetchToken();
     }, []);


    const [status, setStatus] = useState("OWN");
     const [date, setDate] = useState(new Date());
     const [showPicker, setShowPicker] = useState(false);
const [formattedDate, setFormattedDate] = useState("");
const [leadName, setLeadName] = useState("");
const [companyName, setCompanyName] = useState("");
const [email, setEmail] = useState("");
const [contactNo, setContactNo] = useState("");
const [location, setLocation] = useState("");
const [remarks, setRemarks] = useState("");
const [loading, setLoading] = useState(false);
 const [toastVisible, setToastVisible] = useState(false);
 const [toastMessage, setToastMessage] = useState("");

 const Data = useSelector((state: any) => state.selflead?.self || []);
console.log("self",Data )




  const onChange = (event:any, selectedDate:any) => {

    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(selectedDate.toLocaleDateString()); 
    }
  };


  const handleSubmit = async () => {
    setLoading(true);
    const formattedDateOnly = date.toISOString().split("T")[0];
    const leadData = {
      LCI: id,
      leadName,
      companyName,
      email,
      contactNo,
      location,
      remarks,
      status,
      followUpDate: formattedDateOnly,
    };

    console.log("Submitting Data:", leadData);
    try {
      await dispatch(selfpost(leadData));
      showToast("Lead successfully submitted! ✅");
    } catch (error) {
      console.error("Submission Error:", error);
      showToast("Submission failed. Please try again! ❌");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message:any) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000); // Hide toast after 3 seconds
  };

return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <KeyboardAwareScrollView
      style={style.container}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={30}
      extraHeight={30}
      keyboardOpeningTime={0} // Ensure immediate response
      enableAutomaticScroll={true}
    >
      <View>
        <View style={style.retailer}>
          <Text allowFontScaling={false} style={style.name}>
            Lead Name
          </Text>
          <Text allowFontScaling={false} style={style.star}>
            ***
          </Text>
        </View>
        <View style={{ paddingTop: 10, alignItems: "center" }}>
          <TextInput
            allowFontScaling={false}
            style={style.input2}
            value={leadName}
            onChangeText={setLeadName}
          ></TextInput>
        </View>
        <View style={style.retailer}>
          <Text allowFontScaling={false} style={style.name}>
            Company Name
          </Text>
          <Text allowFontScaling={false} style={style.star}>
            ***
          </Text>
        </View>
        <View style={{ paddingTop: 10, alignItems: "center" }}>
          <TextInput
            allowFontScaling={false}
            style={style.input2}
            value={companyName}
            onChangeText={setCompanyName}
          ></TextInput>
        </View>
        <View style={style.retailer}>
          <Text allowFontScaling={false} style={style.name}>
            Email
          </Text>
          <Text allowFontScaling={false} style={style.star}>
            ***
          </Text>
        </View>
        <View style={{ paddingTop: 10, alignItems: "center" }}>
          <TextInput
            allowFontScaling={false}
            style={style.input2}
            value={email}
            onChangeText={setEmail}
          ></TextInput>
        </View>
        <View style={style.retailer}>
          <Text allowFontScaling={false} style={style.name}>
            Contact No
          </Text>
          <Text allowFontScaling={false} style={style.star}>
            ***
          </Text>
        </View>
        <View style={{ paddingTop: 10, alignItems: "center" }}>
          <TextInput
            allowFontScaling={false}
            style={style.input2}
            value={contactNo}
            onChangeText={setContactNo}
          ></TextInput>
        </View>
        <View style={style.retailer}>
          <Text allowFontScaling={false} style={style.name}>
            Location
          </Text>
          <Text allowFontScaling={false} style={style.star}>
            ***
          </Text>
        </View>
        <View style={{ paddingTop: 10, alignItems: "center" }}>
          <TextInput
            allowFontScaling={false}
            style={style.input2}
            value={location}
            onChangeText={setLocation}
          ></TextInput>
        </View>
        <View style={style.retailer}>
          <Text allowFontScaling={false} style={style.name}>
            Status
          </Text>
          <Text allowFontScaling={false} style={style.star}>
            ***
          </Text>
        </View>
        <View style={{ paddingTop: 10, alignItems: "center" }}>
          <TextInput
            allowFontScaling={false}
            style={[
              style.input2,
              status === "OWN" ? { backgroundColor: "#e0e0e0" } : {},
            ]}
            editable={status !== "OWN"}
            value="OWN"
          />
        </View>
        <View style={{ paddingTop: 10 }}>
          <View style={style.retailer}>
            <Text allowFontScaling={false} style={style.name}>
              Follow Update
            </Text>
            <Text allowFontScaling={false} style={style.star}>
              ***
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              width: "100%", // Set width to 100
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <View>
              <TextInput
                allowFontScaling={false}
                style={{ flex: 1, width: "100%" }}
                value={formattedDate}
                placeholder="Select"
                editable={false} // Prevent manual editing
              />
            </View>
            <MaterialIcons
              name="date-range"
              size={20}
              color="red"
              style={style.icon}
            />
          </TouchableOpacity>

          {/* Show Date Picker when needed */}
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </View>
        <View style={style.retailer}>
          <Text allowFontScaling={false} style={style.name}>
            Remarks
          </Text>
          <Text allowFontScaling={false} style={style.star}>
            ***
          </Text>
        </View>
        <View style={{ paddingTop: 10, alignItems: "center" }}>
          <TextInput
            allowFontScaling={false}
            style={style.input3}
            value={remarks}
            onChangeText={setRemarks}
            multiline
            numberOfLines={4}
          />
        </View>

        <View>
          <TouchableOpacity style={style.button} onPress={handleSubmit}>
            <Text style={style.submit}>
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
          <CustomToast
            visible={toastVisible}
            message={toastMessage}
            duration={15000}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  </KeyboardAvoidingView>
);
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 10,
  },
  retailer: { flexDirection: "row", paddingTop: 10 },
  star: { color: "red", left: 5 },
  name: { fontWeight: "700" },
  input2: {
    height: 50,
    color: "balck",
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
  },
  icon: {
    position: "absolute",
    right: 10,
  },
  button: {
    backgroundColor: "#1E81B0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  submit: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input3: {
    height: 100,
    color: "balck",
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
  },
});

export default SelfLead