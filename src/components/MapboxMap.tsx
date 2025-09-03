'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { MapPin, Target } from 'lucide-react'
import * as turf from '@turf/turf'

interface MapboxMapProps {
  center?: [number, number]
  zoom?: number
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void
  onRadiusChange?: (radius: number) => void
  showScreens?: boolean
  targetRadius?: number
  className?: string
}

export default function MapboxMap({
  center = [-0.1276, 51.5074], // Default to London
  zoom = 12,
  onLocationSelect,
  onRadiusChange,
  showScreens = true,
  targetRadius = 2.5,
  className = ''
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [screens, setScreens] = useState<any[]>([])
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)

  useEffect(() => {
    if (map.current) return // Initialize map only once

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''
    
    // Check if we have a valid Mapbox token
    if (!mapboxToken || mapboxToken.includes('your-mapbox-token') || mapboxToken.length < 10) {
      console.warn('⚠️ Invalid or missing Mapbox token. Map will show fallback UI.')
      setIsLoaded(true) // Set loaded to true to show fallback
      return
    }

    mapboxgl.accessToken = mapboxToken

    if (!mapContainer.current) return

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom
      })
    } catch (error) {
      console.error('Failed to initialize Mapbox map:', error)
      setIsLoaded(true) // Set loaded to true to show fallback
      return
    }

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Search for a location...',
      marker: false
    })

    map.current.addControl(geocoder, 'top-left')

    // Handle geocoder result
    geocoder.on('result', (e) => {
      const { center, place_name } = e.result
      const location = {
        lat: center[1],
        lng: center[0],
        address: place_name
      }
      setSelectedLocation(location)
      onLocationSelect?.(location)
    })

    // Handle map click
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat
      const location = {
        lat,
        lng,
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      }
      setSelectedLocation(location)
      onLocationSelect?.(location)
    })

    map.current.on('load', () => {
      setIsLoaded(true)
      loadScreens()
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  const loadScreens = async () => {
    try {
      const response = await fetch('/api/screens')
      const data = await response.json()
      setScreens(data)
      addScreensToMap(data)
    } catch (error) {
      console.error('Error loading screens:', error)
    }
  }

  const addScreensToMap = (screensData: any[]) => {
    if (!map.current || !isLoaded) return

    // Add screen markers
    screensData.forEach((screen) => {
      const el = document.createElement('div')
      el.className = 'screen-marker'
      el.innerHTML = `
        <div class="w-8 h-8 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
          </svg>
        </div>
      `

      new mapboxgl.Marker(el)
        .setLngLat([screen.longitude, screen.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold text-orange-900">${screen.name}</h3>
                <p class="text-sm text-gray-600">${screen.location}</p>
                <p class="text-xs text-gray-500">${screen.resolution} • ${screen.status}</p>
              </div>
            `)
        )
        .addTo(map.current)
    })
  }

  const drawRadiusCircle = (center: [number, number], radiusKm: number) => {
    if (!map.current) return

    // Remove existing radius circle
    const existingSource = map.current.getSource('radius-circle')
    if (existingSource) {
      map.current.removeLayer('radius-fill')
      map.current.removeLayer('radius-stroke')
      map.current.removeSource('radius-circle')
    }

    // Create circle geometry
    const circle = turf.circle(center, radiusKm, { units: 'kilometers' })

    map.current.addSource('radius-circle', {
      type: 'geojson',
      data: circle
    })

    map.current.addLayer({
      id: 'radius-fill',
      type: 'fill',
      source: 'radius-circle',
      paint: {
        'fill-color': '#f97316',
        'fill-opacity': 0.1
      }
    })

    map.current.addLayer({
      id: 'radius-stroke',
      type: 'line',
      source: 'radius-circle',
      paint: {
        'line-color': '#f97316',
        'line-width': 2,
        'line-opacity': 0.8
      }
    })
  }

  useEffect(() => {
    if (selectedLocation && map.current) {
      // Move map to selected location
      map.current.flyTo({
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: 14
      })

      // Draw radius circle
      drawRadiusCircle([selectedLocation.lng, selectedLocation.lat], targetRadius)
    }
  }, [selectedLocation, targetRadius])

  // Check if we have a valid Mapbox token
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''
  const hasValidToken = mapboxToken && !mapboxToken.includes('your-mapbox-token') && mapboxToken.length > 10

  if (!hasValidToken) {
    return (
      <div className={`relative ${className}`}>
        {/* Fallback UI when no Mapbox token */}
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-dashed border-orange-300 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Interactive Map</h3>
            <p className="text-sm text-orange-700 mb-4">
              Add your Mapbox token to enable interactive mapping
            </p>
            <div className="bg-white rounded-lg p-4 mb-4 text-left">
              <p className="text-xs text-gray-600 mb-2">To enable maps:</p>
              <ol className="text-xs text-gray-600 space-y-1">
                <li>1. Get free token at <a href="https://account.mapbox.com/access-tokens/" target="_blank" className="text-orange-600 hover:underline">mapbox.com</a></li>
                <li>2. Add to .env.local: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.your-token"</li>
                <li>3. Restart the server</li>
              </ol>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <p className="text-xs text-orange-800">
                <strong>Demo Mode:</strong> You can still create campaigns without the map
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
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-2xl" />
      
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

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}


