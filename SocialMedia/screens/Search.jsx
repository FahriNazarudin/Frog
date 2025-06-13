import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Search() {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#E1E8ED",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: "#262626",
            textAlign: "center",
          }}
        >
          Search
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#E1E8ED",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F1F3F4",
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: "#262626",
            }}
            placeholder="Search"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
});
