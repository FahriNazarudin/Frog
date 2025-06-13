import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";

export default function CardPost({ post }) {
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
              uri: `https://image.pollinations.ai/prompt/${
                post.authorDetail?.name
              }?width=100&height=100&nologo=true`,
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
        <TouchableOpacity>
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


      {post.tag && (
        <View
          style={{
            flexDirection: "row",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#06C755",
              fontWeight: "500",
            }}
          >
            #{post.tag}
          </Text>
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
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Feather name="heart" size={21} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginRight: 16 }}>
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
              key={index}
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
            <TouchableOpacity>
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
        {new Date(parseInt(post.createdAt)).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
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
