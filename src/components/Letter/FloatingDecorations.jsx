import Lottie from 'lottie-react'
import { motion } from 'framer-motion'

// Inline sparkle animation data - lightweight version
const sparkleAnimation = {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    nm: "Sparkle",
    ddd: 0,
    assets: [],
    layers: [{
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Star",
        sr: 1,
        ks: {
            o: { a: 1, k: [{ t: 0, s: [0] }, { t: 15, s: [100] }, { t: 45, s: [100] }, { t: 60, s: [0] }] },
            r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [180] }] },
            s: { a: 1, k: [{ t: 0, s: [0, 0] }, { t: 15, s: [100, 100] }, { t: 45, s: [100, 100] }, { t: 60, s: [0, 0] }] },
            p: { a: 0, k: [50, 50] }
        },
        shapes: [{
            ty: "sr",
            sy: 1,
            d: 1,
            pt: { a: 0, k: 4 },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 0 },
            ir: { a: 0, k: 5 },
            is: { a: 0, k: 0 },
            or: { a: 0, k: 20 },
            os: { a: 0, k: 0 }
        }, {
            ty: "fl",
            c: { a: 0, k: [1, 0.85, 0.4, 1] },
            o: { a: 0, k: 100 }
        }]
    }]
}

// Hearts animation for romantic pages
const heartsAnimation = {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 90,
    w: 100,
    h: 100,
    nm: "Heart",
    ddd: 0,
    assets: [],
    layers: [{
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Heart",
        sr: 1,
        ks: {
            o: { a: 1, k: [{ t: 0, s: [0] }, { t: 20, s: [80] }, { t: 70, s: [80] }, { t: 90, s: [0] }] },
            s: { a: 1, k: [{ t: 0, s: [80, 80] }, { t: 45, s: [100, 100] }, { t: 90, s: [80, 80] }] },
            p: { a: 1, k: [{ t: 0, s: [50, 60] }, { t: 90, s: [50, 40] }] }
        },
        shapes: [{
            ty: "gr",
            it: [{
                ty: "sh",
                ks: {
                    a: 0,
                    k: {
                        c: true,
                        v: [[0, 10], [-15, -5], [0, -15], [15, -5], [0, 10]],
                        i: [[0, 0], [-10, 0], [0, -10], [10, 0], [0, 0]],
                        o: [[0, 0], [0, 10], [10, 0], [0, -10], [0, 0]]
                    }
                }
            }, {
                ty: "fl",
                c: { a: 0, k: [0.9, 0.3, 0.4, 1] },
                o: { a: 0, k: 100 }
            }, {
                ty: "tr",
                p: { a: 0, k: [0, 0] }
            }],
            nm: "Heart"
        }]
    }]
}

export default function FloatingDecorations({ type = 'sparkle', count = 3, accentColor }) {
    const animations = {
        sparkle: sparkleAnimation,
        hearts: heartsAnimation,
    }

    const positions = [
        { top: '10%', left: '5%', delay: 0 },
        { top: '20%', right: '8%', delay: 0.5 },
        { bottom: '15%', left: '10%', delay: 1 },
        { bottom: '25%', right: '5%', delay: 1.5 },
        { top: '50%', left: '3%', delay: 2 },
    ]

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {positions.slice(0, count).map((pos, index) => (
                <motion.div
                    key={index}
                    className="absolute w-12 h-12 opacity-40"
                    style={pos}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 0.4, 0.4, 0],
                        scale: [0.5, 1, 1, 0.5],
                    }}
                    transition={{
                        duration: 4,
                        delay: pos.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Lottie
                        animationData={animations[type] || sparkleAnimation}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </motion.div>
            ))}
        </div>
    )
}

// Floating particles component for ambient effect
export function FloatingParticles({ accentColor = '#D4AF37', count = 8 }) {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${accentColor}40, transparent)`,
                        left: `${10 + (i * 12)}%`,
                        top: `${20 + (i * 8) % 60}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 10, 0],
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4 + i * 0.5,
                        delay: i * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    )
}
