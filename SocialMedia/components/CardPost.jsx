import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

export default function CardPost({ post }) {
    const { content, tag, imgUrl, authorId } = post;

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{
              uri: "https://image.pollinations.ai/prompt/?postingankecewith=1000&height=1000&nologo=true",
            }}
            style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }}
          />
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#262626" }}>
            username
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: 18, color: "#8E8E8E", fontWeight: "bold" }}>
            ⋯
          </Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{
          uri: `https://image.pollinations.ai/prompt/?${post.content}?with=1000&height=1000&nologo=true`,
        }}
        style={{
          width: "100%",
          aspectRatio: 1,
          marginBottom: 12,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Text>
              <Feather name="smile" size={21} color="black" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Text>
              <FontAwesome name="commenting-o" size={20} color="black" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>
              <Entypo name="share-alternative" size={20} color="black" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text
        style={{
          fontSize: 14,
          color: "#262626",
          lineHeight: 18,
          marginBottom: 8,
        }}
      >
        {post.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
