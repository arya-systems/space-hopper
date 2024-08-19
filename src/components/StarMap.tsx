import { Canvas, Circle } from "@shopify/react-native-skia";
import React, { useState } from "react";

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
  const [scale, setscale] = useState<number>(1);

  return (
    <Canvas className="flex-1" style={{ transform: [{ scale }] }}>
      {stars.map((star, index) => (
        <Circle
          key={index}
          color="#ffffff"
          cx={star.DE}
          cy={star.AM}
          r={star.RA}
        />
      ))}
    </Canvas>
  );
}
