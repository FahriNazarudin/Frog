import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import TabNav from "./TabNav";


export default function StackNav() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen name="Home" component={TabNav} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
