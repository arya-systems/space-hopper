import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React from "react";
import { useAppTheme } from "./providers/Material3ThemeProvider";

export default function MapCanvas() {
  const { colors } = useAppTheme();

  const path = Skia.Path.Make();
  path.moveTo(128, 0);
  path.lineTo(168, 80);
  path.lineTo(256, 93);
  path.lineTo(192, 155);
  path.lineTo(207, 244);
  path.lineTo(128, 202);
  path.lineTo(49, 244);
  path.lineTo(64, 155);
  path.lineTo(0, 93);
  path.lineTo(88, 80);
  path.lineTo(128, 0);
  path.close();

  path.moveTo(228, 100);
  path.lineTo(268, 180);
  path.lineTo(356, 193);
  path.lineTo(292, 255);
  path.lineTo(307, 344);
  path.lineTo(228, 302);
  path.lineTo(149, 344);
  path.lineTo(164, 255);
  path.lineTo(100, 193);
  path.lineTo(188, 180);
  path.lineTo(228, 100);
  path.close();

  return (
    <Canvas
      className="flex-1"
      style={{ width: "100%", height: "100%", backgroundColor: colors.surface }}
    >
      <Path path={path} color="lightblue" />
    </Canvas>
  );
}
