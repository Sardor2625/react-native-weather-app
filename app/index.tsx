import axios from "axios";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import Loader from "../components/loader";
import Weather from "../components/weather";

const API_KEY = "63c41566f4e1ce4f706125c778bbc69a"; // Tekshirib to'g'ri API kalitni qo'ying

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);

  const getWeather = async (latitude: number, longitude: number) => {
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      setLocation(data);
      console.log("Weather Data:", data); // Qo'shimcha konsol log
    } catch (error) {
      console.error("Weather API Error:", error); // Xatolarni qayta ishlash
      Alert.alert("Weather API Error", "Unable to fetch weather data.");
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});
      console.log("Coordinates:", latitude, longitude);
      await getWeather(latitude, longitude); // Asinxron chaqirishni kuting
    } catch (error) {
      console.error("Location Error:", error);
      Alert.alert("Location Error", "Unable to fetch your current location.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return isLoading ? <Loader /> : <Weather location={location} />; // Weather komponentiga location prop qo'shing
}

const styles = StyleSheet.create({});
