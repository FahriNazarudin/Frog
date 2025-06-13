import { View, SafeAreaView, FlatList, TouchableOpacity, Text, ActivityIndicator } from "react-native";
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
  const { data, loading, error, refetch } = useQuery(GET_POSTS);
  const navigation = useNavigation();

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8F9FA" }}>
        <ActivityIndicator size="large" color="#06C755" />
        <Text style={{ marginTop: 10, color: "#8E8E8E" }}>Loading posts...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8F9FA" }}>
        <Text style={{ color: "#FF6B6B", fontSize: 16, marginBottom: 10 }}>
          Error: {error.message}
        </Text>
        <TouchableOpacity 
          style={{ 
            backgroundColor: "#06C755", 
            paddingHorizontal: 20, 
            paddingVertical: 10, 
            borderRadius: 8 
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
        data={data?.getPosts || []}
        renderItem={({ item }) => <CardPost post={item} />}
        keyExtractor={(post) => post._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: 100,
          paddingTop: 10 
        }}
        refreshing={loading}
        onRefresh={() => refetch()}
        ListEmptyComponent={
          <View style={{ 
            flex: 1, 
            justifyContent: "center", 
            alignItems: "center", 
            paddingTop: 50 
          }}>
            <Text style={{ 
              fontSize: 16, 
              color: "#8E8E8E", 
              textAlign: "center" 
            }}>
              No posts available.{"\n"}Pull to refresh or create your first post!
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