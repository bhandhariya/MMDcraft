import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { asset } from '../lib/asset'

const LAYOUT = [
  { position: [0.2, 0.05, 0.25], rotation: [0.06, -0.28, 0.03], acrylic: true, mdf: false },
  { position: [-1.25, 0.18, -0.4], rotation: [0.08, 0.42, -0.05], acrylic: false, mdf: true },
  { position: [1.25, -0.12, -0.6], rotation: [-0.06, -0.5, 0.05], acrylic: true, mdf: false },
]

function prepare(map, quality) {
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = quality === 'high' ? 4 : 1
}

function Plaque({ map, position, rotation, acrylic, mdf }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1.42, 1.78, mdf ? 0.1 : 0.06]} />
        <meshStandardMaterial
          color={mdf ? '#8d6b45' : '#171c24'}
          roughness={mdf ? 0.84 : 0.5}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[1.26, 1.58]} />
        <meshStandardMaterial map={map} color="#ffffff" roughness={mdf ? 0.62 : 0.4} metalness={0.02} />
      </mesh>
      {acrylic && (
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[1.32, 1.66, 0.02]} />
          <meshPhysicalMaterial
            color="#d9fbff"
            transparent
            opacity={0.32}
            roughness={0.06}
            metalness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>
      )}
    </group>
  )
}

function Stage({ images, quality }) {
  const maps = useTexture(images.map(asset))
  const list = Array.isArray(maps) ? maps : [maps]
  list.forEach((map) => prepare(map, quality))

  const rig = useRef(null)
  const aim = useRef({ x: 0, y: 0 })
  const count = quality === 'lite' ? 1 : quality === 'medium' ? 2 : 3

  useEffect(() => {
    if (quality !== 'high') return undefined
    const onMove = (event) => {
      aim.current.x = (event.clientX / window.innerWidth - 0.5) * 0.46
      aim.current.y = (event.clientY / window.innerHeight - 0.5) * 0.2
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [quality])

  useFrame((state) => {
    const group = rig.current
    if (!group) return
    const time = state.clock.elapsedTime
    const drift = Math.sin(time * 0.28) * (quality === 'high' ? 0.08 : 0.22)
    group.rotation.y += (aim.current.x + drift - group.rotation.y) * 0.05
    group.rotation.x += (aim.current.y - group.rotation.x) * 0.05
    group.children.forEach((child, index) => {
      const base = LAYOUT[index].position[1]
      child.position.y = base + Math.sin(time * 0.85 + index) * 0.08
    })
  })

  return (
    <>
      <hemisphereLight args={['#e7fbff', '#24180f', 0.9]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3.4, 4.4, 5.2]} intensity={2.5} color="#f5fbff" />
      {quality !== 'lite' && (
        <pointLight position={[-2.5, 1.2, 2.4]} intensity={16} color="#3ef0ff" distance={16} decay={2} />
      )}
      <group ref={rig}>
        {LAYOUT.slice(0, count).map((item, index) => (
          <Plaque
            key={`${images[index % images.length]}-${index}`}
            map={list[index % list.length]}
            position={item.position}
            rotation={item.rotation}
            mdf={item.mdf || quality !== 'high'}
            acrylic={item.acrylic && quality === 'high'}
          />
        ))}
      </group>
    </>
  )
}

export default function HeroScene({ images, quality }) {
  if (!images?.length) return null
  return (
    <Canvas
      dpr={quality === 'high' ? [1, 1.5] : 1}
      camera={{ position: [0, 0, 4.4], fov: 34 }}
      gl={{
        antialias: quality === 'high',
        alpha: false,
        powerPreference: quality === 'lite' ? 'low-power' : 'high-performance',
      }}
    >
      <color attach="background" args={['#07080d']} />
      <Suspense fallback={null}>
        <Stage images={images.slice(0, 3)} quality={quality} />
      </Suspense>
    </Canvas>
  )
}
