
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Image,
  Platform,
  TextInput,
} from "react-native";
;
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useDispatch, useSelector } from "react-redux";
import { leadassigned } from "../../slices/thunk";
interface CustomModalProps {
  isVisible: boolean; // Modal visibility state
  onClose: () => void;
  leadID:any
}

const { width, height } = Dimensions.get("window");
interface Option {
  label: string;
  value: string;
}


const Modalpicker: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  leadID,
}) => {
  console.log("Received leadId in Modal:", leadID);
  const [selectedOption, setSelectedOption] = useState("cold_call");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dispatch: any = useDispatch();
  const formData = useSelector(
    (state: any) => state.Update?.Followupdate || []
  );
console.log("sdsd", formData);
  const options: Option[] = [
    { label: "Cold Call", value: "cold_call" },
    { label: "Follow-up Call", value: "follow_up_call" },
    { label: "Routine Call", value: "routine_call" },
    { label: "Not Interested", value: "not_interested" },
    { label: "Won", value: "won" },
  ];

  const handlePickerChange = (itemValue: string) => {
    setSelectedOption(itemValue);
    if (itemValue === "follow_up_call") {
      setShowDatePicker(true); // Show DatePicker if "Follow-up Call" is selected
    } else {
      setShowDatePicker(false); // Hide DatePicker for other options
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
    setShowDatePicker(false); // Close DatePicker after selection
  };
  const formattedDate = selectedDate.toLocaleDateString("en-GB");

 const handleSubmit = async () => {
   if (!leadID) {
     console.error("Error: leadId is undefined");
     return;
   }
const id = leadID
   const formData = new FormData();
   formData.append("id", id);
   formData.append("status", selectedOption);
   formData.append("followUpDate", selectedDate.toISOString());
 
   console.log("Dispatching data:", formData);

   try {
     const response = await dispatch(leadassigned(formData));
     console.log("Update successful:", response);
     onClose(); 
   } catch (error) {
     console.error("Update failed:", error);
   }
 };



  
  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <View style={style.modalOverlay}>
        <View style={style.modalContent}>
          <Text style={style.modalText}>Select Option</Text>

          <Picker
            selectedValue={selectedOption}
            onValueChange={handlePickerChange}
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
          {showDatePicker && selectedOption === "follow_up_call" && (
            <View style={style.datePickerContainer}>
              <Text style={style.datePickerLabel}>Select Date:</Text>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            </View>
          )}
          {selectedOption === "follow_up_call" && (
            <View style={style.dateInputContainer}>
              <TextInput
                style={style.dateInput}
                value={formattedDate} // Display the selected date in YYYY-MM-DD format
                editable={false} // Make it read-only
              />
            </View>
          )}
          <TouchableOpacity onPress={handleSubmit} style={style.closeButton}>
            <Text style={style.closeButtonText}>Submit </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    padding: 10,
    backgroundColor: "rgb(30,129,176)",
    width: width * 0.5,
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  picker: {
    width: "100%",
    height: 200,
  },
  selectedOptionText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  iosPicker: {
    height: 250, // Adjust for iOS-specific height
  },
  androidPicker: {
    height: 200, // Adjust for Android-specific height
  },
  datePickerContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  datePickerLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  datePicker: {
    width: "80%",
  },
  selectedDateText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  dateInput: {
    width: "90%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom:10,
  },
  dateInputContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
});

export default Modalpicker;
