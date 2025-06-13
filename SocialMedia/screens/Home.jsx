import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import CardPost from "../components/CardPost";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { gql, useQuery } from "@apollo/client";

const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      _id
      content
      tag
      imgUrl
      createdAt
      updatedAt
      authorDetail {
        _id
        name
        username
        email
      }
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
    }
  }
`;

export default function Home() {
  const { data, loading, error, refetch } = useQuery(GET_POSTS, {
    errorPolicy: "all", // Menampilkan data partial meski ada error
    onError: (error) => {
      console.log("GraphQL Error:", error);
      console.log("Network Error:", error.networkError);
      console.log("GraphQL Errors:", error.graphQLErrors);
    },
    onCompleted: (data) => {
      console.log("Posts data loaded:", data?.getPosts?.length, "posts");
    },
  });

  const navigation = useNavigation();

  // Sanitize data untuk menghindari parsing error
  const sanitizedPosts =
    data?.getPosts?.map((post) => ({
      ...post,
      tag: post.tag || "", // Pastikan tag tidak null
      imgUrl: post.imgUrl || "", // Pastikan imgUrl tidak null
      content: post.content || "", // Pastikan content tidak null
      authorDetail: {
        ...post.authorDetail,
        name: post.authorDetail?.name || "Unknown User",
        username: post.authorDetail?.username || "unknown",
        email: post.authorDetail?.email || "",
      },
      comments:
        post.comments?.map((comment) => ({
          ...comment,
          content: comment.content || "",
          username: comment.username || "anonymous",
        })) || [],
      likes:
        post.likes?.map((like) => ({
          ...like,
          username: like.username || "anonymous",
        })) || [],
    }))
    // Sort posts by createdAt in descending order (newest first)
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

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
          Loading posts...
        </Text>
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8F9FA",
          paddingHorizontal: 20,
        }}
      >
        <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
        <Text
          style={{
            color: "#FF6B6B",
            fontSize: 16,
            marginTop: 10,
            marginBottom: 5,
            textAlign: "center",
          }}
        >
          Failed to load posts
        </Text>
        <Text
          style={{
            color: "#8E8E8E",
            fontSize: 14,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {error.message}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#06C755",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
          }}
          onPress={() => refetch()}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>

      <FlatList
        data={sanitizedPosts}
        renderItem={({ item }) => <CardPost post={item} />}
        keyExtractor={(post) => post._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 10,
        }}
        refreshing={loading}
        onRefresh={() => refetch()}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 50,
              paddingHorizontal: 20,
            }}
          >
            <Ionicons name="document-text-outline" size={48} color="#8E8E8E" />
            <Text
              style={{
                fontSize: 16,
                color: "#8E8E8E",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              No posts available
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#CCCCCC",
                textAlign: "center",
                marginTop: 5,
              }}
            >
              Pull to refresh or create your first post!
            </Text>
          </View>
        }
      />
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#06C755",
            borderRadius: 25,
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => {
            console.log("create post button pressed");
            navigation.push("Create");
          }}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
