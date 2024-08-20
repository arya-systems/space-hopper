import { Canvas, Circle, matchFont, Text } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Dimensions, PanResponder, Platform } from "react-native";

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

  const useRotation = () => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        setRotation((prev) => ({
          x: prev.x + gestureState.dy * 0.01,
          y: prev.y + gestureState.dx * 0.01,
        }));
      },
    });

    return { rotation, panResponder };
  };
  const { rotation, panResponder } = useRotation();
  const raDecToXYZ = (star: Star) => {
    const ra = star.RA + (rotation.y * 180) / Math.PI;
    const de = star.DE + (rotation.x * 180) / Math.PI;
    const raRad = (ra / 180) * Math.PI; // Convert to radians
    const decRad = (de / 180) * Math.PI; // Convert to radians

    const x = Math.cos(decRad) * Math.cos(raRad);
    const y = Math.cos(decRad) * Math.sin(raRad);
    const z = Math.sin(decRad);

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

    return { x, y, z, r, color };
  };

  const project3DTo2D = ({
    x,
    y,
    z,
    cameraDistance = 3,
  }: {
    x: number;
    y: number;
    z: number;
    cameraDistance: number;
  }) => {
    const scale = cameraDistance / (cameraDistance + z); // Perspective projection
    const x2D = x * scale * (width / 2) + width / 2;
    const y2D = y * scale * (height / 2) + height / 2;

    return { x: x2D, y: y2D };
  };

  return (
    <Canvas
      className="flex-1 bg-black"
      style={{ width, height }}
      {...panResponder.panHandlers}
    >
      {stars.map((star, index) => {
        // const { x, y, r, color } = projectTo2d(star);

        const { x, y, z, r, color } = raDecToXYZ(star);
        const { x: x2D, y: y2D } = project3DTo2D({
          x,
          y,
          z,
          cameraDistance: 3,
        });

        return (
          <React.Fragment key={index}>
            <Circle cx={x2D} cy={y2D} r={r} color={color} />
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
