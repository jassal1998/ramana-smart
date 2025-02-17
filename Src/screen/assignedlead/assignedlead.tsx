import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssigned, leadassigned } from "../../slices/thunk";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomToast from "../customTost/Tost";

interface Option {
  label: string;
  value: string;
}

const options: Option[] = [
  { label: "Cold Call", value: "cold_call" },
  { label: "Follow-up Call", value: "follow_up_call" },
  { label: "Routine Call", value: "routine_call" },
  { label: "Not Interested", value: "not_interested" },
  { label: "Won", value: "won" },
];

const Assignedlead = () => {
  const [id, setId] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState("cold_call");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pendingLeadId, setPendingLeadId] = useState<string>("");
  const [tempDate, setTempDate] = useState(new Date());
  const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false); 
  let decoded: any = null;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const saveToken: any = await AsyncStorage.getItem("userToken");
        decoded = jwtDecode(saveToken);
        setId(decoded.employeeId);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    fetchToken();
  }, []);

  const dispatch: any = useDispatch();
  useEffect(() => {
    dispatch(fetchAssigned(id));
  }, [dispatch, id]);

  const Data = useSelector((state: any) => state.Assign?.assignData || []);

 
  const formattedDate = selectedDate.toLocaleDateString("en-GB");

 
  const handleSubmit = async (leadId: string, option: string, date: Date) => {
    const formData = new FormData();
    formData.append("id", leadId);
    formData.append("status", option);
    formData.append("followUpDate", date.toISOString());

    try {
      const response = await dispatch(leadassigned(formData));
      console.log("Update successful:", response);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  
  const handlePickerChange = async (itemValue: string, leadId: string) => {
    setSelectedOption(itemValue);
    if (itemValue === "follow_up_call") {
      
      setPendingLeadId(leadId);
      setTempDate(new Date()); 
      setShowDatePicker(true);
    } else {
      
      await handleSubmit(leadId, itemValue, selectedDate);
    }
  };

  
  const handleDateChange = (
    event: any,
    date: Date | undefined,
    leadId: string
  ) => {
    if (event.type === "set" && date) {
      setTempDate(date);
      
      setShowDatePicker(false);
    } else if (event.type === "dismissed") {
      setShowDatePicker(false);
    }
  };

  
  const confirmDateSelection = async (leadId: string) => {
    setIsLoading(true);
    setSelectedDate(tempDate); 
    await handleSubmit(leadId, "follow_up_call", tempDate);
  
    setPendingLeadId("");
    setIsLoading(false);
    setToastMessage("Follow-up date updated successfully!");
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2000);
  };


   const getDisplayDate = (leadId: string) => {
     const dateToShow = pendingLeadId === leadId ? tempDate : selectedDate;
     return dateToShow.toLocaleDateString("en-GB");
   };

  
  const LeadCard = ({ lead }: { lead: any }) => {
    return (
      <View style={style.card}>
        <View style={style.row}>
          <Text style={style.title}>ID: </Text>
          <Text style={style.title}>{lead.id}</Text>
        </View>
        <View style={style.divider}></View>
        <View style={style.row}>
          <Text style={style.title}>Name: </Text>
          <Text style={style.title}>{lead.leadName}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.text}>Company: </Text>
          <Text style={style.text}> {lead.companyName}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.text}>Email: </Text>
          <Text style={style.text}>{lead.email}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.text}>Contact: </Text>
          <Text style={style.text}>{lead.contactNo}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.text}>Location: </Text>
          <Text style={style.text}> {lead.location}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.text}>Assigned To: </Text>
          <Text style={style.text}> {lead.assignedTo}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.text}>Status: </Text>
          <Text style={style.text}> {lead.status}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.text}>updatedAt: </Text>
          <Text style={style.text}>
            {new Date(lead.updatedAt).toLocaleDateString("en-GB")}
          </Text>
        </View>

        <View style={style.container2}>
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) =>
              handlePickerChange(itemValue, lead.id)
            }
            style={[
              style.picker,
              Platform.OS === "ios" ? style.iosPicker : style.androidPicker,
            ]}
          >
            {options.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>

          {selectedOption === "follow_up_call" && (
            <View style={style.dateInputContainer}>
              <TextInput
                style={style.dateInput}
                value={getDisplayDate(lead.id)}
                editable={false}
              />
            </View>
          )}

          {selectedOption === "follow_up_call" &&
            showDatePicker &&
            pendingLeadId === lead.id && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="default"
                onChange={(event, date) =>
                  handleDateChange(event, date, lead.id)
                }
              />
            )}

          {selectedOption === "follow_up_call" &&
            !showDatePicker &&
            pendingLeadId === lead.id && (
              <TouchableOpacity
                style={[style.button, isLoading && { opacity: 0.6 }]}
                onPress={() => !isLoading && confirmDateSelection(lead.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={style.buttonText}>Confirm Date</Text>
                )}
              </TouchableOpacity>
            )}
          <CustomToast
            visible={toastVisible}
            message={toastMessage}
            duration={15000}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={style.container}>
      <FlatList
        data={Object.values(Data)}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => <LeadCard lead={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={style.emptyText}>No leads available</Text>
        }
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  card: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    padding: 10,
  },
  title: {
    fontSize: 16,
    color: "#7A7A7A",
    fontWeight: "500",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "rgb(30,129,176)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  container2: {
    backgroundColor: "rgb(86, 152, 183)",
    paddingVertical: 8, 
    paddingHorizontal: 10,
    borderRadius: 8,
    
   
    flexDirection: "column", 
    height: "auto", 
  },
  divider: {
    width: "80%",
    alignSelf: "center",
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  picker: {
    width: "100%",
    height: 40,
    alignSelf: "center", // Ensures it stays centered
    marginTop: -40,
  },
  iosPicker: {
    height: 250,
    textAlign: "center",
  },
  androidPicker: {
    marginBottom: -40,
    height: 100,
    color:'#FFF'
  },
  dateInputContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  dateInput: {
    width: "100%",
    height: 40,
    borderColor: "#FFF",
    color:"#fff",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
});

export default Assignedlead;
