import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { FAB, Surface, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function index() {
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();

  const [isbuttonsHidden, setisbuttonsHidden] = useState<boolean>(false);

  return (
    <>
      <Surface mode="flat" className="h-full">
        <Text className="text-center font-bold text-2xl">Namaste World!</Text>
      </Surface>

      <View
        className="absolute top-0 right-0"
        style={{
          padding: 16,
          paddingTop: top + 16,
          display: isbuttonsHidden ? "none" : "flex",
        }}
      >
        <FAB
          size="small"
          icon="settings"
          onPress={() => router.navigate("settings")}
        />
      </View>
      <FAB
        size="medium"
        icon={isbuttonsHidden ? "eye" : "eye-off"}
        onPress={() => setisbuttonsHidden((prev) => !prev)}
        className="absolute bottom-0 right-0"
        style={{ margin: 16, marginBottom: bottom + 16 }}
      />
    </>
  );
}
