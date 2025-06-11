import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text } from "react-native";
import Home from "../screens/Home";
import Profile from "../screens/Profile";

export default function StackNav() {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
          />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    );
}