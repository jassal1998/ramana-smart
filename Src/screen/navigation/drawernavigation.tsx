import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LeadFollow from "../leaddetails/leadfollowup";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

const Mydrawer = () => {
  const navigation: any = useNavigation();

  return (
    <Drawer.Navigator
      initialRouteName="LeadFollow"
      screenOptions={{
        drawerStyle: {
          backgroundColor: "rgb(30,129,176)",
          width: "80%",
          borderLeftWidth: 2,
          borderRightWidth: 2,
          borderLeftColor: "#000",
          borderRightColor: "#000",
          borderRadius: 30,
          elevation: 10,
        },
        drawerLabelStyle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
        },
      }}
      drawerContent={() => (
        <View style={style.drawerContent}>
          <View style={style.container}>
            <ImageBackground
              source={require("../../../assets/1669189107737.jpeg")}
              style={style.image}
            />
          </View>
          <TouchableOpacity
            style={style.button}
            onPress={() => navigation.navigate("Leaddetail")}
          >
            <Ionicons
              name="navigate"
              size={20}
              color="white"
              style={style.icon}
            />
            <Text style={style.text}>Lead Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.button}
            onPress={() => navigation.navigate("Attendancs")}
          >
            <Ionicons
              name="pencil"
              size={20}
              color="white"
              style={style.icon}
            />
            <Text style={style.text}>Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.logoutContainer}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons
              name="log-in"
              size={30}
              color="black"
              style={style.icon}
            />
            <Text style={style.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <Drawer.Screen
        name="LeadFollow"
        component={LeadFollow}
        options={{
          title: "Daily Visits",
          swipeEnabled: false,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "rgb(30,129,176)",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      />
    </Drawer.Navigator>
  );
};

const style = StyleSheet.create({
  drawerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  container: {
    width: "60%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  button: {
    width: width * 0.7,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(30,129,176)",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutContainer: {
    flexDirection: "row",
    marginTop: 50,
  },
  logoutText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Mydrawer;
