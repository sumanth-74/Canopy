'use client'

import { useState } from 'react'
import { MapPin, Globe, Map } from 'lucide-react'
import OpenStreetMap from './OpenStreetMap'
import GoogleMaps from './GoogleMaps'

interface MapProviderProps {
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

export default function MapProvider({
  center = [-0.1276, 51.5074],
  zoom = 12,
  onLocationSelect,
  onRadiusChange,
  showScreens = true,
  targetRadius = 2.5,
  className = '',
  showCompetitors = [],
  showTrafficRoutes = []
}: MapProviderProps) {
  const [mapProvider, setMapProvider] = useState<'openstreetmap' | 'googlemaps'>('openstreetmap')

  const mapProviders = [
    {
      id: 'openstreetmap',
      name: 'OpenStreetMap',
      description: 'Free, open-source maps',
      icon: Globe,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'googlemaps',
      name: 'Google Maps',
      description: 'Professional quality maps',
      icon: Map,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ]

  return (
    <div className={className}>
      {/* Map Provider Selector */}
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-semibold text-gray-700">Map Provider:</span>
          <div className="flex space-x-2">
            {mapProviders.map((provider) => {
              const Icon = provider.icon
              const isSelected = mapProvider === provider.id
              return (
                <button
                  key={provider.id}
                  onClick={() => setMapProvider(provider.id as 'openstreetmap' | 'googlemaps')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                    isSelected
                      ? `${provider.bgColor} ${provider.borderColor} border-2 ${provider.color}`
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{provider.name}</span>
                </button>
              )
            })}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {mapProviders.find(p => p.id === mapProvider)?.description}
        </p>
      </div>

      {/* Map Component */}
      {mapProvider === 'openstreetmap' ? (
        <OpenStreetMap
          center={center}
          zoom={zoom}
          onLocationSelect={onLocationSelect}
          onRadiusChange={onRadiusChange}
          showScreens={showScreens}
          targetRadius={targetRadius}
          className="h-full"
          showCompetitors={showCompetitors}
          showTrafficRoutes={showTrafficRoutes}
        />
      ) : (
        <GoogleMaps
          center={{ lat: center[1], lng: center[0] }}
          zoom={zoom}
          onLocationSelect={onLocationSelect}
          onRadiusChange={onRadiusChange}
          showScreens={showScreens}
          targetRadius={targetRadius}
          className="h-full"
          showCompetitors={showCompetitors}
          showTrafficRoutes={showTrafficRoutes}
        />
      )}
    </div>
  )
}
