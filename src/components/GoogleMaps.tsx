'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Target } from 'lucide-react'

interface GoogleMapsProps {
  center?: { lat: number; lng: number }
  zoom?: number
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void
  onRadiusChange?: (radius: number) => void
  showScreens?: boolean
  targetRadius?: number
  className?: string
  showCompetitors?: any[]
  showTrafficRoutes?: any[]
}

export default function GoogleMaps({
  center = { lat: 51.5074, lng: -0.1276 }, // Default to London
  zoom = 12,
  onLocationSelect,
  onRadiusChange,
  showScreens = true,
  targetRadius = 2.5,
  className = '',
  showCompetitors = [],
  showTrafficRoutes = []
}: GoogleMapsProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)

  useEffect(() => {
    // For demo purposes, we'll show a placeholder
    // In a real implementation, you would load Google Maps API
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Google Maps Placeholder - Replace with actual Google Maps implementation */}
      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Google Maps Integration</h3>
          <p className="text-sm text-blue-700 mb-4">
            Add your Google Maps API key to enable interactive mapping
          </p>
          <div className="bg-white rounded-lg p-4 mb-4 text-left">
            <p className="text-xs text-gray-600 mb-2">To enable Google Maps:</p>
            <ol className="text-xs text-gray-600 space-y-1">
              <li>1. Get free API key at <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
              <li>2. Add to .env.local: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-key"</li>
              <li>3. Restart the server</li>
            </ol>
          </div>
          <div className="bg-blue-100 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Free Tier:</strong> $200/month free credit (no card required)
            </p>
          </div>
        </div>
      </div>
      
      {/* Map overlay controls */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Target className="w-4 h-4 text-orange-500" />
          <span>Target Radius: {targetRadius}km</span>
        </div>
      </div>

      {selectedLocation && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Selected Location</p>
              <p className="text-xs text-gray-600">{selectedLocation.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Map info overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Available Screens</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Competitors</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>High Traffic</span>
          </div>
        </div>
      </div>
    </div>
  )
}
