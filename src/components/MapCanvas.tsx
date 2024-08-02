import { View, Text } from "react-native";
import React from "react";
import { Canvas, Circle, Group } from "@shopify/react-native-skia";
import { useAppTheme } from "./providers/Material3ThemeProvider";

export default function MapCanvas() {
  const { colors } = useAppTheme();

  const width = 256;
  const height = 256;
  const r = width * 0.33;

  return (
    <Canvas
      style={{ width: "100%", height: "100%", backgroundColor: colors.surface }}
    >
      <Group blendMode="multiply">
        <Circle cx={r} cy={r} r={r} color="cyan" />
        <Circle cx={width - r} cy={r} r={r} color="magenta" />
        <Circle cx={width / 2} cy={width - r} r={r} color="yellow" />
      </Group>
    </Canvas>
  );
}
