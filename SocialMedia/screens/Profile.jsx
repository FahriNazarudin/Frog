import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";

export default function Profile() {
  const userData = {
    name: "Fahri Nazarudin",
    username: "@fahrinzrdn",
    email: "fahri@example.com",
    followers: 24,
    following: 98,
    bio: "Sunshine so bright ✨",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />


      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop",
        }}
        style={{ flex: 1, width: "100%", height: "100%" }}
        imageStyle={{ opacity: 0.8 }}
      >
        {/* Overlay */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />


        <View style={styles.header}>
          <TouchableOpacity></TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>


        <View
          style={{
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 50,
          }}
        >
          {/* Profile Picture */}
          <View style={{ marginBottom: 20 }}>
            <Image
              source={{
                uri: "https://image.pollinations.ai/prompt/avatar%20man%0A?width=500&height=500&nologo=true&model=flux",
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: "#FFFFFF",
              }}
            />
          </View>


          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#FFFFFF",
                marginBottom: 4,
              }}
            >
              {userData.name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#E0E0E0",
                marginBottom: 4,
              }}
            >
              {userData.username}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#CCCCCC",
                marginBottom: 12,
              }}
            >
              {userData.email}
            </Text>

            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#E0E0E0",
                  textAlign: "center",
                }}
              >
                {userData.followers} Followers • {userData.following} Following
              </Text>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: "#FFFFFF",
                textAlign: "center",
                opacity: 0.9,
              }}
            >
              {userData.bio}
            </Text>
          </View>


          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
              borderTopWidth: 1,
              borderTopColor: "rgba(255, 255, 255, 0.2)",
              paddingTop: 20,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#FFFFFF",
                  letterSpacing: 1,
                }}
              >
                POST
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#FFFFFF",
                  letterSpacing: 1,
                }}
              >
                MEDIA
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
});
