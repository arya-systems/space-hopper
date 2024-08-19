import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer } from "three";

interface StarData {
  DE: number; // Declination
  RA: number; // Right Ascension
  name: string; // Name
  t: string; // Type
  AM: number; // Apparent Magnitude
}

const raDecToXYZ = (ra: number, dec: number, distance: number = 1) => {
  const raRad = (ra / 180) * Math.PI; // Convert to radians
  const decRad = (dec / 180) * Math.PI; // Convert to radians

  const x = distance * Math.cos(decRad) * Math.cos(raRad);
  const y = distance * Math.cos(decRad) * Math.sin(raRad);
  const z = distance * Math.sin(decRad);

  return { x, y, z };
};
const createStarGeometry = (stars: StarData[]) => {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];

  stars.forEach((star) => {
    const { x, y, z } = raDecToXYZ(star.RA, star.DE);
    vertices.push(x, y, z);
  });

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );

  return geometry;
};

export default function three() {
  const glViewRef = useRef<ExpoWebGLRenderingContext | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    const init = async () => {
      const gl = glViewRef.current!;
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

      // Create scene and camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000,
      );
      camera.position.z = 5;

      cameraRef.current = camera;
      sceneRef.current = scene;

      // Star data (replace this with your actual data)
      const stars: StarData[] = [
        { DE: 24.1167, RA: 56.75, name: "M45", t: "Oc", AM: 1.6 },
        { DE: -8.2, RA: 83.6333, name: "M42", t: "Oc", AM: 0.4 },
        // Add more stars here...
      ];

      // Create and add star points
      const starGeometry = createStarGeometry(stars);
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5, // Adjust size based on Apparent Magnitude
      });

      const starPoints = new THREE.Points(starGeometry, starMaterial);
      scene.add(starPoints);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        starPoints.rotation.x += 0.0005;
        starPoints.rotation.y += 0.0005;

        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      animate();
    };

    init();
  }, []);

  return (
    <GLView
      style={{ flex: 1 }}
      onContextCreate={(gl) => (glViewRef.current = gl)}
    />
  );
}

// import { Canvas, Circle, matchFont, Text } from "@shopify/react-native-skia";
// import React, { useState } from "react";
// import { Dimensions, Platform } from "react-native";
//
// type T = "Oc" | "Ga" | "Ne" | "Gc" | "P" | "Ca" | "S" | "U";
// interface Star {
//   DE: number;
//   RA: number;
//   name: string;
//   t: T;
//   AM: number;
// }
//
// interface StarMapProps {
//   stars: Star[];
// }
//
// export default function StarMap({ stars }: StarMapProps) {
//   const { width, height } = Dimensions.get("screen");
//   const [scale, setscale] = useState<number>(1);
//
//   const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
//   const fontStyle = {
//     fontFamily,
//   };
//   const font = matchFont(fontStyle);
//
//   const projectTo2d = (star: Star) => {
//     const x = (star.RA / 360) * width;
//     const y = ((90 - star.DE) / 180) * height;
//     const r = Math.max(1, 5 - star.AM / 2);
//     const t = star.t;
//     const color =
//       t === "Oc"
//         ? "#f00"
//         : t === "Ca"
//           ? "#f0f"
//           : t === "Gc"
//             ? "#ff0"
//             : t === "Ne"
//               ? "#0ff"
//               : t === "Ga"
//                 ? "#0f0"
//                 : t === "P"
//                   ? "#00f"
//                   : t === "S"
//                     ? "#0bbbb0"
//                     : t === "U"
//                       ? "#eee0e0"
//                       : "#ffffff";
//
//     return { x, y, r, color };
//   };
//
//   return (
//     <Canvas
//       className="flex-1 bg-black"
//       style={{ width, height, transform: [{ scale }] }}
//     >
//       {stars.map((star, index) => {
//         const { x, y, r, color } = projectTo2d(star);
//
//         return (
//           <React.Fragment key={index}>
//             <Circle cx={x} cy={y} r={r} color={color} />
//           </React.Fragment>
//         );
//       })}
//     </Canvas>
//   );
// }
// // <Text
// //   x={x + 5}
// //   y={y - 5}
// //   text={star.name}
// //   color="#ffffff"
// //   font={font}
// // />
