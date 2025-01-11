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
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { fetchData } from "../../slices/thunk";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const { width, height } = Dimensions.get("window");

interface LeadData {
 
  name: any;
 contractNumber:any,
  id: number;
  retailerName: string;
  
  followUpDate: string;
  leadPhase: string;
  newImage: string;
  outletAddress: string;
  longitude:string;
  latitude:string
}


const LeadFollow = () => {
  const dispatch:any = useDispatch();
  const navigation: any = useNavigation();
  console.log(navigation);





  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showColdCalls, setShowColdCalls] = useState<boolean>(false);
  const [showFollowUpCalls, setShowFollowUpCalls] = useState<boolean>(false);
  const [showAllData, setShowAllData] = useState(true);
 
 
const LeadData= useSelector((state:any)=>state.Follow.Card || [])

console.log('leaddata',LeadData)

//  useEffect(() => {
//     dispatch(fetchData());
//   }, [dispatch]);

  // Sync Redux state to local state, with safety check
  





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
      longitude:"",
      latitude:""
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
      longitude:"",
      latitude:""
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
      longitude:"",
      latitude:""
    },
  ]);





  const filteredData = data.filter((item:any) => {
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
console.log("Filtered Data:", filteredData);




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
    dispatch(fetchData());
  }, [dispatch]);
 
  useEffect(() => {
    console.log('zxzxz',LeadData)
  if (Array.isArray(LeadData?.data) && LeadData.data.length > 0) {
  
   const processedData = LeadData.data.map((item: any) => ({
      
      id: item.id.toString(),
      name: item.retailerName || "Unknown Company", // Add a default value for retailerName
      contractNumber: item.contactNo || "No Contact", // Add a default value for contactNo
      followUpDate: item.followUpDate || "No Date", // Add a default value for followUpDate
      leadPhase: item.leadPhase || "No Lead Phase", // Add a default value for leadPhase
      retailerName: item.retailerName || "Unknown Company", // Ensure this is included
       longitude:item.longitude || "",
       latitude:item.latitude || "",
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
}, [LeadData])

  const handleArrowClick = (item: LeadData) => {
    console.log("Clicked Item:", item);
  };

  const renderItem = ({ item }: { item: LeadData }) => (
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
          <Text style={style.value}>{item.retailerName || "No Name"}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.label}>Contact Number:</Text>
         <Text style={style.value}>{item.contractNumber || "No number"}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.label}>Date:</Text>
          <Text style={style.value}>{item.followUpDate || "No Date"}</Text>
        </View>
        <View style={style.row}>
          <Text style={style.label}>Lead Phase:</Text>
          <Text style={style.value}>{item.leadPhase || "No Leadphase"}</Text>
        </View>
        
      </View>

      <TouchableOpacity
        onPress={() => handleArrowClick(item)}
        style={style.arrowContainer}
      ></TouchableOpacity>
    </TouchableOpacity>
  );
  return (
    
    
      <View style={{flex:1,backgroundColor:'white',padding:10}}>
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
      <ScrollView     style={{ flexGrow: 0, marginBottom: 10,}}
        horizontal={true} >
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
            fontSize:15
            }}
           allowFontScaling={false} >
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
             fontSize:15
            }}
          allowFontScaling={false} >
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
              fontSize:15
            }}
           allowFontScaling={false}>
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
            keyExtractor={(Item) => LeadData.id}
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
    </View>
  );
};
const style = StyleSheet.create({
  follow: {
    paddingTop: 10,
    flexDirection: "row",
    alignItems:'flex-end',
    
  },
  lead: { textAlign: "center", fontSize: 20, top: 15, paddingLeft: 40 },
  all: {
  
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-evenly',
     width: '100%',
   
  },
  button: {
    width: width * 0.3,
    paddingVertical: 19,
marginHorizontal:10,
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
marginHorizontal:10,
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

  cold: {
    width: width * 0.3,
    paddingVertical: 19,
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
    paddingVertical: 19,
    marginVertical: 19,
marginHorizontal:10,
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
