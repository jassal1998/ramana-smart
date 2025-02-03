import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssigned } from "../../slices/thunk";



const leadsData = [
  {
    id: "L001",
    leadName: "John Doe",
    companyName: "ABC Corp",
    email: "john.doe@abc.com",
    contactNo: "+1 234 567 890",
    location: "New York, USA",
    assignedTo: "Michael Smith",
    status: "Pending",
  },
  
];




const Assignedlead=()=>{

 const [id, setId] = useState<string>("");
 let decoded: any = null;
 useEffect(() => {
   const fetchToken = async () => {
     try {
       const saveToken: any = await AsyncStorage.getItem("userToken");
       decoded = jwtDecode(saveToken);
       setId(decoded.userid);

       console.log(decoded, "smarty");
     } catch (error) {
       console.error("Error fetching token:", error);
     }
   };
   fetchToken();
   console.log("TokenDecoded :", decoded);
 }, []);

const dispatch: any = useDispatch();

const Data = useSelector((state: any) => state.Assign?.assignData || []);
console.log("hgfjk",Data)

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
        <Text style={[style.text]}>Status: </Text>
        <Text style={[style.text]}> {lead.status}</Text>
      </View>
      <View style={style.container2}>
        <TouchableOpacity style={style.button}>
          <Text style={style.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};






 useEffect(() => {
   dispatch(fetchAssigned(id)); 
 }, [dispatch, id]);




    return (
      <View style={style.container}>
        {/* Conditional Rendering of FlatList or empty message */}
        <FlatList
          data={Object.values(Data)} // Convert the object to an array using Object.values()
          keyExtractor={(item:any ) => item.id.toString()} // Ensure unique keys
          renderItem={({ item }) => <LeadCard lead={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={style.emptyText}>No leads available</Text> // Display when no data is available
          }
        />
      </View>
    );
}


const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    padding: 10,
  },
  card: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff", // White background for the card
    borderRadius: 10,
    flex: 1,
    marginVertical: 15,
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 5, // Shadow blur radius
    elevation: 5,
    minHeight: 100,
  },
  title: {
    fontSize: 16,
    color: "#7A7A7A",
    fontWeight: "500",
    fontFamily: "Arial",
    letterSpacing: 0.5,

    marginBottom: 5,
    textTransform: "capitalize",
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  completed: {
    color: "green",
  },
  pending: {
    color: "red",
  },
  row: {
    padding: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "rgb(30,129,176)",
    width: "100%",

    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",

    justifyContent: "center",
    elevation: 3, // Adds shadow on Android
    shadowColor: "#000", // Adds shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  container2: {
    width: "40%",
    alignSelf: "flex-end",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    width: "80%",
    alignSelf: "center",
    height: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 1,
    marginVertical: 10,
  },
});

export default Assignedlead