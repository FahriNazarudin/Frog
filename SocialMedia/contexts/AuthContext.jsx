import { createContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getSecure } from "../helpers/secureStore";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getSecure("token");
        const userData = await getSecure("user");

        console.log("Token from storage:", token);
        console.log("User data from storage:", userData);

        if (token && userData) {
          setIsSignedIn(true);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.log("Error checking token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
