import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const weatherOptions = {
  Clear: {
    iconName: "weather-sunny",
    gradient: ["#56CCF2", "#2F80ED"],
    title: "Amazing weather",
    description: "Go for a walk, don't stay at home!",
  },
  Thunderstorm: {
    iconName: "weather-lightning",
    gradient: ["#141E30", "#243B55"],
    title: "Sit at home",
    description: "Do you see what's on the street?",
  },
  Drizzle: {
    iconName: "weather-rainy",
    gradient: ["#3a7bd5", "#3a6073"],
    title: "Take an umbrella",
    description: "Perhaps the rain will increase soon",
  },
  Rain: {
    iconName: "weather-pouring",
    gradient: ["#000046", "#1CB5E0"],
    title: "It's raining outside",
    description: "So there will be a rainbow soon!",
  },
  Snow: {
    iconName: "snowflake",
    gradient: ["#83a4d4", "#b6fbff"],
    title: "There's a snowball outside!",
    description: "Dress warmly, make snowmen",
  },
  Dust: {
    iconName: "weather-windy-variant",
    gradient: ["#757F9A", "#D7DDE8"],
    title: "Dusty",
    description: "Better close the windows.",
  },
  Smoke: {
    iconName: "weather-windy",
    gradient: ["#56CCF2", "#2F80ED"],
    title: "On the street smog",
    description: "I do not advise going out unnecessarily",
  },
  Haze: {
    iconName: "weather-hazy",
    gradient: ["#3E5151", "#DECBA4"],
    title: "Hazy",
    description: "Visibility might be low.",
  },
  Mist: {
    iconName: "weather-fog",
    gradient: ["#606c88", "#3f4c6b"],
    title: "Foggy",
    description: "Visibility is poor.",
  },
  Clouds: {
    iconName: "weather-cloudy",
    gradient: ["#757F9A", "#D7DDE8"],
    title: "Cloudy",
    description: "Go for a walk, stop staying at home!",
  },
};

export default function Weather({ temp, name, condition, onSearch }) {
  const [query, setQuery] = useState("");
  const currentWeather = weatherOptions[condition] || {
    gradient: ["#757F9A", "#D7DDE8"],
    title: "Unknown weather",
    description: "Check the weather condition.",
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
    }
  };

  return (
    <LinearGradient
      colors={currentWeather.gradient}
      style={styles.mainContainer}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <MaterialCommunityIcons
          name={currentWeather.iconName}
          size={96}
          color="white"
        />
        <View style={styles.tempContainer}>
          <Text style={styles.temp}>{temp}°C</Text>
          <Text style={styles.temp}>| {name}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentWeather.title}</Text>
          <Text style={styles.description}>{currentWeather.description}</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="City"
              placeholderTextColor="#B0B0B0"
              value={query}
              onChangeText={(text) => setQuery(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
              <MaterialCommunityIcons name="magnify" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tempContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  temp: {
    fontSize: 42,
    color: "white",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    color: "white",
    fontWeight: "300",
    textAlign: "center",
    marginVertical: 10,
  },
  description: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    marginVertical: 5,
  },
  searchContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  searchInput: {
    height: 40,
    borderColor: "#B0B0B0",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "black",
    backgroundColor: "white",
    flex: 1,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
