import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Cylinder, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Case = () => (
  <group position={[0, 0, 0]}>
    {/* Backplate (Solid) */}
    <Box args={[4, 5, 0.1]} position={[0, 0, -1]}>
      <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.5} />
    </Box>
    {/* Base */}
    <Box args={[4, 0.1, 2.1]} position={[0, -2.5, 0.05]}>
      <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
    </Box>
    {/* Top */}
    <Box args={[4, 0.1, 2.1]} position={[0, 2.5, 0.05]}>
      <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
    </Box>
    {/* Glass Side Panel */}
    <Box args={[4, 5, 0.05]} position={[0, 0, 1.1]}>
      <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} ior={1.5} thickness={0.1} />
    </Box>
    {/* Frame Edges */}
    <lineSegments>
      <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(4, 5, 2.1)]} />
      <lineBasicMaterial attach="material" color="#334155" linewidth={2} />
    </lineSegments>
  </group>
);

const Motherboard = () => (
  <group position={[0, 0, -0.9]}>
    {/* Main PCB */}
    <Box args={[3.6, 4.6, 0.1]}>
      <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.8} />
    </Box>
    {/* VRM Heatsinks */}
    <Box args={[0.5, 2, 0.2]} position={[-1.4, 1, 0.1]}>
      <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
    </Box>
    <Box args={[2, 0.5, 0.2]} position={[0, 2, 0.1]}>
      <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
    </Box>
    {/* Chipset Heatsink */}
    <Box args={[1.2, 1.2, 0.15]} position={[0.8, -1.2, 0.1]}>
      <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
    </Box>
    {/* PCIe Slots */}
    <Box args={[2.5, 0.2, 0.15]} position={[-0.4, -0.5, 0.1]}>
      <meshStandardMaterial color="#1f2937" metalness={0.6} />
    </Box>
    <Box args={[2.5, 0.2, 0.15]} position={[-0.4, -1.5, 0.1]}>
      <meshStandardMaterial color="#1f2937" metalness={0.6} />
    </Box>
  </group>
);

const Processor = () => {
  const fanRef = useRef();
  
  useFrame(() => {
    if (fanRef.current) fanRef.current.rotation.y += 0.1;
  });

  return (
    <group position={[0, 1, -0.8]}>
      {/* CPU Socket & Chip */}
      <Box args={[0.9, 0.9, 0.15]} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </Box>
      {/* CPU Cooler Tower */}
      <Box args={[1.2, 1.5, 1]} position={[0, 0, 0.6]} castShadow>
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </Box>
      {/* CPU Fan Cooler */}
      <group position={[0, 0, 1.15]}>
        <Cylinder args={[0.6, 0.6, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </Cylinder>
        {/* Spinning Fan Blades */}
        <group ref={fanRef} position={[0, 0, 0.05]}>
          <Box args={[1.1, 0.1, 0.02]} castShadow>
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
          </Box>
          <Box args={[0.1, 1.1, 0.02]} castShadow>
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.5} />
          </Box>
        </group>
      </group>
    </group>
  );
};

const RAM = () => (
  <group position={[1.2, 1, -0.7]}>
    <group position={[-0.25, 0, 0]}>
      {/* RAM Stick */}
      <Box args={[0.15, 1.4, 0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </Box>
      {/* RGB Strip */}
      <Box args={[0.16, 1.4, 0.05]} position={[0, 0, 0.2]}>
        <meshStandardMaterial color="#fb7185" emissive="#e11d48" emissiveIntensity={2} />
      </Box>
    </group>
    
    <group position={[0.25, 0, 0]}>
      {/* RAM Stick */}
      <Box args={[0.15, 1.4, 0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </Box>
      {/* RGB Strip */}
      <Box args={[0.16, 1.4, 0.05]} position={[0, 0, 0.2]}>
        <meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={2} />
      </Box>
    </group>
  </group>
);

const Storage = () => {
  const { scene } = useGLTF("/models/storage.glb");
  return (
    <group position={[0.8, -1.2, -0.75]}>
      {/* We apply a scale and adjust position since the original GLB size might differ */}
      <primitive object={scene} scale={0.5} />
    </group>
  );
};

const PowerSupply = () => (
  <group position={[-0.9, -1.8, -0.1]}>
    {/* PSU Body */}
    <Box args={[1.8, 1.2, 1.8]} position={[0, 0, 0]} castShadow>
      <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
    </Box>
    {/* PSU Fan Grill */}
    <Cylinder args={[0.5, 0.5, 1.81, 16]} rotation={[0, 0, Math.PI / 2]} position={[0, 0.6, 0]}>
      <meshStandardMaterial color="#1e293b" metalness={0.9} />
    </Cylinder>
    {/* PSU Cables Area */}
    <Box args={[0.5, 0.8, 1.5]} position={[0.9, 0, 0]}>
      <meshStandardMaterial color="#1e293b" />
    </Box>
  </group>
);

const Monitor = () => (
  <group position={[6, 0, 0]}>
    {/* Screen */}
    <Box args={[4, 2.5, 0.2]} position={[0, 0, 0]} castShadow>
      <meshStandardMaterial color="#000000" metalness={0.2} roughness={0.1} />
    </Box>
    <Box args={[1, 0.2, 1.5]} position={[0, -1.5, -0.5]}>
      <meshStandardMaterial color="#334155" metalness={0.8} />
    </Box>
    <Cylinder args={[0.1, 0.1, 1.5, 16]} position={[0, -0.75, -0.5]}>
      <meshStandardMaterial color="#64748b" metalness={1} roughness={0} />
    </Cylinder>
  </group>
);

const Pc3DModel = ({ products }) => {
  const hasCategory = (cat) => products?.some((p) => p.category === cat);

  return (
    <div className="w-full h-[500px] bg-slate-900 rounded-lg overflow-hidden shadow-inner border border-slate-700 relative">
      <Canvas camera={{ position: [0, 1, 7], fov: 50 }} shadows>
        {/* Premium Studio Lighting */}
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#38bdf8" />
        
        {/* Environment Reflections */}
        <Environment preset="city" />

        <Suspense fallback={null}>
          <group position={[-1.5, 0, 0]}>
            <Case />
            {hasCategory("motherboard") && <Motherboard />}
            {hasCategory("processor") && <Processor />}
            {hasCategory("ram") && <RAM />}
            {hasCategory("storage") && <Storage />}
            {hasCategory("supply") && <PowerSupply />}
          </group>
          {hasCategory("monitor") && <Monitor />}
        </Suspense>

        {/* Realistic Floor Shadows */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.7} scale={10} blur={2} far={4} />
        
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 2 + 0.1} />
      </Canvas>
      <div className="absolute top-2 left-2 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded opacity-75 border border-slate-600">
        ✨ Interactive Build Core Engine • Drag to rotate
      </div>
    </div>
  );
};

export default Pc3DModel;
