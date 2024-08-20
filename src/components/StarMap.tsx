import { Canvas, Circle, matchFont, Text } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Dimensions, Platform } from "react-native";

type T = "Oc" | "Ga" | "Ne" | "Gc" | "P" | "Ca" | "S" | "U";
interface Star {
  DE: number;
  RA: number;
  name: string;
  t: T;
  AM: number;
}

interface StarMapProps {
  stars: Star[];
}

export default function StarMap({ stars }: StarMapProps) {
  const { width, height } = Dimensions.get("screen");
  const [scale, setscale] = useState<number>(1);

  const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
  const fontStyle = {
    fontFamily,
  };
  const font = matchFont(fontStyle);

  const projectTo2d = (star: Star) => {
    const x = (star.RA / 360) * width;
    const y = ((90 - star.DE) / 180) * height;
    const r = Math.max(1, 5 - star.AM / 2);
    const t = star.t;
    const color =
      t === "Oc"
        ? "#f00"
        : t === "Ca"
          ? "#f0f"
          : t === "Gc"
            ? "#ff0"
            : t === "Ne"
              ? "#0ff"
              : t === "Ga"
                ? "#0f0"
                : t === "P"
                  ? "#00f"
                  : t === "S"
                    ? "#0bbbb0"
                    : t === "U"
                      ? "#eee0e0"
                      : "#ffffff";

    return { x, y, r, color };
  };

  return (
    <Canvas
      className="flex-1 bg-black"
      style={{ width, height, transform: [{ scale }] }}
    >
      {stars.map((star, index) => {
        const { x, y, r, color } = projectTo2d(star);

        return (
          <React.Fragment key={index}>
            <Circle cx={x} cy={y} r={r} color={color} />
          </React.Fragment>
        );
      })}
    </Canvas>
  );
}
// <Text
//   x={x + 5}
//   y={y - 5}
//   text={star.name}
//   color="#ffffff"
//   font={font}
// />
