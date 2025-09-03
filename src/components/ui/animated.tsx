'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function FadeIn({ children, className = '', delay = 0, duration = 0.6 }: AnimatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({ children, className = '', delay = 0, duration = 0.6 }: AnimatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, className = '', delay = 0, duration = 0.5 }: AnimatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HoverLift({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function PulseGlow({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(249, 115, 22, 0.4)",
          "0 0 0 10px rgba(249, 115, 22, 0)",
          "0 0 0 0 rgba(249, 115, 22, 0)"
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  className = '' 
}: { 
  value: number, 
  duration?: number, 
  className?: string 
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration, ease: "easeOut" }}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  )
}

export function FloatingElement({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedPage({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCard({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
