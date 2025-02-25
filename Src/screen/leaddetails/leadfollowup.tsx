import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { fetchData } from "../../slices/thunk";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

interface LeadData {
  name: any;
  contractNumber: any;
  id: number;
  retailerName: string;

  followUpDate: string;
  leadPhase: string;
  newImage: string;
  outletAddress: string;
  longitude: string;
  latitude: string;
}

const LeadFollow = () => {
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
  console.log(navigation);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showColdCalls, setShowColdCalls] = useState<boolean>(false);
  const [showFollowUpCalls, setShowFollowUpCalls] = useState<boolean>(false);
  const [showAllData, setShowAllData] = useState(true);
const [isRefreshing, setIsRefreshing] = useState(false);
  const LeadData = useSelector((state: any) => state.Follow.Card || []);

  //  useEffect(() => {
  //     dispatch(fetchData());
  //   }, [dispatch]);




const checkAuth = async () => {
  try {
    const savedToken: any = await AsyncStorage.getItem("userToken");

    if (!savedToken) {
      console.log("No token found, logging out");
      await AsyncStorage.removeItem("userToken");
      navigation.navigate("Login");
      return;
    }

    // Decode the token
    const decodedToken: any = jwtDecode(savedToken);
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.log("Token expired, logging out");
      await AsyncStorage.removeItem("userToken");
      navigation.navigate("Login");
    }
  } catch (error) {
    console.error("Error fetching or decoding token:", error);
  }
};

useEffect(() => {
  checkAuth();
}, []);
if (isLoading) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

  const [data, setData] = useState<LeadData[]>([
    {
      name: "Manna Machines",
      contractNumber: "",
      followUpDate: "",
      leadPhase: "follow_up_call",
      id: 0,
      retailerName: "",

      newImage: "",
      outletAddress: "",
      longitude: "",
      latitude: "",
    },
    {
      name: "Pub Sohna",
      contractNumber: "",
      followUpDate: "",
      leadPhase: "follow_up_call,cold_call",
      id: 0,
      retailerName: "",

      newImage: "",
      outletAddress: "",
      longitude: "",
      latitude: "",
    },
    {
      name: "Test",
      contractNumber: "",
      followUpDate: "",
      leadPhase: "cold_call",
      id: 0,
      retailerName: "",

      newImage: "",
      outletAddress: "",
      longitude: "",
      latitude: "",
    },
  ]);

  const filteredData = data.filter((item: any) => {
    const matchesSearchQuery =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contractNumber?.includes(searchQuery);

    const matchesFollowUpCall = showFollowUpCalls
      ? item.leadPhase.includes("follow_up_call")
      : false;

    const matchesColdCall = showColdCalls
      ? item.leadPhase.includes("cold_call")
      : false;

    const matchesAll = showAllData || matchesFollowUpCall || matchesColdCall;

    return matchesSearchQuery && matchesAll;
  });

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setIsLoading(true); 
   
    setTimeout(() => {
      setIsLoading(false); 
    }, 500);
  };




  const handleContractNumberChange = (id: string, value: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        LeadData.id === id ? { ...item, contractNumber: value } : item
      )
    );
  };
  // const handleArrowClick = (item: ContractItem) => {
  //    console.log(item);
  //     dispatch(setSelectedContract(item)); // Dispatch selected contract
  //     navigation.navigate("Leaddetail",{contractDetail:item});
  //   };

 useEffect(() => {
   if (id) {
    
     dispatch(fetchData(id));
   }
 }, [id, dispatch]);
   


