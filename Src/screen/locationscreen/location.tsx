import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const Locationmap = () => {
  const [location, setLocation] = useState<any>(null); // To store current location
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [address, setAddress] = useState<string>("Fetching address...");
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825, // Default to San Francisco
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const navigation: any = useNavigation();

  useEffect(() => {
    const getLocation = async () => {
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        // Get the current location
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
        setMapRegion({
          ...mapRegion,
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        // Reverse geocode the current location to get the address
        const geocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        console.log("Geocode response:", geocode); // Debugging

        // Safely set the address
        if (geocode && geocode.length > 0) {
          const locationDetails = geocode[0];

          const formattedAddress = [
            locationDetails.name || "",
            locationDetails.street || "",
            locationDetails.subregion || "",
            locationDetails.city || "",
            locationDetails.region || "",
            locationDetails.postalCode || "",
            locationDetails.country || "",
          ]
            .filter(Boolean)
            .join(", ");

          setAddress(formattedAddress || "Address not available");
        } else {
          setAddress("Address not available");
        }
      } catch (error) {
        console.error(error);
        setErrorMsg("Error getting location");
      }
    };

    getLocation();
  }, []);

  const centerToCurrentLocation = () => {
    if (location) {
      setMapRegion({
        ...mapRegion,
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0,
        longitudeDelta: 0.0,
      });
      navigation.navigate("Leaddetail", {
        latitude: location.latitude,
        longitude: location.longitude,
        address: address,
      });
    }
  };

  return (
    <View style={style.container}>
      <MapView
        style={style.map}
        region={mapRegion}
        onRegionChangeComplete={(region) => setMapRegion(region)}
      >
        {/* Add a marker for the user's current location */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="My Location"
            description="This is where I am"
          />
        )}

        {/* Add other markers from the dummy locations array */}
      </MapView>

      <View style={style.addressContainer}>
        {errorMsg ? (
          <Text style={style.addressText}>{errorMsg}</Text>
        ) : (
          <>
            <Text style={style.addressText}>Address: {address}</Text>
            {location && (
              <Text style={style.addressText}>
                Latitude: {location.latitude}, Longitude: {location.longitude}
              </Text>
            )}
          </>
        )}
        <View>
          <TouchableOpacity
            style={style.button}
            onPress={centerToCurrentLocation}
          >
            <Text style={style.buttonText} allowFontScaling={false}>
              Locate Me
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    width: "100%",
    height: height * 0.5,
  },
  cardContainer: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    color: "gray",
  },
  button: {
    marginTop: 10,

    alignSelf: "center",
    width: "100%",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addressContainer: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  addressText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
});
export default Locationmap;
