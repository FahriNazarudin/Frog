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
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const DETAIL_POST = gql`
  query GetPostById($getPostByIdId: ID!) {
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
  mutation AddComment($postId: ID!, $content: String!, $username: String!) {
    addComment(postId: $postId, content: $content, username: $username) {
      _id
      content
      username
      createdAt
    }
  }
`;

export default function PostDetail({ route }) {
  const navigation = useNavigation();
  const { _id } = route.params;
  const [commentText, setCommentText] = useState("");
  const [username, setUsername] = useState("");

  const { data, loading, error, refetch } = useQuery(DETAIL_POST, {
    variables: { getPostByIdId: _id },
    errorPolicy: "all",
  });

  const [addComment, { loading: commentLoading }] = useMutation(ADD_COMMENT, {
    onCompleted: (data) => {
      console.log("Comment added successfully:", data);
      setCommentText("");
      refetch();
      Alert.alert("Success", "Comment added successfully!");
    },
    onError: (error) => {
      console.log("Add comment error:", error);
      Alert.alert("Error", "Failed to add comment. Please try again.");
    },
  });

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
      await addComment({
        variables: {
          postId: _id,
          content: commentText.trim(),
          username: username.trim(),
        },
      });
    } catch (error) {
      // Error handling is done in onError callback
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
          <TouchableOpacity
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: "#06C755",
              borderRadius: 5,
            }}
            onPress={() => refetch()}
          >
            <Text style={{ color: "white" }}>Retry</Text>
          </TouchableOpacity>
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
          {/* Post Detail */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              marginHorizontal: 16,
              marginTop: 16,
              borderRadius: 8,
              padding: 16,
            }}
          >
            {/* Author Info */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#06C755",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#FFFFFF",
                    fontWeight: "600",
                  }}
                >
                  {post.authorDetail?.name?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#262626",
                  }}
                >
                  {post.authorDetail?.name || "Unknown User"}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#8E8E8E",
                  }}
                >
                  @{post.authorDetail?.username || "unknown"}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: "#8E8E8E",
                }}
              >
                {post.createdAt
                  ? new Date(parseInt(post.createdAt)).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "Just now"}
              </Text>
            </View>

            {/* Post Content */}
            <Text
              style={{
                fontSize: 16,
                color: "#262626",
                lineHeight: 22,
                marginBottom: 12,
              }}
            >
              {post.content}
            </Text>

            {/* Tags */}
            {post.tag && post.tag.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
                {post.tag.map((tag, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 14,
                      color: "#06C755",
                      marginRight: 8,
                      marginBottom: 4,
                    }}
                  >
                    #{tag}
                  </Text>
                ))}
              </View>
            )}

            {/* Image */}
            {post.imgUrl && (
              <Image
                source={{ uri: post.imgUrl }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
                resizeMode="cover"
              />
            )}

            {/* Post Stats */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: "#F1F3F4",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="heart-outline" size={20} color="#8E8E8E" />
                <Text
                  style={{
                    fontSize: 14,
                    color: "#8E8E8E",
                    marginLeft: 4,
                  }}
                >
                  {post.likes?.length || 0}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="chatbubble-outline" size={18} color="#8E8E8E" />
                <Text
                  style={{
                    fontSize: 14,
                    color: "#8E8E8E",
                    marginLeft: 4,
                  }}
                >
                  {post.comments?.length || 0}
                </Text>
              </View>
              <Ionicons name="share-outline" size={20} color="#8E8E8E" />
            </View>
          </View>

          {/* Comments Section */}
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
                  key={`${comment.username}-${index}`}
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
                      {comment.createdAt
                        ? new Date(
                            parseInt(comment.createdAt)
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
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
                backgroundColor:
                  commentText.trim() && username.trim() ? "#06C755" : "#E1E8ED",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 10,
                opacity: commentLoading ? 0.6 : 1,
              }}
              onPress={handleAddComment}
              disabled={
                commentLoading || !commentText.trim() || !username.trim()
              }
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
                  color={
                    commentText.trim() && username.trim()
                      ? "#FFFFFF"
                      : "#8E8E8E"
                  }
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