const handleRefresh = async () => {
  setIsRefreshing(true);
  try {
    await dispatch(fetchData(id));
  } finally {
    setIsRefreshing(false);
  }
};



  useEffect(() => {
    console.log("zxzxz", LeadData);
    if (Array.isArray(LeadData?.data) && LeadData.data.length > 0) {
      const processedData = LeadData.data.map((item: any) => ({
        id: item.id.toString(),
        name: item.retailerName || "Unknown Company", // Add a default value for retailerName
        contractNumber: item.contactNo || "No Contact", // Add a default value for contactNo
        followUpDate: item.followUpDate || "No Date", // Add a default value for followUpDate
        leadPhase: item.leadPhase || "No Lead Phase", // Add a default value for leadPhase
        retailerName: item.retailerName || "Unknown Company", // Ensure this is included
        longitude: item.longitude || "",
        latitude: item.latitude || "",
        newImage: item.newImage || "", // Ensure this is included
        outletAddress: item.outletAddress || "Unknown Address", // Ensure this is included
      }));

      setData(processedData);
      console.log("Data loaded:", processedData);
      setIsLoading(false); // Data is loaded, stop loading indicator
    } else {
      console.error("LeadData is not an array or is empty:", LeadData);
      setIsLoading(false); // Stop loading even if the data is empty
    }
  }, [LeadData]);

  const handleArrowClick = (item: LeadData) => {
    console.log("Clicked Item:", item);
  };

  const renderItem = ({ item }: { item: LeadData }) => (
    <TouchableOpacity
      onPress={() => {
        if (item) {
          console.log("Navigating with item:", item);
          navigation.navigate("Leaddetail", { item });
        } else {
          console.log("Item is undefined or not available!");
        }
      }}
    >
      <View
        style={style.card}
       
      >
        <View style={style.row}>
          <Text allowFontScaling={false} style={style.label}>
            ID:
          </Text>
          <Text allowFontScaling={false} style={style.value}>
            {item.id || "No ID"}
          </Text>
        </View>
        <View style={style.divider}></View>
        <View style={style.row}>
          <Text  allowFontScaling={false} style={style.label}>
            Name:
          </Text>
          <Text allowFontScaling={false} style={style.value}>
            {item.retailerName || "No Name"}
          </Text>
        </View>
        <View style={style.row}>
          <Text allowFontScaling={false} style={style.label}>
            Contact Number:
          </Text>
          <Text allowFontScaling={false} style={style.value}>
            {item.contractNumber || "No number"}
          </Text>
        </View>
        <View style={style.row}>
          <Text allowFontScaling={false} style={style.label}>
            Date:
          </Text>
          <Text allowFontScaling={false} style={style.value}>
            {item.followUpDate || "No Date"}
          </Text>
        </View>
        <View style={style.row}>
          <Text allowFontScaling={false} style={style.label}>
            Lead Phase:
          </Text>
          <Text allowFontScaling={false} style={style.value}>
            {item.leadPhase || "No Leadphase"}
          </Text>
        </View>
        
      </View>

      <TouchableOpacity
        onPress={() => handleArrowClick(item)}
        style={style.arrowContainer}
      ></TouchableOpacity>
    </TouchableOpacity>
  );
  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      <View style={style.follow}>
        {/* <Text style={style.lead}>Lead Followup</Text> */}
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("Leaddetail")}
          style={style.create}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: RFValue(12),
            }}
            adjustsFontSizeToFit={true}
          >
            Create Lead
          </Text>
        </TouchableOpacity> */}
      </View>
      <ScrollView style={{ flexGrow: 0, marginBottom: 10 }} horizontal={true}>
        <View style={style.all}>
          <TouchableOpacity
            style={style.button}
            onPress={() => {
              setShowAllData(true);
              setShowFollowUpCalls(true);
              setShowColdCalls(true);
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 15,
              }}
              allowFontScaling={false}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.Follow}
            onPress={() => {
              setShowAllData(false);
              setShowFollowUpCalls(true);
              setShowColdCalls(false);
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 15,
              }}
              allowFontScaling={false}
            >
              Follow Up Call
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.Follow}
            onPress={() => {
              setShowColdCalls(true);
              setShowFollowUpCalls(false);
              setShowAllData(false);
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 15,
              }}
              allowFontScaling={false}
            >
              Cold Call
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
          onPress={() => navigation.navigate("Leaddetail")}
          style={style.create}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize:15,
            }}
        allowFontScaling={false}
          >
            Create Lead
          </Text>
        </TouchableOpacity> */}
        </View>
      </ScrollView>

      <View style={style.inputWrapper}>
        <Image
          source={require("../../../assets/loupe (2).png")}
          style={style.loupe}
        />
        <TextInput
          allowFontScaling={false}
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search here"
          style={style.input}
        />
      </View>

      <View style={{ paddingTop: 10 }}>
        <Text allowFontScaling={false} style={style.items}>
          Items count: {filteredData.length}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : filteredData && filteredData.length > 0 ? (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={["#2f5272"]} // Android refresh indicator color
                tintColor="#2f5272" // iOS refresh indicator color
              />
            }
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No data available
          </Text>
        )}
      </View>
      {/* <View style={{alignItems:'center',paddingTop:40}}> 
    <TouchableOpacity onPress={()=>navigation.navigate('Attendancs')} style={style.refresh}><Text style={{color:'white'}}>Refresh</Text></TouchableOpacity>
     </View> */}
    </View>
  );
};
const style = StyleSheet.create({
  follow: {
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  lead: { textAlign: "center", fontSize: 20, top: 15, paddingLeft: 40 },
  all: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  button: {
    width: width * 0.3,
    paddingVertical: 19,
    marginHorizontal: 10,
    marginVertical: 19,
    backgroundColor: "rgb(30,129,176)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  Follow: {
    width: width * 0.3,
    paddingVertical: 19,
    marginHorizontal: 10,
    marginVertical: 19,
    backgroundColor: "rgb(30,129,176)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },

  // cold: {
  //   width: width * 0.3,
  //   paddingVertical: 19,
  //   marginVertical: 19,
  //   backgroundColor: "rgb(30,129,176)",
  //   borderRadius: 8,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   elevation: 3,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.5,
  // },

  inputWrapper: {
    marginTop: 10,
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center the items vertically
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "center",
    borderRadius: 10,
    width: "100%",
    height: 50,
  },
  input: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 40,

    fontSize: 16,
  },
  loupe: { position: "absolute", left: 10, width: 20, height: 20 },
  items: { textAlign: "center", fontSize: 20, fontWeight: "400" },

  name: {
    fontSize: 14,
    color: "#333",
    marginVertical: 5,
  },
  contractText: {
    fontSize: 12,
    color: "#666",
    marginVertical: 5,
  },
  input2: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 5,
  },
  arrowContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  arrow: {
    fontSize: 25,
    color: "#888",
  },
  contractNumber: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  refresh: {
    width: width * 0.9,
    paddingVertical: 12,
    marginVertical: 10,
    backgroundColor: "rgb(30,129,176)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },

  create: {
    width: width * 0.3,
    paddingVertical: 19,
    marginVertical: 19,
    marginHorizontal: 10,
    backgroundColor: "rgb(30,129,176)",
    borderRadius: 8,
    alignItems: "center",

    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  card: {
    width:'90%',
    alignSelf: "center",
    backgroundColor: "#fff", // White background for the card
    borderRadius: 10, // Rounded corners
    flex: 1,
    marginVertical: 15, // Space between cards
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 5, // Shadow blur radius
    elevation: 5,
    minHeight: 100,
  },
  row: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#7A7A7A",
    fontWeight: "500",
    fontFamily: "Arial",
    letterSpacing: 0.5,

    marginBottom: 5,
    textTransform: "capitalize",
  },

  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "left",
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: width > 600 ? "60%" : "70%",
  },
  divider: {
    width: width * 0.8,
    alignSelf: "center",
    height: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 1,
    marginVertical: 10,
  },
});
export default LeadFollow;
