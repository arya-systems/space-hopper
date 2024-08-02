import { Material3ThemeProvider } from "@/components/providers/Material3ThemeProvider";
import { persistor, store } from "@/features/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router/stack";
import { ActivityIndicator } from "react-native-paper";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function Layout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <Material3ThemeProvider
          settings={{
            icon: (props: any) => <Ionicons {...props} />,
          }}
        >
          <Stack
            screenOptions={{
              animation: "default",
              headerShown: false,
            }}
            initialRouteName="/"
          >
            <Stack.Screen name="index" options={{}} />
          </Stack>
        </Material3ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
