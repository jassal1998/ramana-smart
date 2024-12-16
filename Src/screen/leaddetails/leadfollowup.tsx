import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setSelectedContract } from "../redux/slice";
import { useNavigation } from "@react-navigation/native";
import { fetchData } from "../../slices/Leadfolloe/leadfollowthunk";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const { width, height } = Dimensions.get("window");

type ContractItem = {
  id: string;
  number: string;
  name: string;
  contractNumber: string;
  followupdate: any;
  leadphase: any;
};

const LeadFollow = () => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  console.log(navigation);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showColdCalls, setShowColdCalls] = useState<boolean>(false);
  const [showFollowUpCalls, setShowFollowUpCalls] = useState<boolean>(false);
  const [showAllData, setShowAllData] = useState(true);
  const [data, setData] = useState<ContractItem[]>([
    {
      id: "1",
      number: "",
      name: "Manna Machines",
      contractNumber: "9855097195",
      followupdate: "",
      leadphase: "follow_up_call",
    },
    {
      id: "2",
      number: "",
      name: "Pub Sohna",
      contractNumber: "8360042904",
      followupdate: "",
      leadphase: "follow_up_call,cold_call",
    },
    {
      id: "3",
      number: "",
      name: "Test",
      contractNumber: "8872420478",
      followupdate: "",
      leadphase: "cold_call",
    },
  ]);

  const filteredData = data.filter((item) => {
    const matchesSearchQuery =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contractNumber?.includes(searchQuery);

    const matchesFollowUpCall = showFollowUpCalls
      ? item.leadphase.includes("follow_up_call")
      : false;

    const matchesColdCall = showColdCalls
      ? item.leadphase.includes("cold_call")
      : false;

    const matchesAll = showAllData || matchesFollowUpCall || matchesColdCall;

    return matchesSearchQuery && matchesAll;
  });

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setIsLoading(true); // Set loading to true when typing starts

    // Simulate a delay (e.g., for API call or debounce)
    setTimeout(() => {
      setIsLoading(false); // Set loading to false after a short delay
    }, 500); // Adjust the delay to your preference
  };

  const handleContractNumberChange = (id: string, value: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, contractNumber: value } : item
      )
    );
  };
  // const handleArrowClick = (item: ContractItem) => {
  //    console.log(item);
  //     dispatch(setSelectedContract(item)); // Dispatch selected contract
  //     navigation.navigate("Leaddetail",{contractDetail:item});
  //   };

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = await fetchData(); // Fetch data from API
        console.log("Fetched Data:", fetchedData); // Debug fetched data
        const transformedData = fetchedData.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.retailerName || "Unknown Company",
          country: item.country || "Unknown Country",
          number: item.contactNo || "No Contact",
          address: item.outletAddress || "No Address",
          latitude: item.latitude || "No Address",
          longitude: item.longitude || "No Address",
          followupdate: item.followUpDate || "No Date",
          leadphase: item.leadPhase || "no LeadPhase",
          image: item.newImage || "no Image",
        }));
        setData(transformedData); // Update state with transformed data
      } catch (error: any) {
        console.error("Error fetching data:", error.message || error);
      }
    };

    getData();
  }, []);

  const handleArrowClick = (item: ContractItem) => {
    console.log("Clicked Item:", item);
  };

  const renderItem = ({ item }: { item: ContractItem }) => (
    <TouchableOpacity
      onPress={() => {
        if (item) {
          console.log("Navigating with item:", item); // Ensure item is valid before passing it
          navigation.navigate("Leaddetail", { item });
        } else {
          console.log("Item is undefined or not available!");
        }
      }}
    >
      <View style={style.card}>
        <View style={style.row}>
          <Text style={style.label}>ID:</Text>
          <Text style={style.value}>{item.id || "No ID"}</Text>
        </View>
        <View style={style.divider}></View>
        <View style={style.row}>
          <Text style={style.label}>Name:</Text>
          <Text style={style.value}>{item.name || "No Name"}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.label}>Contact Number:</Text>
          <Text style={style.value}>{item.number || "No Number"}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.label}>Date:</Text>
          <Text style={style.value}>{item.followupdate || "No Date"}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.label}>Lead Phase:</Text>
          <Text style={style.value}>{item.leadphase || "No Leadphase"}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleArrowClick(item)}
        style={style.arrowContainer}
      ></TouchableOpacity>
    </TouchableOpacity>
  );
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "white", padding: 10 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      enableOnAndroid
      extraHeight={100} // Adjust extra height when keyboard opens
      keyboardShouldPersistTaps="handled" // Allow taps outside to dismiss keyboard
    >
      <View style={style.follow}>
        <Text style={style.lead}>Lead Followup</Text>
        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
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
              fontSize: RFPercentage(1.6),
            }}
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
              fontSize: RFPercentage(1.6),
            }}
          >
            Follow Up Call
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.cold}
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
              fontSize: RFPercentage(1.6),
            }}
          >
            Cold Call
          </Text>
        </TouchableOpacity>
      </View>
      <View style={style.inputWrapper}>
        <Image
          source={require("../../../assets/loupe (2).png")}
          style={style.loupe}
        />
        <TextInput
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search here"
          style={style.input}
        />
      </View>

      <View style={{ paddingTop: 10 }}>
        <Text style={style.items}>Items count: {filteredData.length}</Text>
      </View>

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : filteredData && filteredData.length > 0 ? (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
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
    </KeyboardAwareScrollView>
  );
};
const style = StyleSheet.create({
  follow: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lead: { textAlign: "center", fontSize: 20, top: 15, paddingLeft: 40 },
  all: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 10,
  },
  button: {
    width: width * 0.2,
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
  Follow: {
    width: width * 0.3,
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

  cold: {
    width: width * 0.3,
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

  inputWrapper: {
    marginTop: 10,
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center the items vertically
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "center",
    borderRadius: 10,
    width: width * 0.9, // Width of the text input container
    height: 50, // Height of the container
  },
  input: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 40,

    fontSize: 16,
  },
  loupe: { position: "absolute", left: 10, width: 20, height: 20 },
  items: { textAlign: "center", fontSize: 20, fontWeight: "400" },

  number: {
    fontSize: RFPercentage(2),
    fontWeight: "bold",
  },
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
  card: {
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "#fff", // White background for the card
    borderRadius: 10, // Rounded corners
    height: height * 0.4,
    marginVertical: 15, // Space between cards
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 5, // Shadow blur radius
    elevation: 5,
  },
  row: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
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
    fontFamily: "Roboto",
    letterSpacing: 0.5,
    lineHeight: 24,

    textAlign: "left",
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
