import React from 'react'
import Image from 'next/image'

interface CanopyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text' | 'mark'
  className?: string
}

const CanopyLogo: React.FC<CanopyLogoProps> = ({ 
  size = 'md', 
  variant = 'full', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20', 
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl', 
    xl: 'text-6xl'
  }

  const iconSizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  const LogoIcon = () => (
    <div className={`${iconSizes[size]} ${className} relative group cursor-pointer logo-enhanced`}>
      <Image
        src="/canopy-logo.png"
        alt="Canopy Logo"
        width={256}
        height={256}
        className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-2"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(249, 115, 22, 0.4))'
        }}
        priority
      />
    </div>
  )

  const LogoText = () => (
    <span className={`font-bold ${textSizes[size]} ${className} group cursor-pointer`}>
      <span 
        className="canopy-text-gradient relative inline-block transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
        style={{
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          filter: 'drop-shadow(0 1px 2px rgba(249, 115, 22, 0.3))'
        }}
      >
        Canopy
        {/* 3D Text Effect */}
        <span 
          className="absolute inset-0 canopy-text-gradient opacity-30 blur-sm"
          style={{
            transform: 'translateZ(-2px)',
            zIndex: -1
          }}
        >
          Canopy
        </span>
      </span>
    </span>
  )

  const LogoMark = () => (
    <div className={`${sizeClasses[size]} ${className} relative group cursor-pointer logo-enhanced`}>
      <Image
        src="/canopy-logo.png"
        alt="Canopy Logo"
        width={256}
        height={256}
        className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(249, 115, 22, 0.4))'
        }}
        priority
      />
    </div>
  )

  if (variant === 'icon') {
    return <LogoIcon />
  }

  if (variant === 'text') {
    return <LogoText />
  }

  if (variant === 'mark') {
    return <LogoMark />
  }

  // Full logo (icon + text)
  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  )
}

export default CanopyLogo
