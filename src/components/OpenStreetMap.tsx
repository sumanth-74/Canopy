'use client'

import { useEffect, useState } from 'react'
import { MapPin, Target, Map } from 'lucide-react'

interface OpenStreetMapProps {
  center?: [number, number]
  zoom?: number
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void
  onRadiusChange?: (radius: number) => void
  showScreens?: boolean
  targetRadius?: number
  className?: string
  showCompetitors?: any[]
  showTrafficRoutes?: any[]
}

export default function OpenStreetMap({
  center = [-0.1276, 51.5074], // Default to London
  zoom = 12,
  onLocationSelect,
  onRadiusChange,
  showScreens = true,
  targetRadius = 2.5,
  className = '',
  showCompetitors = [],
  showTrafficRoutes = []
}: OpenStreetMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [screens, setScreens] = useState<any[]>([])

  // Load screens on mount
  useEffect(() => {
    const loadScreens = async () => {
      try {
        const response = await fetch('/api/screens')
        const data = await response.json()
        setScreens(data)
      } catch (error) {
        console.error('Error loading screens:', error)
      }
    }
    loadScreens()
  }, [])

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Convert click position to approximate lat/lng
    const lat = center[1] + (0.5 - y / rect.height) * 0.02
    const lng = center[0] + (x / rect.width - 0.5) * 0.02
    
    const location = {
      lat,
      lng,
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
    
    setSelectedLocation(location)
    onLocationSelect?.(location)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Simple Map Container */}
      <div 
        className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-100 to-green-100 border-2 border-gray-200 cursor-crosshair relative overflow-hidden"
        onClick={handleMapClick}
      >
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(90deg, #e5e7eb 1px, transparent 1px),
              linear-gradient(180deg, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Map Title */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <Map className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Interactive Map</span>
          </div>
        </div>

        {/* Selected Location Marker */}
        {selectedLocation && (
          <div 
            className="absolute w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg transform -translate-x-2 -translate-y-2"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              Selected
            </div>
          </div>
        )}

        {/* Target Radius Circle */}
        {selectedLocation && (
          <div 
            className="absolute border-2 border-orange-500 rounded-full opacity-30"
            style={{
              left: '50%',
              top: '50%',
              width: `${targetRadius * 20}px`,
              height: `${targetRadius * 20}px`,
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)'
            }}
          />
        )}

        {/* Screen Markers */}
        {showScreens && screens.map((screen, index) => (
          <div
            key={screen.id}
            className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white shadow-sm cursor-pointer hover:scale-125 transition-transform"
            style={{
              left: `${20 + (index * 15) % 60}%`,
              top: `${30 + (index * 20) % 40}%`
            }}
            title={`${screen.name} - ${screen.location}`}
          />
        ))}

        {/* Competitor Markers */}
        {showCompetitors && showCompetitors.map((competitor, index) => (
          <div
            key={`comp-${index}`}
            className="absolute w-2 h-2 bg-red-500 rounded-full border border-white shadow-sm cursor-pointer hover:scale-125 transition-transform"
            style={{
              left: `${25 + (index * 12) % 50}%`,
              top: `${35 + (index * 15) % 35}%`
            }}
            title={`${competitor.name} - Competitor`}
          />
        ))}

        {/* Traffic Route Markers */}
        {showTrafficRoutes && showTrafficRoutes.map((route, index) => (
          <div
            key={`traffic-${index}`}
            className="absolute w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm cursor-pointer hover:scale-125 transition-transform"
            style={{
              left: `${30 + (index * 18) % 45}%`,
              top: `${40 + (index * 12) % 30}%`
            }}
            title={`${route.name} - High Traffic`}
          />
        ))}

        {/* Click Instruction */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <p className="text-xs text-gray-600">Click anywhere on the map to select location</p>
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs z-10">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Selected Location</p>
              <p className="text-xs text-gray-600">{selectedLocation.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Map overlay controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Target className="w-4 h-4 text-orange-500" />
          <span>Target Radius: {targetRadius}km</span>
        </div>
      </div>

      {/* Map info overlay */}
      <div className="absolute top-16 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
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
