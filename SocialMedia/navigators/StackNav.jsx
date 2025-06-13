import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import TabNav from "./TabNav";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import Create from "../screens/Create";

export default function StackNav() {
  const Stack = createNativeStackNavigator();
  const { isSignedIn } = useContext(AuthContext);
  return (
    <Stack.Navigator>
      {isSignedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={TabNav}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Create"
            component={Create}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
