import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface CustomToastProps {
  visible: boolean;
  message: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ visible, message }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 2000); // Toast visible duration
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
        <Text style={styles.toastText} numberOfLines={1}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",  // Ensure the parent view takes up full width
    position: "absolute",
    bottom: 50,
    alignItems: "center",  // Center the toast horizontally
  },
  toastContainer: {
    width: 200,  // Adjust width to 90% of screen width
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  toastText: {
    color: "white",
    fontSize: 13,  // Increased font size for better readability
    textAlign: "center",  // Ensure text is centered
    width: "100%",  // Make sure text takes full width
    flexWrap: "wrap",  // Allow wrapping if text is too long
    overflow: "visible",  // Allow overflow to wrap properly
  },
});

export default CustomToast;
