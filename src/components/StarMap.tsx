import { OrbitControls, PerspectiveCamera } from "@react-three/drei/native";
import { Canvas } from "@react-three/fiber/native";
import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import * as THREE from "three";

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
  const raDecToXYZ = (star: Star) => {
    const raRad = (star.RA / 180) * Math.PI;
    const decRad = (star.DE / 180) * Math.PI;

    const distance = Math.max(1, 30 + (star.AM - 0.4) * 10);
    // const baseDistance = 50;
    // const distance = baseDistance + star.AM * 10;
    //     // const distance = 50 + Math.log(1 + star.AM) * 20;
    //     const minAM = Math.min(...stars.map(s => s.AM));
    // const maxAM = Math.max(...stars.map(s => s.AM));
    //
    // const normalizedAM = (star.AM - minAM) / (maxAM - minAM);
    // const distance = 30 + normalizedAM * 50;

    const x = distance * Math.cos(decRad) * Math.cos(raRad);
    const y = distance * Math.cos(decRad) * Math.sin(raRad);
    const z = distance * Math.sin(decRad);

    const position = new THREE.Vector3(x, y, z);

    const minSize = 0.05;
    const maxSize = 0.5;
    const size = maxSize - star.AM * 0.1;

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

    return { position, size, color };
  };

  return (
    <View style={{ flex: 1 }} className="bg-gray-600 w-full h-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial color="#000080" wireframe={true} />
        </mesh>

        <OrbitControls
          makeDefault
          enableZoom={true}
          zoomSpeed={0.5}
          minDistance={50}
          maxDistance={200}
        />

        <PerspectiveCamera
          makeDefault
          position={[0, 0, 100]} // Camera position
          fov={75} // Field of view
          near={0.1} // Near clipping plane
          far={1000} // Far
        />

        {stars.map((star, index) => {
          const { position, size, color } = raDecToXYZ(star);

          return (
            <group>
              <mesh key={index} position={position.toArray()}>
                <sphereGeometry args={[size, 16, 16]} />
                <meshBasicMaterial color={color} />
              </mesh>
            </group>
          );
        })}
      </Canvas>
    </View>
  );
}
