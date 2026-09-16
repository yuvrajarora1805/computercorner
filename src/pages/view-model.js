import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import dynamic from "next/dynamic";

const Model = () => {
  const { scene } = useGLTF("/models/storage.glb");
  return <primitive object={scene} scale={2} />;
};

const ModelViewer = () => {
  return (
    <div className="w-full h-screen bg-slate-900 flex flex-col items-center justify-center">
      <h1 className="text-white text-2xl mb-4 font-bold">3D Model Inspector</h1>
      <div className="w-full max-w-4xl h-[70vh] bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Environment preset="city" />
          
          <Suspense fallback={null}>
            <Model />
          </Suspense>
          
          <OrbitControls makeDefault autoRotate autoRotateSpeed={2} />
        </Canvas>
      </div>
      <p className="text-slate-400 mt-4">Drag to rotate • Scroll to zoom</p>
    </div>
  );
};

// Export as dynamic component to disable SSR for Three.js
export default dynamic(() => Promise.resolve(ModelViewer), { ssr: false });
