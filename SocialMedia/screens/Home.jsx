import { View, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
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
  const { data, loading, error } = useQuery(GET_POSTS);
  const navigation = useNavigation();

  if (error) {
    return (
      <view style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error.message}</Text>
      </view>
    )
  }

  return (
    <SafeAreaView >
      <FlatList 
        data={data?.getPosts}
        renderItem={({ item }) => <CardPost post={item} />}
        keyExtractor={(post) => post._id}
       
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
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            console.log("create post button pressed");
            navigation.push("Create");
          }}
        >
          <Ionicons name="add-circle" size={45} color="#06C755" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}