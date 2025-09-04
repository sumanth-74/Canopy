'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'orange' | 'white' | 'outline'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg', 
  xl: 'text-xl'
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className,
  text
}: LoadingSpinnerProps) {
  const baseClasses = "animate-spin rounded-full border-2 border-solid"
  
  const variantClasses = {
    default: "border-gray-200 border-t-orange-500",
    orange: "border-orange-200 border-t-orange-600",
    white: "border-white/30 border-t-white",
    outline: "border-orange-500 border-t-transparent"
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center space-y-2">
        <div 
          className={cn(
            baseClasses,
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
        {text && (
          <p className={cn(
            "text-gray-600 font-medium animate-pulse",
            textSizes[size]
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

// Full page loading spinner
export function FullPageSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-100">
        <LoadingSpinner size="xl" variant="orange" text={text} />
      </div>
    </div>
  )
}

// Inline loading spinner for buttons
export function ButtonSpinner({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <LoadingSpinner 
      size={size} 
      variant="white" 
      className="mr-2"
    />
  )
}

// Card loading spinner
export function CardSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="bg-white rounded-xl border border-orange-100 p-8 shadow-sm">
      <LoadingSpinner size="lg" variant="orange" text={text} />
    </div>
  )
}
