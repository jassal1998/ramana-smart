import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceData } from "../../slices/thunk";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

interface AttendanceItem {
  id: any;
  factoryName: any;
  inTime: any;
  outTime: any;
  inLongitude: any;
  inLatitude: any;
  inPhotoUrl: any;
}

const AttendanceLead = () => {

  const [id, setId] = useState<string>("");
  
  let decoded: any = null;
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const saveToken: any = await AsyncStorage.getItem("userToken");
        decoded = jwtDecode(saveToken);
        setId(decoded.userid);

        console.log(decoded, "bbbbbbb");
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    fetchToken();
    console.log("TokenDecoded :", decoded);
  }, []);

   

  const dispatch: any = useDispatch();
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const [showButton, setShowButton] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [status, setStatus] = useState<"IN" | "OUT" | null>();
  
  const attendanceData = useSelector(
    (state: any) => state.AttendanceLead?.Lead
  );

  console.log("adcasda", attendanceData);

  useEffect(() => {
    console.log("Fetching data for ID:", id || "ALL");
    dispatch(fetchAttendanceData(id));
  }, [dispatch, id]);

 

   const getStatusColor = (inTime: string | null, outTime: string | null) => {
     if (outTime) {
       setShowButton(true); 
       return "red";
     }
     if (inTime) {
       setShowButton(false); 
       return "green";
     }
     return "gray";
   };


  const dataArray: AttendanceItem[] = attendanceData
    ? Object.values(attendanceData)
    : [];

    const handleRefresh = async () => {
      setIsRefreshing(true); 
      try {
        await dispatch(fetchAttendanceData(id)); 
      } finally {
        setIsRefreshing(false); 
      }
    };
useEffect(() => {
 
  const getStatusFromStorage = async () => {
    const storedStatus:any  = await AsyncStorage.getItem("status");
    setStatus(storedStatus); // Update the local state
  };
  getStatusFromStorage();
}, []);
 useEffect(() => {
  console.log("Current Status:", status);
   navigation.setOptions({
     headerRight: () => {
       if (status === "OUT") {
         return (
           <TouchableOpacity
             style={{ marginRight: 10 }}
             onPress={() =>
               navigation.navigate("Attendance", {
                 reset: true,
                 key: Date.now().toString(),
               })
             }
           >
             <Ionicons name="add-circle-outline" size={28} color="#fff" />
           </TouchableOpacity>
         );
       }
       return null; 
     },
   });
 }, [status, navigation]);


  const renderCompanyCard = ({ item }: { item: AttendanceItem }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Attendance", {
          factoryName: item.factoryName,
          inLongitude: item.inLongitude,
          inLatitude: item.inLongitude,
          inPhotoUrl: item.inPhotoUrl,
          status: "OUT",
          highlightOutButton: true,
        })
      }
    >
      <View style={style.card}>
        <Text style={style.companyName}>Factory Name: {item.factoryName}</Text>
        <View style={style.timeContainer}>
          <View style={style.timeTextContainer}>
            <Text style={style.markup}>In Time: {item.inTime || "Not In"}</Text>
            <Text style={style.markup}>
              Out Time: {item.outTime || "Not Out"}
            </Text>
          </View>

          <View
            style={[
              style.statusLight,
              { backgroundColor: getStatusColor(item.inTime, item.outTime) },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={style.container}>
      {dataArray.length > 0 ? (
        <FlatList
          data={dataArray}
          renderItem={renderCompanyCard}
          keyExtractor={(item: any) => item.id.toString()}
          contentContainerStyle={style.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing} // Track refreshing state
              onRefresh={handleRefresh} // Call the refresh function
              colors={["#2f5272"]} // Customize refresh indicator color
            />
          }
        />
      ) : (
        <Text style={style.noDataText}>No data available.</Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  list: {
    padding: 10,
    paddingBottom: 20,
  },
  card: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#fff", // White background for the card
    borderRadius: 10, // Rounded corners
    flex: 1,
    padding:10,
    marginVertical: 15, // Space between cards
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 5, // Shadow blur radius
    elevation: 5,
    minHeight: 100,
  },
  companyName: {
    fontSize: 15,
  },
  markup: {
    fontSize: 16,

    marginTop: 5,
  },
  noDataText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  statusLight: {
    width: 15,
    height: 15,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  timeTextContainer: {
    flex: 1,
  },
  
});

export default AttendanceLead;
