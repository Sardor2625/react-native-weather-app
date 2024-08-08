// Loader.js
import React from "react";
import AnimatedLoader from "react-native-animated-loader";
import { StyleSheet, Text, View } from "react-native";

export default function Loader() {
  return (
    <View style={styles.container}>
      <AnimatedLoader
        visible={true}
        overlayColor='#FDF6AA'
        source={require('../assets/images/loader.json')}
        animationStyle={styles.lottie}
        speed={1}
      >
      </AnimatedLoader>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 100,
    height: 100,
  },
});
