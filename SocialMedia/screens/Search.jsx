import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";

const GET_ALL_USERS = gql`
  query GetUsers {
    getAllUsers {
      _id
      name
      username
      isFollowing
    }
  }
`;

const GET_USER_BY_USERNAME = gql`
  query GetUserByUsername($username: String) {
    getUserByUsername(username: $username) {
      _id
      name
      username
      isFollowing
    }
  }
`;

const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId)
  }
`;

const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId)
  }
`;

export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  const [searchUserByUsername, { loading: searchLoading }] = useLazyQuery(
    GET_USER_BY_USERNAME,
    {
      errorPolicy: "ignore",
      fetchPolicy: "cache-first",
    }
  );

  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    refetchQueries: ["GetUsers", "GetMyFollowing", "GetMyFollowers"],
    awaitRefetchQueries: true,
    errorPolicy: "all",
  });

  const [unfollowUser, { loading: unfollowLoading }] = useMutation(
    UNFOLLOW_USER,
    {
      refetchQueries: ["GetUsers", "GetMyFollowing", "GetMyFollowers"],
      awaitRefetchQueries: true,
      errorPolicy: "all",
    }
  );

  // Improved search function with fuzzy matching
  const fuzzySearch = useCallback((text, targetText) => {
    if (!text || !targetText) return false;

    const searchTerm = text.toLowerCase().trim();
    const target = targetText.toLowerCase();

    // Exact match
    if (target.includes(searchTerm)) return true;

    // Fuzzy match - allow for typos (simple implementation)
    if (searchTerm.length > 2) {
      let matches = 0;
      let searchIndex = 0;

      for (
        let i = 0;
        i < target.length && searchIndex < searchTerm.length;
        i++
      ) {
        if (target[i] === searchTerm[searchIndex]) {
          matches++;
          searchIndex++;
        }
      }

      // If 80% of characters match in order, consider it a match
      return matches / searchTerm.length >= 0.8;
    }

    return false;
  }, []);

  // Optimized filtered users with memoization
  const filteredUsers = useMemo(() => {
    const allUsers = data?.getAllUsers || [];

    if (!searchText.trim()) {
      return allUsers;
    }

    const searchTerm = searchText.toLowerCase().trim();

    return allUsers
      .filter((user) => {
        const nameMatch = user.name && fuzzySearch(searchTerm, user.name);
        const usernameMatch =
          user.username && fuzzySearch(searchTerm, user.username);

        return nameMatch || usernameMatch;
      })
      .sort((a, b) => {
        // Prioritize exact matches
        const aNameExact = a.name?.toLowerCase().startsWith(searchTerm);
        const bNameExact = b.name?.toLowerCase().startsWith(searchTerm);
        const aUsernameExact = a.username?.toLowerCase().startsWith(searchTerm);
        const bUsernameExact = b.username?.toLowerCase().startsWith(searchTerm);

        if ((aNameExact || aUsernameExact) && !(bNameExact || bUsernameExact))
          return -1;
        if (!(aNameExact || aUsernameExact) && (bNameExact || bUsernameExact))
          return 1;

        return 0;
      });
  }, [data?.getAllUsers, searchText, fuzzySearch]);

  // Debounced search with improved logic
  const debouncedSearch = useCallback(
    debounce(async (text) => {
      if (!text.trim()) {
        setIsSearchActive(false);
        return;
      }

      setIsSearchActive(true);

      try {
        // Try GraphQL search as a supplement, not replacement
        await searchUserByUsername({
          variables: { username: text.trim() },
        });
      } catch (error) {
        console.log("GraphQL search failed, using local search:", error);
      } finally {
        setIsSearchActive(false);
      }
    }, 300),
    [searchUserByUsername]
  );

  const handleSearch = useCallback(
    (text) => {
      setSearchText(text);
      debouncedSearch(text);
    },
    [debouncedSearch]
  );

  const handleFollowToggle = useCallback(
    async (userId, isFollowing) => {
      try {
        if (isFollowing) {
          await unfollowUser({ variables: { userId } });
        } else {
          await followUser({ variables: { userId } });
        }
      } catch (error) {
        console.log("Follow toggle error:", error);
        Alert.alert(
          "Error",
          "Failed to update follow status. Please try again.",
          [{ text: "OK" }]
        );
      }
    },
    [followUser, unfollowUser]
  );

  const clearSearch = useCallback(() => {
    setSearchText("");
    setIsSearchActive(false);
  }, []);

  const renderUserItem = useCallback(
    ({ item }) => {
      const isLoading = followLoading || unfollowLoading;

      return (
        <TouchableOpacity style={styles.userItem} activeOpacity={0.7}>
          <Image
            source={{
              uri: `https://image.pollinations.ai/prompt/avatar%20${encodeURIComponent(
                item.name
              )}?width=100&height=100&nologo=true&model=flux`,
            }}
            style={styles.avatar}
            defaultSource={{
              uri: "https://via.placeholder.com/50x50/06C755/FFFFFF?text=?",
            }}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {highlightSearchTerm(item.name, searchText)}
            </Text>
            <Text style={styles.userUsername} numberOfLines={1}>
              @{highlightSearchTerm(item.username, searchText)}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.followButton,
              {
                backgroundColor: item.isFollowing ? "#E1E8ED" : "#06C755",
                opacity: isLoading ? 0.6 : 1,
              },
            ]}
            onPress={() => handleFollowToggle(item._id, item.isFollowing)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={item.isFollowing ? "#262626" : "#FFFFFF"}
              />
            ) : (
              <Text
                style={[
                  styles.followButtonText,
                  { color: item.isFollowing ? "#262626" : "#FFFFFF" },
                ]}
              >
                {item.isFollowing ? "Following" : "Follow"}
              </Text>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [followLoading, unfollowLoading, handleFollowToggle, searchText]
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={48} color="#8E8E8E" />
        <Text style={styles.emptyTitle}>
          {searchText ? "No users found" : "No users available"}
        </Text>
        {searchText && (
          <Text style={styles.emptySubtitle}>
            Try searching with different keywords
          </Text>
        )}
      </View>
    ),
    [searchText]
  );

  const keyExtractor = useCallback((item) => item._id, []);

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search Users</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#06C755" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search Users</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Error loading users</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Users</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          {searchLoading || isSearchActive ? (
            <ActivityIndicator
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
          ) : (
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
          )}
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or username..."
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            value={searchText}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchText && !searchLoading && !isSearchActive && (
        <View style={styles.searchStatus}>
          <Text style={styles.searchStatusText}>
            {filteredUsers.length > 0
              ? `Found ${filteredUsers.length} user${
                  filteredUsers.length !== 1 ? "s" : ""
                } for "${searchText}"`
              : `No users found for "${searchText}"`}
          </Text>
        </View>
      )}

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyComponent}
        refreshing={loading}
        onRefresh={refetch}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 82,
          offset: 82 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function highlightSearchTerm(text, searchTerm) {
  if (!searchTerm.trim() || !text) return text;
  // This is a placeholder - you can implement text highlighting here if needed
  return text;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#262626",
    textAlign: "center",
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F3F4",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#262626",
  },
  clearButton: {
    padding: 5,
  },
  searchStatus: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  searchStatusText: {
    fontSize: 14,
    color: "#8E8E8E",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#8E8E8E",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorTitle: {
    color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  errorMessage: {
    color: "#8E8E8E",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
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
    paddingVertical: 10,
    paddingBottom: 100,
  },
  userItem: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#06C755",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#262626",
  },
  userUsername: {
    fontSize: 14,
    color: "#8E8E8E",
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600",
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
});
