import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ visible, onClose, onConfirm }) => {
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState<Date | null>(null); // Temporary date for Android

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedDate) {
        setTempDate(selectedDate); // Set temp date
        onConfirm(selectedDate); // Confirm and close
        onClose();
      } else if (event.type === "dismissed") {
        onClose(); // Dismiss the modal
      }
    } else {
      if (selectedDate) setDate(selectedDate); // For iOS, update the state only
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select a Date</Text>
          {Platform.OS === "ios" && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
          {Platform.OS === "android" && (
            <DateTimePicker
              value={tempDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          {Platform.OS === "ios" && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onConfirm(date);
                  onClose();
                }}
                style={[styles.button, styles.confirmButton]}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "rgb(30,129,176)",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DatePickerModal;
