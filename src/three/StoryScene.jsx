import { Suspense, useLayoutEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { asset } from '../lib/asset'

function Stack({ image, progressRef, quality }) {
  const map = useTexture(asset(image))
  const spin = useRef(null)
  const core = useRef(null)
  const print = useRef(null)
  const face = useRef(null)
  const glow = useRef(null)

  useLayoutEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace
  }, [map])

  useFrame(() => {
    const progress = Math.min(Math.max(progressRef.current || 0, 0), 1)
    const spread = Math.sin(progress * Math.PI)
    if (core.current) core.current.position.z = -0.12 - spread * 0.9
    if (print.current) print.current.position.z = spread * 0.02
    if (face.current) face.current.position.z = 0.12 + spread * 0.95
    if (spin.current) {
      spin.current.rotation.y = progress * 1.2
      spin.current.rotation.x = spread * 0.2
    }
    if (glow.current) {
      glow.current.intensity = 8 + spread * 14
      glow.current.position.x = -2.2 + progress * 4
    }
  })

  const rich = quality === 'high'

  return (
    <>
      <hemisphereLight args={['#e9fcff', '#2a1c12', 0.85]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[2.4, 3.2, 4]} intensity={2.2} />
      <pointLight ref={glow} position={[-2.2, 0.8, 2.2]} intensity={8} color="#3ef0ff" distance={14} decay={2} />
      <group ref={spin}>
        <mesh ref={core} position={[0, 0, -0.12]}>
          <boxGeometry args={[2.2, 1.48, 0.14]} />
          <meshStandardMaterial color="#8d6a42" roughness={0.86} metalness={0.04} />
        </mesh>
        <mesh ref={print}>
          <planeGeometry args={[1.98, 1.28]} />
          <meshStandardMaterial map={map} color="#ffffff" roughness={0.46} />
        </mesh>
        <mesh ref={face} position={[0, 0, 0.12]}>
          <boxGeometry args={[2.08, 1.36, 0.025]} />
          {rich ? (
            <meshPhysicalMaterial
              color="#defbff"
              transparent
              opacity={0.3}
              roughness={0.05}
              metalness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          ) : (
            <meshStandardMaterial color="#b7f6ff" transparent opacity={0.28} roughness={0.12} metalness={0.08} />
          )}
        </mesh>
      </group>
    </>
  )
}

export default function StoryScene({ image, progressRef, quality }) {
  if (!image) return null
  return (
    <Canvas
      dpr={quality === 'high' ? [1, 1.4] : 1}
      camera={{ position: [0, 0, 4.3], fov: 32 }}
      gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <Stack image={image} progressRef={progressRef} quality={quality} />
      </Suspense>
    </Canvas>
  )
}
