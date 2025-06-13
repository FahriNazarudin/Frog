import React, { useState, useEffect } from "react";
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
import { gql, useQuery, useMutation } from "@apollo/client";

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
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
    onCompleted: (data) => {
      console.log("Users data loaded:", data?.getAllUsers?.length, "users");
      setFilteredUsers(data?.getAllUsers || []);
    },
  });

  // Set filteredUsers ketika data berubah
  useEffect(() => {
    if (data?.getAllUsers) {
      setFilteredUsers(data.getAllUsers);
    }
  }, [data]);

  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    refetchQueries: ["GetUsers"], 
  });

  const [unfollowUser, { loading: unfollowLoading }] = useMutation(
    UNFOLLOW_USER,
    {
      refetchQueries: ["GetUsers"], 
  
    }
  );

  const handleSearch = (text) => {
    setSearchText(text);
    const allUsers = data?.getAllUsers || [];

    if (!text.trim()) {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(text.toLowerCase()) ||
          user.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowUser({ variables: { userId } });
      } else {
        await followUser({ variables: { userId } });
      }
    } catch (error) {
      console.log("Follow toggle error:", error);
    }
  };

  const renderUserItem = ({ item }) => {
    return (
      <View
        style={{
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
        }}
      >
        <Image
          source={{
            uri: `https://image.pollinations.ai/prompt/avatar%20${item.name}?width=100&height=100&nologo=true&model=flux`,
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 12,
            backgroundColor: "#06C755",
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
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#8E8E8E",
            }}
          >
            @{item.username}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: item.isFollowing ? "#E1E8ED" : "#06C755",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            minWidth: 80,
            alignItems: "center",
            opacity: followLoading || unfollowLoading ? 0.6 : 1,
          }}
          onPress={() => {
            handleFollowToggle(item._id, item.isFollowing);
          }}
          disabled={followLoading || unfollowLoading}
        >
          {followLoading || unfollowLoading ? (
            <ActivityIndicator
              size="small"
              color={item.isFollowing ? "#262626" : "#FFFFFF"}
            />
          ) : (
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: item.isFollowing ? "#262626" : "#FFFFFF",
              }}
            >
              {item.isFollowing ? "Following" : "Follow"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#E1E8ED",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: "#262626",
            textAlign: "center",
          }}
        >
          Search Users
        </Text>
      </View>


      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#E1E8ED",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F1F3F4",
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: "#262626",
            }}
            placeholder="Search users by name or username..."
            placeholderTextColor="#999"
            autoCapitalize="none"
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText("");
                setFilteredUsers(data?.getAllUsers || []);
              }}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>


      {/* Content */}
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#06C755" />
          <Text style={{ marginTop: 10, color: "#8E8E8E" }}>
            Loading users...
          </Text>
        </View>
      ) : error ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text
            style={{
              color: "#FF6B6B",
              fontSize: 16,
              textAlign: "center",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            Error loading users
          </Text>
          <Text
            style={{
              color: "#8E8E8E",
              fontSize: 14,
              textAlign: "center",
              marginBottom: 20,
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
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 10,
            paddingBottom: 100,
          }}
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
              <Ionicons name="people-outline" size={48} color="#8E8E8E" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#8E8E8E",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                {searchText ? "No users found" : "No users available"}
              </Text>
              {searchText && (
                <Text
                  style={{
                    fontSize: 14,
                    color: "#CCCCCC",
                    textAlign: "center",
                    marginTop: 5,
                  }}
                >
                  Try searching with different keywords
                </Text>
              )}
            </View>
          }
          refreshing={loading}
          onRefresh={() => refetch()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
});
