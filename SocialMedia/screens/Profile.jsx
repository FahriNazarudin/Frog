import { AntDesign } from "@expo/vector-icons";
import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Modal,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

const GET_USER_PROFILE = gql`
  query GetUserProfile {
    getUserProfile {
      _id
      name
      username
      email
    }
  }
`;

const GET_MY_FOLLOWERS = gql`
  query GetMyFollowers {
    getMyFollowers {
      isFollowing
      username
    }
  }
`;

const GET_MY_FOLLOWING = gql`
  query GetMyFollowing {
    getMyFollowing {
      isFollowing
      username
    }
  }
`;

export default function Profile() {
  const { setIsSignedIn } = useContext(AuthContext);
  const navigation = useNavigation();
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery(GET_USER_PROFILE, {
    fetchPolicy: "cache-and-network", // Changed from network-only
  });

  const {
    data: followersData,
    loading: followersLoading,
    error: followersError,
    refetch: refetchFollowers,
  } = useQuery(GET_MY_FOLLOWERS, {
    fetchPolicy: "cache-and-network", // Add fetchPolicy
  });

  const {
    data: followingData,
    loading: followingLoading,
    error: followingError,
    refetch: refetchFollowing,
  } = useQuery(GET_MY_FOLLOWING, {
    fetchPolicy: "cache-and-network", // Add fetchPolicy
  });

  // Add focus effect to refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetchFollowers();
      refetchFollowing();
    }, [refetchFollowers, refetchFollowing])
  );

  const handleRefresh = () => {
    refetchProfile();
    refetchFollowers();
    refetchFollowing();
  };

  if (profileLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#06C755" />
        <Text style={{ marginTop: 10, color: "#8E8E8E" }}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  if (profileError) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#FF6B6B",
            fontSize: 16,
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Error loading profile: {profileError.message}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#06C755",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
          }}
          onPress={handleRefresh}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const userData = profileData?.getUserProfile;
  const followers = followersData?.getMyFollowers || [];
  const following = followingData?.getMyFollowing || [];

  if (!userData) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
          No profile data found
        </Text>
      </SafeAreaView>
    );
  }

  const renderFollowerItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
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
          {item.username ? item.username.charAt(0).toUpperCase() : "?"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#FFFFFF",
          }}
        >
          @{item.username || "unknown"}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: item.isFollowing ? "#06C755" : "#8E8E8E",
          }}
        >
          {item.isFollowing ? "Following back" : "Not following back"}
        </Text>
      </View>
    </View>
  );

  const renderFollowingItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
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
          {item.username ? item.username.charAt(0).toUpperCase() : "?"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#FFFFFF",
          }}
        >
          @{item.username || "unknown"}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: item.isFollowing ? "#06C755" : "#8E8E8E",
          }}
        >
          {item.isFollowing ? "Mutual follow" : "Following"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop",
        }}
        style={{ flex: 1, width: "100%", height: "100%" }}
        imageStyle={{ opacity: 0.8 }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />

        <View style={styles.header}>
          <TouchableOpacity></TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              console.log("Logout pressed");
              setIsSignedIn(false);
            }}
          >
            <AntDesign name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 50,
          }}
        >
          {/* Profile Picture */}
          <View style={{ marginBottom: 20 }}>
            <Image
              source={{
                uri: `https://image.pollinations.ai/prompt/avatar%20${userData.name}%0A?width=500&height=500&nologo=true&model=flux`,
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: "#FFFFFF",
              }}
            />
          </View>

          {/* User Info */}
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#FFFFFF",
                marginBottom: 4,
              }}
            >
              {userData.name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#E0E0E0",
                marginBottom: 20,
              }}
            >
              @{userData.username}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  flex: 1,
                  marginRight: 8,
                }}
                onPress={() => setShowFollowersModal(true)}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  {followersLoading ? "..." : followers.length}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#E0E0E0",
                    marginTop: 4,
                  }}
                >
                  Followers
                </Text>
                {followersError && (
                  <Text
                    style={{ fontSize: 10, color: "#FF6B6B", marginTop: 2 }}
                  >
                    Error
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  flex: 1,
                  marginLeft: 8,
                }}
                onPress={() => setShowFollowingModal(true)}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  {followingLoading ? "..." : following.length}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#E0E0E0",
                    marginTop: 4,
                  }}
                >
                  Following
                </Text>
                {followingError && (
                  <Text
                    style={{ fontSize: 10, color: "#FF6B6B", marginTop: 2 }}
                  >
                    Error
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              borderTopWidth: 1,
              borderTopColor: "rgba(255, 255, 255, 0.2)",
              paddingTop: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                console.log("Edit profile pressed");
              }}
            >
              <AntDesign name="edit" size={16} color="white" />
              <Text
                style={{
                  color: "#FFFFFF",
                  marginLeft: 8,
                  fontWeight: "600",
                }}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Followers Modal */}
      <Modal
        visible={showFollowersModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFollowersModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#FFFFFF",
              }}
            >
              Followers ({followers.length})
            </Text>
            <TouchableOpacity onPress={() => setShowFollowersModal(false)}>
              <AntDesign name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {followersLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          ) : followersError ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#FF6B6B", textAlign: "center" }}>
                Error loading followers: {followersError.message}
              </Text>
            </View>
          ) : (
            <FlatList
              data={followers}
              renderItem={renderFollowerItem}
              keyExtractor={(item, index) =>
                `follower-${item.username}-${index}`
              }
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 50,
                  }}
                >
                  <Text style={{ color: "#8E8E8E", fontSize: 16 }}>
                    No followers yet
                  </Text>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* Following Modal */}
      <Modal
        visible={showFollowingModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFollowingModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#FFFFFF",
              }}
            >
              Following ({following.length})
            </Text>
            <TouchableOpacity onPress={() => setShowFollowingModal(false)}>
              <AntDesign name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {followingLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          ) : followingError ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#FF6B6B", textAlign: "center" }}>
                Error loading following: {followingError.message}
              </Text>
            </View>
          ) : (
            <FlatList
              data={following}
              renderItem={renderFollowingItem}
              keyExtractor={(item, index) =>
                `following-${item.username}-${index}`
              }
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 50,
                  }}
                >
                  <Text style={{ color: "#8E8E8E", fontSize: 16 }}>
                    Not following anyone yet
                  </Text>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
});
