import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";



import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { setSelectedContract } from "../redux/slice";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
type ContractItem = {
  id: string;
  number: string;
  name: string;
  contractNumber: string;
};



const LeadFollow =() =>{
   const dispatch = useDispatch();
 const navigation:any = useNavigation();
 console.log(navigation);

 
   const [data, setData] = useState<ContractItem[]>([
    { id: "1", number: "", name: "Manna Machines", contractNumber: "9855097195" },
    { id: "2", number: "", name: "Pub Sohna", contractNumber: "8360042904" },
    { id: "3", number: "", name: "Test", contractNumber: "8872420478" },
  ]);

 
  const handleContractNumberChange = (id: string, value: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, contractNumber: value } : item
    
      )
    );
    
  };
const handleArrowClick = (item: ContractItem) => {
   console.log(item);
    dispatch(setSelectedContract(item)); // Dispatch selected contract
    navigation.navigate("Leaddetail"); 
  };

  const renderItem = ({ item }: { item: ContractItem }) => (
    <View style={style.card}>
      {/* Number and Name */}
      <View style={style.row}>
        <Text style={style.number}>{item.number}</Text>
        <Text style={style.name}>{item.name}</Text>
      <Text style={style.contractNumber}>{item.contractNumber || "Not Provided"}</Text>
       
        
      </View>

      {/* Arrow */}
      <TouchableOpacity onPress={()=>handleArrowClick(item)} 
      
       style={style.arrowContainer}>
        
        <Text style={style.arrow}>{">"}</Text>
      </TouchableOpacity>

    </View>
    
  );


return(
<KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "white", padding: 10 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      enableOnAndroid
      extraHeight={100} // Adjust extra height when keyboard opens
      keyboardShouldPersistTaps="handled" // Allow taps outside to dismiss keyboard
    >
    <View  style={style.follow}>
    <Text style={style.lead}>Lead Followup</Text>
    </View>
<View style={style.all}> 
    <TouchableOpacity style={style.button}><Text style={{textAlign:'center',color:"white"}}>All</Text></TouchableOpacity>
<TouchableOpacity style={style.Follow}><Text style={{textAlign:'center',color:'white'}}>Follow Up Call</Text></TouchableOpacity>
<TouchableOpacity style={style.cold}><Text style={{textAlign:'center',color:'white'}}>Cold Call</Text></TouchableOpacity>
</View>
<View style={style.inputWrapper}>
<Image source={require("../../../assets/loupe (2).png")} style={style.loupe}/>


    <TextInput placeholder="Sreach here" style={style.input}></TextInput>
</View>
<View style={{paddingTop:10}}>
    <Text style={style.items}>Items counts:3</Text>
</View>
<View>
     <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
</View>
<View style={{alignItems:'center',paddingTop:40}}> 
    <TouchableOpacity style={style.refresh}><Text>Refresh</Text></TouchableOpacity>
</View>
</KeyboardAwareScrollView>

)
}
const style = StyleSheet.create({
    follow:{paddingTop:10,},
    lead:{textAlign:'center',fontSize:20},
    all:{flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingTop:10},
    button:{ width: width * 0.2,
  paddingVertical: 12,
  marginVertical: 10, 
  backgroundColor: 'rgb(30,129,176)',
  borderRadius: 8, 
  alignItems: 'center', 
  justifyContent: 'center', 
  elevation: 3, 
  shadowColor: '#000', 
  shadowOffset: { width: 0, height: 2 }, 
  shadowOpacity: 0.25, 
  shadowRadius: 3.5, 
  } ,
    Follow:{width: width * 0.3,
  paddingVertical: 12,
  marginVertical: 10, 
  backgroundColor: 'rgb(30,129,176)',
  borderRadius: 8, 
  alignItems: 'center', 
  justifyContent: 'center', 
  elevation: 3, 
  shadowColor: '#000', 
  shadowOffset: { width: 0, height: 2 }, 
  shadowOpacity: 0.25, 
  shadowRadius: 3.5},

    cold:{width: width * 0.3,
  paddingVertical: 12,
  marginVertical: 10, 
  backgroundColor: 'rgb(30,129,176)',
  borderRadius: 8, 
  alignItems: 'center', 
  justifyContent: 'center', 
  elevation: 3, 
  shadowColor: '#000', 
  shadowOffset: { width: 0, height: 2 }, 
  shadowOpacity: 0.25, 
  shadowRadius: 3.5},

   inputWrapper: {
    marginTop:10,
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center the items vertically
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf:'center',
    borderRadius: 10,
    width: width * 0.9, // Width of the text input container
    height: 50, // Height of the container
  },
  input:{ flex: 1, 
    paddingLeft: 40, 
    paddingRight: 40,
  
    fontSize: 16,},
    loupe:{ position: "absolute",
    left: 10, 
    width: 20,
    height: 20,},
    items:{textAlign:'center',fontSize:20,fontWeight:'400'},
   
    card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  list: {
    padding: 10,
  },

  row: {
    flex: 1,
  },
  number: {
    fontSize: 16,
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
    fontSize: 18,
    color: "#888",
  },
  contractNumber: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  refresh:{width: width * 0.9,
  paddingVertical: 12,
  marginVertical: 10, 
  backgroundColor: 'rgb(30,129,176)',
  borderRadius: 8, 
  alignItems: 'center', 
  justifyContent: 'center', 
  elevation: 3, 
  shadowColor: '#000', 
  shadowOffset: { width: 0, height: 2 }, 
  shadowOpacity: 0.25, 
  shadowRadius: 3.5, }

})
export default LeadFollow