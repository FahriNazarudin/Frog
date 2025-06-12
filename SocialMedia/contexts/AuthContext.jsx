import { createContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getSecure } from "../helpers/secureStore";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getSecure("token");
        if (token) {
          setIsSignedIn(true);
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
    <AuthContext value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext>
  );
}
