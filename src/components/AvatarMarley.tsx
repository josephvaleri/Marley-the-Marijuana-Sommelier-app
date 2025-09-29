'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface AvatarMarleyProps {
  state: 'idle' | 'listening' | 'thinking' | 'answering' | 'clarifying' | 'celebrating'
  className?: string
}

export default function AvatarMarley({ state, className = '' }: AvatarMarleyProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [blinkCount, setBlinkCount] = useState(0)

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setBlinkCount(prev => prev + 1)
      
      setTimeout(() => {
        setIsBlinking(false)
      }, 150) // Blink duration
    }, Math.random() * 5000 + 3000) // Random blink every 3-8 seconds

    return () => clearInterval(blinkInterval)
  }, [])

  // State-based animations
  const getStateAnimation = () => {
    switch (state) {
      case 'idle':
        return {
          rotate: [-2, 2, -2],
          transition: {
            duration: 6,
            repeat: Infinity,
            repeatType: 'mirror' as const,
            ease: 'easeInOut'
          }
        }
      case 'listening':
        return {
          scale: [1, 1.05, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: 'mirror' as const,
            ease: 'easeInOut'
          }
        }
      case 'thinking':
        return {
          rotate: [0, 5, -5, 0],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }
      case 'answering':
        return {
          scale: [1, 1.02, 1],
          transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'mirror' as const,
            ease: 'easeInOut'
          }
        }
      case 'clarifying':
        return {
          rotate: [0, 3, -3, 0],
          transition: {
            duration: 1,
            repeat: 2,
            ease: 'easeInOut'
          }
        }
      case 'celebrating':
        return {
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
          transition: {
            duration: 0.5,
            repeat: 3,
            ease: 'easeOut'
          }
        }
      default:
        return {}
    }
  }

  // State-based glow effect
  const getGlowClass = () => {
    switch (state) {
      case 'listening':
        return 'shadow-lg shadow-blue-500/50'
      case 'thinking':
        return 'shadow-lg shadow-yellow-500/50'
      case 'answering':
        return 'shadow-lg shadow-green-500/50'
      case 'celebrating':
        return 'shadow-lg shadow-purple-500/50'
      default:
        return 'shadow-lg shadow-gray-500/30'
    }
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`relative rounded-2xl overflow-hidden ${getGlowClass()}`}
        animate={getStateAnimation()}
        style={{
          width: 300,
          height: 300
        }}
      >
        <Image
          src="/marley.png"
          alt="Marley the Marijuana Sommelier"
          fill
          sizes="300px"
          className={`object-cover transition-opacity duration-150 ${
            isBlinking ? 'opacity-70' : 'opacity-100'
          }`}
          priority
        />
        
        {/* Blink overlay */}
        {isBlinking && (
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
        
        {/* State indicator ring */}
        {state !== 'idle' && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-current"
            style={{
              borderColor: state === 'listening' ? '#3b82f6' :
                          state === 'thinking' ? '#eab308' :
                          state === 'answering' ? '#22c55e' :
                          state === 'celebrating' ? '#a855f7' : '#6b7280'
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </motion.div>
      
      {/* Celebration confetti */}
      {state === 'celebrating' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: '50%',
                top: '50%'
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, -Math.random() * 100 - 50],
                opacity: [1, 0],
                scale: [1, 0]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
