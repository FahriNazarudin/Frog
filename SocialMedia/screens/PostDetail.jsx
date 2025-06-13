import { gql, useQuery, useMutation } from "@apollo/client";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react"; 
import CardPost from "../components/CardPost";

const DETAIL_POST = gql`
  query GetPostById($getPostByIdId: ID) {
    getPostById(id: $getPostByIdId) {
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

const ADD_COMMENT = gql`
  mutation AddComment($postId: ID, $content: String, $username: String) {
    addComment(postId: $postId, content: $content, username: $username)
  }
`;

export default function Detail({ route }) {
  const navigation = useNavigation();
  const { _id } = route.params;
  const [commentText, setCommentText] = useState("");
  const [username, setUsername] = useState("fahri"); // Default username

  const { data, loading, error, refetch } = useQuery(DETAIL_POST, {
    variables: { getPostByIdId: _id },
  });

  const [addComment, { loading: commentLoading }] = useMutation(ADD_COMMENT);

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    if (!username.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }

    try {
      console.log("Adding comment:", {
        postId: _id,
        content: commentText,
        username,
      });

      const result = await addComment({
        variables: {
          postId: _id,
          content: commentText.trim(),
          username: username.trim(),
        },
      });

      console.log("Comment added successfully:", result);


      setCommentText("");


      await refetch();

      Alert.alert("Success", "Comment added successfully!");
    } catch (error) {
      console.log("Add comment error:", error);
      Alert.alert("Error", "Failed to add comment. Please try again.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#E1E8ED",
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
            Post
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#E1E8ED",
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
            Post
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FF6B6B" }}>Error: {error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const post = data?.getPostById;

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#E1E8ED",
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
            Post
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Post not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8F9FA" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={{ flex: 1 }}>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#E1E8ED",
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
            Post
          </Text>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color="#262626" />
          </TouchableOpacity>
        </View>


        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <CardPost post={post} />

          {/* All Comments Section */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              marginHorizontal: 16,
              marginTop: 8,
              borderRadius: 8,
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#262626",
                marginBottom: 12,
              }}
            >
              Comments ({post.comments?.length || 0})
            </Text>

            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottomWidth: index < post.comments.length - 1 ? 1 : 0,
                    borderBottomColor: "#F1F3F4",
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#06C755",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#FFFFFF",
                        fontWeight: "600",
                      }}
                    >
                      {comment.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#262626",
                        marginBottom: 2,
                      }}
                    >
                      {comment.username}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#262626",
                        lineHeight: 18,
                        marginBottom: 4,
                      }}
                    >
                      {comment.content}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#8E8E8E",
                      }}
                    >
                      {new Date(parseInt(comment.createdAt)).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text
                style={{
                  fontSize: 14,
                  color: "#8E8E8E",
                  textAlign: "center",
                  paddingVertical: 20,
                }}
              >
                No comments yet. Be the first to comment!
              </Text>
            )}
          </View>


          <View style={{ height: 120 }} />
        </ScrollView>


        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E1E8ED",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          {/* Username Input */}
          <View style={{ marginBottom: 8 }}>
            <TextInput
              style={{
                backgroundColor: "#F8F9FA",
                borderRadius: 20,
                paddingHorizontal: 15,
                paddingVertical: 8,
                fontSize: 14,
                color: "#262626",
                borderWidth: 1,
                borderColor: "#E1E8ED",
              }}
              placeholder="Your username..."
              placeholderTextColor="#8E8E8E"
              value={username}
              onChangeText={setUsername}
            />
          </View>


          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TextInput
              style={{
                flex: 1,
                backgroundColor: "#F8F9FA",
                borderRadius: 20,
                paddingHorizontal: 15,
                paddingVertical: 10,
                fontSize: 16,
                color: "#262626",
                marginRight: 8,
                maxHeight: 80,
                borderWidth: 1,
                borderColor: "#E1E8ED",
              }}
              placeholder="Write a comment..."
              placeholderTextColor="#8E8E8E"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={{
                backgroundColor: commentText.trim() ? "#06C755" : "#E1E8ED",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 10,
                opacity: commentLoading ? 0.6 : 1,
              }}
              onPress={handleAddComment}
              disabled={commentLoading || !commentText.trim()}
            >
              {commentLoading ? (
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#FFFFFF",
                  }}
                >
                  ...
                </Text>
              ) : (
                <Ionicons
                  name="send"
                  size={16}
                  color={commentText.trim() ? "#FFFFFF" : "#8E8E8E"}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
