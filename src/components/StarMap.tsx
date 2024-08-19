import { Canvas, Circle, Text } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Dimensions } from "react-native";

interface Star {
  DE: number;
  RA: number;
  name: string;
  t: string;
  AM: number;
}

interface StarMapProps {
  stars: Star[];
}

export default function StarMap({ stars }: StarMapProps) {
  const { width, height } = Dimensions.get("screen");
  const [scale, setscale] = useState<number>(1);

  const projectTo2d = ({ RA, DE }: { RA: number; DE: number }) => {
    const x = (RA / 360) * width;
    const y = ((90 - DE) / 180) * height;

    return { x, y };
  };

  return (
    <Canvas className="flex-1" style={{ transform: [{ scale }] }}>
      {stars.map((star, index) => {
        const { x, y } = projectTo2d({ RA: star.RA, DE: star.DE });
        const size = Math.max(1, 5 - star.AM / 2);
        const color = star.t === "Oc" ? "#00f" : #ffffff;

        return (
          <>
            <Circle cx={x} cy={y} r={size} color={color} />
            <Text x={x + 5} y={y - 5} text={star.name} color="#fff" />
          </>
        );
      })}
    </Canvas>
  );
}
