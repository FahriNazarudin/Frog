
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { gql, useQuery } from "@apollo/client";
import { useCallback } from "react";

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
    errorPolicy: "all",
    fetchPolicy: "cache-and-network", // This will use cache first but also fetch from network
    notifyOnNetworkStatusChange: true,
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

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Only refetch if we're coming back from another screen
      // and we have existing data (to avoid double loading)
      if (data) {
        refetch();
      }
    }, [refetch, data])
  );

  // Sanitize data untuk menghindari parsing error
  const sanitizedPosts =
    data?.getPosts
      ?.map((post) => ({
        ...post,
        tag: post.tag || "",
        imgUrl: post.imgUrl || "",
        content: post.content || "",
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

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#06C755" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Failed to load posts</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sanitizedPosts}
        renderItem={({ item }) => <CardPost post={item} />}
        keyExtractor={(post) => post._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={() => refetch()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#8E8E8E" />
            <Text style={styles.emptyTitle}>No posts available</Text>
            <Text style={styles.emptySubtitle}>
              Pull to refresh or create your first post!
            </Text>
          </View>
        }
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            console.log("create post button pressed");
            navigation.navigate("Create");
          }}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 10,
    color: "#8E8E8E",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
  },
  errorTitle: {
    color: "#FF6B6B",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  errorMessage: {
    color: "#8E8E8E",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#06C755",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 100,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#8E8E8E",
    textAlign: "center",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
    marginTop: 5,
  },
  fabContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  fab: {
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
  },
};
