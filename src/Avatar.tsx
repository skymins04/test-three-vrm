import { useEffect, useRef, useState } from "react";

import { Object3D } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { VRM, VRMSchema, VRMUtils, VRMDebug } from "@pixiv/three-vrm";

export const Avatar = () => {
  const { neck, leftShoulder, rightShoulder } = useControls({
    neck: { value: 0, min: -1, max: 1 },
    leftShoulder: { value: 0, min: -1, max: 1 },
    rightShoulder: { value: 0, min: -1, max: 1 },
  });
  const { scene, camera } = useThree();
  const gltf = useGLTF("/test.vrm");
  const avatar = useRef<VRM>();
  const [bonesStore, setBones] = useState<{ [part: string]: Object3D | null }>({});

  useEffect(() => {
    if (gltf) {
      VRMUtils.removeUnnecessaryJoints(gltf.scene);
      VRMDebug.from(gltf as any).then(vrm => {
        avatar.current = vrm;
        if (vrm.lookAt && vrm.humanoid) {
          vrm.lookAt.target = camera;
          const boneNames = VRMSchema.HumanoidBoneName;
          const hipsBoneNode = vrm.humanoid.getBoneNode(boneNames.Hips);
          if (hipsBoneNode) {
            hipsBoneNode.rotation.y = Math.PI;

            const bones = {
              neck: vrm.humanoid.getBoneNode(boneNames.Neck),
              hips: hipsBoneNode,
              leftShoulder: vrm.humanoid.getBoneNode(boneNames.LeftShoulder),
              rightShoulder: vrm.humanoid.getBoneNode(boneNames.RightShoulder),
            };

            setBones(bones);
            vrm.springBoneManager?.reset();
          }
        }
      });
    }
  }, [scene, gltf, camera]);

  useFrame(({}, delta) => {
    if (avatar.current) {
      avatar.current.update(delta);
    }
    if (bonesStore.neck) {
      bonesStore.neck.rotation.y = (neck * Math.PI) / 2;
    }
    if (bonesStore.leftShoulder) {
      bonesStore.leftShoulder.rotation.z = (leftShoulder * Math.PI) / 2.5;
    }
    if (bonesStore.rightShoulder) {
      bonesStore.rightShoulder.rotation.z = (rightShoulder * Math.PI) / -2.5;
    }
  });

  return <primitive object={gltf.scene} />;
};
