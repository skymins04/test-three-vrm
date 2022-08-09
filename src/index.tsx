import { Suspense } from "react";
import ReactDOM from "react-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Avatar } from "./Avatar";

import "./style.scss";

ReactDOM.render(
  <Canvas>
    <OrbitControls />
    <spotLight position={[0, 2, -1]} intensity={0.4} />
    <ambientLight intensity={0.65} />
    <gridHelper />
    <axesHelper />
    <Suspense fallback={null}>
      <Avatar />
    </Suspense>
  </Canvas>,
  document.getElementById("root"),
);
