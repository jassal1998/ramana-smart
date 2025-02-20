import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
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


const LeadCard = ({ lead }: { lead: any }) => {
  const dispatch: any = useDispatch();

  
  const [selectedOption, setSelectedOption] = useState("cold_call");
  const [tempDate, setTempDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState("");

  


  
  const handleSubmit = async (
    leadId: string,
    option: string,
    date: Date,
    remarks: string
  ) => {
     setIsLoading(true);
    console.log("Submitting data for lead:", leadId, { option, date, remarks });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const formData = new FormData();
    formData.append("id", leadId);
    formData.append("status", option);
    formData.append("followUpDate", date.toISOString());
    formData.append("remarks", remarks);
    try {
      const response = await dispatch(leadassigned(formData));
      console.log("Update successful:", response);
    } catch (error) {
      console.error("Update failed:", error);
    }
     setIsLoading(false);
  };

  
  const handlePickerChange = (itemValue: string) => {
    setSelectedOption(itemValue);
    if (itemValue === "follow_up_call") {
     
      setTempDate(new Date());
      setShowDatePicker(true);
    }
  };

 
  const handleDateChange = (event: any, date: Date | undefined) => {
    if (event.type === "set" && date) {
      setTempDate(date);
      setShowDatePicker(false);
    } else if (event.type === "dismissed") {
      setShowDatePicker(false);
    }
  };

  
 const confirmDateSelection = async () => {
   setIsLoading(true);
   setSelectedDate(tempDate);
   
   await new Promise((resolve) => setTimeout(resolve, 2000));
   await handleSubmit(lead.id, "follow_up_call", tempDate, remarks);
   setIsLoading(false);
 };
  
  const getDisplayDate = () => {
    return tempDate.toLocaleDateString("en-GB");
  };

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
        <Text style={style.text}>{lead.companyName}</Text>
      </View>
      <View style={style.row}>
        <Text style={style.text}>Email: </Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`mailto:${lead.email}`).catch((err) =>
              console.error("Error opening email app:", err)
            );
          }}
        >
          <Text
            style={[
              style.text,
              { color: "blue", textDecorationLine: "underline" },
            ]}
          >
            {lead.email}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={style.row}>
        <Text style={style.text}>Contact: </Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`tel:${lead.contactNo}`).catch((err) =>
              console.error("Error opening dialer:", err)
            );
          }}
        >
          <Text
            style={[
              style.text,
              { color: "blue", textDecorationLine: "underline" },
            ]}
          >
            {lead.contactNo}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={style.row}>
        <Text style={style.text}>Location: </Text>
        <Text style={style.text}>{lead.location}</Text>
      </View>
      <View style={style.row}>
        <Text style={style.text}>Assigned To: </Text>
        <Text style={style.text}>{lead.assignedTo}</Text>
      </View>
      <View style={style.row}>
        <Text style={style.text}>Status: </Text>
        <Text style={style.text}>{lead.status}</Text>
      </View>
      <View style={style.row}>
        <Text style={style.text}>Updated At: </Text>
        <Text style={style.text}>
          {new Date(lead.updatedAt).toLocaleDateString("en-GB")}
        </Text>
      </View>

      <View style={style.container2}>
        <Picker
          selectedValue={selectedOption}
          onValueChange={(itemValue) => handlePickerChange(itemValue)}
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
          <>
            <View style={style.dateInputContainer}>
              <TextInput
                style={style.dateInput}
                value={getDisplayDate()}
                editable={false}
              />
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </>
        )}
      </View>

      <View style={{ marginTop: 10 }}>
        <TextInput
          style={style.input}
          value={remarks}
          placeholder="Remarks"
          placeholderTextColor={"white"}
          onChangeText={setRemarks}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={[style.button, isLoading && { opacity: 0.6 }]}
        onPress={() => {
          if (selectedOption === "follow_up_call") {
            confirmDateSelection();
          } else {
            handleSubmit(lead.id, selectedOption, selectedDate, remarks);
          }
        }}
      >
        {isLoading ? (
          <View style={{ width: 20, height: 20 }}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : (
          <Text style={style.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};


const Assignedlead = () => {
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

  useEffect(() => {
    dispatch(fetchAssigned(id));
  }, [dispatch, id]);

  const Data = useSelector((state: any) => state.Assign?.assignData || []);

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
    alignSelf: "center",
    marginTop: -40,
  },
  iosPicker: {
    height: 250,
    textAlign: "center",
  },
  androidPicker: {
    marginBottom: -40,
    height: 100,
    color: "#FFF",
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
    color: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: "#FFF",
    backgroundColor: "silver",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default Assignedlead;
