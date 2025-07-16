import { Entypo, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

const ADD_LIKE = gql`
  mutation AddLike($postId: ID!) {
    addLike(postId: $postId)
  }
`;

const REMOVE_LIKE = gql`
  mutation RemoveLike($postId: ID!) {
    removeLike(postId: $postId)
  }
`;

export default function CardPost({ post }) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);

  // Check if current user has liked this post
  useEffect(() => {
    if (post && user) {
      const userLike = post.likes?.find(
        (like) => like.username === user.username
      );
      setIsLiked(!!userLike);
    }
  }, [post, user]);

  const [addLike, { loading: likeLoading }] = useMutation(ADD_LIKE, {
    onCompleted: () => {
      setIsLiked(true);
    },
    onError: (error) => {
      console.log("Like error:", error);
    },
    refetchQueries: ["GetPosts"],
  });

  const [removeLike, { loading: unlikeLoading }] = useMutation(REMOVE_LIKE, {
    onCompleted: () => {
      setIsLiked(false);
    },
    onError: (error) => {
      console.log("Unlike error:", error);
    },
    refetchQueries: ["GetPosts"],
  });

  const handleLike = async () => {
    if (!user) {
      Alert.alert("Error", "Please login to like posts");
      return;
    }

    try {
      if (isLiked) {
        await removeLike({
          variables: { postId: post._id },
        });
      } else {
        await addLike({
          variables: { postId: post._id },
        });
      }
    } catch (error) {
      console.log("Handle like error:", error);
    }
  };

  const handleNavigateToDetail = () => {
    navigation.push("Detail", { _id: post._id });
  };

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
              uri: `https://image.pollinations.ai/prompt/${post.authorDetail?.name}?width=100&height=100&nologo=true`,
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              marginRight: 10,
            }}
          />
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#262626",
              }}
            >
              {post.authorDetail?.username}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#8E8E8E",
              }}
            >
              {post.authorDetail?.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleNavigateToDetail}>
          <Text
            style={{
              fontSize: 18,
              color: "#8E8E8E",
              fontWeight: "bold",
            }}
          >
            ⋯
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 16,
          color: "#262626",
          lineHeight: 20,
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
                fontWeight: "500",
                marginRight: 8,
                marginBottom: 4,
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
            aspectRatio: 1,
          }}
          resizeMode="cover"
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          marginTop: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={handleLike}
            disabled={likeLoading || unlikeLoading}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={21}
              color={isLiked ? "#FF6B6B" : "black"}
              style={{
                opacity: likeLoading || unlikeLoading ? 0.5 : 1,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={handleNavigateToDetail}
          >
            <FontAwesome name="commenting-o" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo name="share-alternative" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        {post.likes && post.likes.length > 0 && (
          <Text
            style={{
              fontSize: 14,
              color: "#8E8E8E",
              marginRight: 16,
            }}
          >
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </Text>
        )}
        {post.comments && post.comments.length > 0 && (
          <Text
            style={{
              fontSize: 14,
              color: "#8E8E8E",
            }}
          >
            {post.comments.length}{" "}
            {post.comments.length === 1 ? "comment" : "comments"}
          </Text>
        )}
      </View>

      {post.comments && post.comments.length > 0 && (
        <View style={{ marginTop: 8 }}>
          {post.comments.slice(0, 2).map((comment, index) => (
            <View
              key={`${comment.username}-${comment.createdAt || index}`}
              style={{
                flexDirection: "row",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#262626",
                  marginRight: 8,
                }}
              >
                {comment.username}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#262626",
                  flex: 1,
                }}
              >
                {comment.content}
              </Text>
            </View>
          ))}
          {post.comments.length > 2 && (
            <TouchableOpacity onPress={handleNavigateToDetail}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#8E8E8E",
                  marginTop: 4,
                }}
              >
                View all {post.comments.length} comments
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Text
        style={{
          fontSize: 12,
          color: "#8E8E8E",
          marginTop: 8,
        }}
      >
        {post.createdAt
          ? new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Just now"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 11,
    shadowColor: "#000",
  },
});
