import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox, useTexture } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

// Safe Stamp component that doesn't crash on 404s
function Stamp({ image, color, opacity }) {
    const [texture, setTexture] = useState(null)

    // Load texture safely without Suspense to prevent crashes on missing files
    useEffect(() => {
        if (!image) {
            setTexture(null)
            return
        }

        const loader = new THREE.TextureLoader()
        loader.load(
            image,
            (loadedTexture) => {
                loadedTexture.colorSpace = THREE.SRGBColorSpace // Updated for newer Three.js
                setTexture(loadedTexture)
            },
            undefined, // onProgress
            (err) => {
                console.warn(`Failed to load stamp image: ${image}`, err)
                setTexture(null) // Fallback to color
            }
        )
    }, [image])

    return (
        <group position={[0.85, 0.45, 0.05]}>
            {/* Stamp border/background */}
            <mesh position={[0, 0, -0.005]}>
                <planeGeometry args={[0.42, 0.42]} />
                <meshBasicMaterial
                    color="#FFFFFF"
                    transparent
                    opacity={opacity * 0.9}
                />
            </mesh>

            {/* Stamp Image or Fallback Color */}
            <mesh>
                <planeGeometry args={[0.38, 0.38]} />
                {texture ? (
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        opacity={opacity}
                    />
                ) : (
                    <meshStandardMaterial
                        color={color}
                        roughness={0.5}
                        transparent
                        opacity={opacity}
                    />
                )}
            </mesh>
        </group>
    )
}

const AnimatedGroup = animated.group

export default function Envelope({ envelope, offset, isActive, onClick }) {
    const groupRef = useRef()
    const [hovered, setHovered] = useState(false)

    // Calculate visual properties based on position in stack
    const depth = Math.abs(offset) * 0.15
    const opacity = Math.max(0.3, 1 - Math.abs(offset) * 0.25)
    const scale = Math.max(0.7, 1 - Math.abs(offset) * 0.1)

    // Spring animation for hover and position
    const { positionY, positionZ, rotationY, scaleVal } = useSpring({
        positionY: isActive && hovered ? 0.15 : 0,
        positionZ: -depth,
        rotationY: offset * 0.08,
        scaleVal: scale * (isActive && hovered ? 1.05 : 1),
        config: { mass: 1, tension: 280, friction: 40 }
    })

    // Subtle floating animation for active envelope
    useFrame((state) => {
        if (groupRef.current && isActive) {
            groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.0005
        }
    })

    // Parse envelope color
    const envelopeColor = envelope.envelope?.color || '#FFE5D9'
    const stampColor = envelope.envelope?.stamp?.fallbackColor || '#FF6B6B'

    return (
        <AnimatedGroup
            ref={groupRef}
            position-x={offset * 2.5}
            position-y={positionY}
            position-z={positionZ}
            rotation-y={rotationY}
            scale={scaleVal}
            onClick={onClick}
            onPointerEnter={() => {
                setHovered(true)
                if (isActive) document.body.style.cursor = 'pointer'
            }}
            onPointerLeave={() => {
                setHovered(false)
                document.body.style.cursor = 'default'
            }}
        >
            {/* Envelope Body */}
            <RoundedBox
                args={[2.4, 1.5, 0.08]}
                radius={0.02}
                smoothness={4}
            >
                <meshStandardMaterial
                    color={envelopeColor}
                    roughness={0.7}
                    metalness={0.05}
                    transparent
                    opacity={opacity}
                />
            </RoundedBox>

            {/* Envelope Flap (triangle at top) */}
            <mesh position={[0, 0.75, 0.041]} rotation={[0, 0, Math.PI]}>
                <coneGeometry args={[1.15, 0.6, 3]} />
                <meshStandardMaterial
                    color={envelopeColor}
                    roughness={0.7}
                    metalness={0.05}
                    transparent
                    opacity={opacity}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Initials Text */}
            <Text
                position={[0, -0.1, 0.05]}
                fontSize={0.35}
                color="#333333"
                anchorX="center"
                anchorY="middle"
            >
                {envelope.initials}
            </Text>

            {/* Stamp */}
            <Stamp
                image={envelope.envelope?.stamp?.image}
                color={stampColor}
                opacity={opacity}
            />

            {/* Subtle glow effect for active envelope */}
            {isActive && (
                <mesh position={[0, 0, -0.05]}>
                    <planeGeometry args={[2.6, 1.7]} />
                    <meshBasicMaterial
                        color="#D4AF37"
                        transparent
                        opacity={hovered ? 0.15 : 0.05}
                    />
                </mesh>
            )}

            {/* Bottom decorative line */}
            <mesh position={[0, -0.6, 0.042]}>
                <planeGeometry args={[1.8, 0.01]} />
                <meshBasicMaterial
                    color={stampColor}
                    transparent
                    opacity={opacity * 0.3}
                />
            </mesh>
        </AnimatedGroup>
    )
}
