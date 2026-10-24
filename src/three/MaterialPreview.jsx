import { Suspense, useLayoutEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { asset } from '../lib/asset'

function Spin({ children }) {
  const ref = useRef(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4
  })
  return <group ref={ref}>{children}</group>
}

function PrintedFace({ image, width, height }) {
  const map = useTexture(asset(image))
  useLayoutEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace
  }, [map])
  return (
    <mesh position={[0, 0, 0.004]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  )
}

function SlabView({ image, material, thickness, widthMm, heightMm }) {
  const ratio = widthMm / Math.max(heightMm, 1)
  const aspect = Math.min(1.65, Math.max(0.58, ratio))
  const width = 1.55 * aspect
  const height = 1.55
  const depth = Math.min(0.42, Math.max(0.045, Number(thickness) / 26))
  const acrylic = material === 'acrylic'
  const mdf = material === 'mdf'
  const edge = acrylic ? '#d7fbff' : mdf ? '#8d6a42' : '#d7d2c8'

  return (
    <Spin>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={edge}
          transparent={acrylic}
          opacity={acrylic ? 0.48 : 1}
          roughness={acrylic ? 0.08 : mdf ? 0.86 : 0.42}
          metalness={acrylic ? 0.16 : 0.04}
        />
      </mesh>
      {image ? (
        <group position={[0, 0, depth / 2]}>
          <PrintedFace image={image} width={width * 0.9} height={height * 0.9} />
        </group>
      ) : null}
    </Spin>
  )
}

export default function MaterialPreview({ image, material, thickness, widthMm, heightMm }) {
  return (
    <Canvas
      dpr={1}
      camera={{ position: [0, 0, 3.5], fov: 35 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      <hemisphereLight args={['#f4fbff', '#2a2118', 1]} />
      <directionalLight position={[2, 3, 4]} intensity={2} />
      <pointLight position={[-2, 1, 2]} intensity={8} color="#3ef0ff" distance={10} decay={2} />
      <Suspense fallback={null}>
        <SlabView
          image={image}
          material={material}
          thickness={thickness}
          widthMm={widthMm}
          heightMm={heightMm}
        />
      </Suspense>
    </Canvas>
  )
}
