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
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

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
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content)
  }
`;

const ADD_LIKE = gql`
  mutation AddLike($postId: ID!) {
    addLike(postId: $postId)
  }
`;

export default function PostDetail({ route }) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { _id } = route.params;
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const { data, loading, error, refetch } = useQuery(DETAIL_POST, {
    variables: { getPostByIdId: _id },
    errorPolicy: "all",
    onCompleted: (data) => {
      const post = data?.getPostById;
      if (post && user) {
        const userLike = post.likes?.find(
          (like) => like.username === user.username
        );
        setIsLiked(!!userLike);
      }
    },
  });

  const [addComment, { loading: commentLoading }] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      console.log("Comment added successfully");
      setCommentText("");
      refetch();
      Alert.alert("Success", "Comment added successfully!");
    },
    onError: (error) => {
      console.log("Add comment error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to add comment. Please try again."
      );
    },
  });

  const [addLike, { loading: likeLoading }] = useMutation(ADD_LIKE, {
    onCompleted: () => {
      console.log("Like toggled successfully");
      setIsLiked(!isLiked);
      refetch();
    },
    onError: (error) => {
      console.log("Like error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to like post. Please try again."
      );
    },
  });

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    try {
      await addComment({
        variables: {
          postId: _id,
          content: commentText.trim(),
        },
      });
    } catch (error) {
      // Error handling is done in onError callback
    }
  };

  const handleLike = async () => {
    try {
      await addLike({
        variables: {
          postId: _id,
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
          <ActivityIndicator size="large" color="#06C755" />
          <Text style={{ marginTop: 10, color: "#8E8E8E" }}>
            Loading post...
          </Text>
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
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: "#FF6B6B",
              fontSize: 16,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Error loading post: {error.message}
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
          <Text style={{ fontSize: 16, color: "#8E8E8E" }}>Post not found</Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: "#06C755",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Go Back</Text>
          </TouchableOpacity>
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
          <TouchableOpacity onPress={() => refetch()}></TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Image
                source={{
                  uri: `https://image.pollinations.ai/prompt/avatar%20${post.authorDetail?.name}?width=100&height=100&nologo=true&model=flux`,
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#06C755",
                  marginRight: 12,
                }}
              />
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
                  ? new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Just now"}
              </Text>
            </View>

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

            {post.tag && Array.isArray(post.tag) && post.tag.length > 0 && (
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
                      backgroundColor: "#F0F8F0",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    #{tag}
                  </Text>
                ))}
              </View>
            )}

            {post.imgUrl && (
              <Image
                source={{ uri: post.imgUrl }}
                style={{
                  width: "100%",
                  height: 200,
                  marginBottom: 12,
                }}
                resizeMode="cover"
              />
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                borderTopWidth: 1,
                borderTopColor: "#F1F3F4",
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={handleLike}
                disabled={likeLoading}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={isLiked ? "#FF6B6B" : "#8E8E8E"}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: "#8E8E8E",
                    marginLeft: 4,
                  }}
                >
                  {post.likes?.length || 0}
                </Text>
              </TouchableOpacity>
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
              <TouchableOpacity>
                <Ionicons name="share-outline" size={20} color="#8E8E8E" />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#FFFFFF",
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
                  key={`${comment.username}-${comment.createdAt}-${index}`}
                  style={{
                    flexDirection: "row",
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottomWidth: index < post.comments.length - 1 ? 1 : 0,
                    borderBottomColor: "#F1F3F4",
                  }}
                >
                  <Image
                    source={{
                      uri: `https://image.pollinations.ai/prompt/avatar%20${comment.username}?width=100&height=100&nologo=true&model=flux`,
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#06C755",
                      marginRight: 12,
                    }}
                  />
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
                        ? new Date(comment.createdAt).toLocaleDateString(
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
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
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
                <ActivityIndicator size="small" color="#FFFFFF" />
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
