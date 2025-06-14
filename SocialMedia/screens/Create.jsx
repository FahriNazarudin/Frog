import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthContext";

const CREATE_POST = gql`
  mutation AddPost(
    $content: String!
    $tag: String
    $imgUrl: String
    $authorId: ID
  ) {
    addPost(
      content: $content
      tag: $tag
      imgUrl: $imgUrl
      authorId: $authorId
    ) {
      _id
      content
      tag
      imgUrl
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      authorDetail {
        _id
        name
        username
        email
      }
    }
  }
`;

export default function Create() {
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);


  console.log("User from AuthContext:", user);
  console.log("User ID:", user?._id);

  // Jika user tidak ada, redirect ke login
  React.useEffect(() => {
    if (!user) {
      console.log("User not found in AuthContext, redirecting to login");
      Alert.alert("Authentication Required", "Please login to create a post.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    }
  }, [user, navigation]);

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    refetchQueries: ["GetPosts"],
    onCompleted: (data) => {
      console.log("Post created successfully:", data);
      // Reset form
      setContent("");
      setTag("");
      setImgUrl("");

      Alert.alert("Success", "Post created successfully!", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Home");
          },
        },
      ]);
    },
    onError: (error) => {
      console.error("GraphQL Error:", error);
      console.error("GraphQL Errors:", error.graphQLErrors);
      console.error("Network Error:", error.networkError);

      let errorMessage = "Failed to create post. Please try again.";

      if (error.graphQLErrors?.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error.networkError) {
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Error", errorMessage);
    },
  });

  const handleCreatePost = async () => {
    console.log("create post button pressed");

    // Validasi user terlebih dahulu
    if (!user) {
      console.log("User not found in context");
      Alert.alert("Error", "Please login first to create a post.");
      navigation.navigate("Login");
      return;
    }

    if (!user._id) {
      console.log("User ID not found:", user);
      Alert.alert("Error", "User ID not found. Please login again.");
      navigation.navigate("Login");
      return;
    }

    // Validasi content
    if (!content.trim()) {
      Alert.alert("Error", "Please enter some content for your post.");
      return;
    }

    try {
      console.log("Creating post with user ID:", user._id);
      console.log("Post data:", {
        content: content.trim(),
        tag: tag.trim() || null,
        imgUrl: imgUrl.trim() || null,
        authorId: user._id,
      });

      await createPost({
        variables: {
          content: content.trim(),
          tag: tag.trim() || null,
          imgUrl: imgUrl.trim() || null,
          authorId: user._id,
        },
      });
    } catch (error) {
      console.log("Create post catch error:", error.message);
      console.log("Full error:", error);
    }
  };

  // Add loading state
  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8F9FA",
        }}
      >
        <ActivityIndicator size="large" color="#06C755" />
        <Text style={{ marginTop: 10, color: "#8E8E8E" }}>
          Creating post...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#E1E8ED",
          backgroundColor: "#FFFFFF",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#262626" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#262626",
          }}
        >
          Create Post
        </Text>
        <TouchableOpacity
          onPress={handleCreatePost}
          disabled={loading || !content.trim() || !user?._id}
          style={{
            opacity: loading || !content.trim() || !user?._id ? 0.5 : 1,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#06C755",
            }}
          >
            {loading ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#262626",
              marginBottom: 10,
            }}
          >
            What's on your mind?
          </Text>
          <TextInput
            style={{
              fontSize: 16,
              color: "#262626",
              minHeight: 120,
              textAlignVertical: "top",
              paddingVertical: 10,
            }}
            placeholder="Share your thoughts..."
            placeholderTextColor="#8E8E8E"
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={500}
          />
          <Text
            style={{
              fontSize: 12,
              color: "#8E8E8E",
              textAlign: "right",
              marginTop: 5,
            }}
          >
            {content.length}/500
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 20,
            paddingTop: 20,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#262626",
              marginBottom: 10,
            }}
          >
            Add a tag
          </Text>
          <TextInput
            style={{
              fontSize: 16,
              color: "#262626",
              paddingVertical: 15,
              paddingHorizontal: 15,
              backgroundColor: "#F8F9FA",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E1E8ED",
            }}
            value={tag}
            onChangeText={setTag}
          />
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#262626",
              marginBottom: 10,
            }}
          >
            Add an image
          </Text>
          <TextInput
            style={{
              fontSize: 16,
              color: "#262626",
              paddingVertical: 15,
              paddingHorizontal: 15,
              backgroundColor: "#F8F9FA",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E1E8ED",
            }}
            value={imgUrl}
            onChangeText={setImgUrl}
            autoCapitalize="none"
          />

          {imgUrl.trim() && (
            <View
              style={{
                marginTop: 15,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: imgUrl }}
                style={{
                  width: "100%",
                  height: 200,
                  backgroundColor: "#F8F9FA",
                }}
                resizeMode="cover"
                onError={() => {
                  Alert.alert(
                    "Error",
                    "Failed to load image. Please check the URL."
                  );
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
});
