import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Dimensions, View } from "react-native";

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

  // Convert RA/Dec to XYZ coordinates
  const raDecToXYZ = (ra: number, dec: number, distance: number = 1) => {
    const raRad = (ra / 180) * Math.PI;
    const decRad = (dec / 180) * Math.PI;

    const x = distance * Math.cos(decRad) * Math.cos(raRad);
    const y = distance * Math.cos(decRad) * Math.sin(raRad);
    const z = distance * Math.sin(decRad);

    return new THREE.Vector3(x, y, z);
  };

  return (
    <View style={{ flex: 1 }} className="bg-gray-600 w-full h-full">
      <Canvas>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Camera Controls */}
        <OrbitControls enableZoom={true} zoomSpeed={0.5} />

        {/* Stars */}
        {stars.map((star, index) => {
          const position = raDecToXYZ(star.RA, star.DE, 5); // 5 is the distance (can be scaled)
          return (
            <mesh key={index} position={position.toArray()}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial color="#ff0000" />
            </mesh>
          );
        })}

        {/* Optional: Add a star field background */}
        {/* <Stars */}
        {/*   radius={100} */}
        {/*   depth={50} */}
        {/*   count={5000} */}
        {/*   factor={4} */}
        {/*   saturation={0} */}
        {/*   fade */}
        {/* /> */}
      </Canvas>
    </View>
  );
}
