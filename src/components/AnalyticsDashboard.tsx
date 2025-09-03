'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Eye, Users, MapPin, Clock, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface AnalyticsData {
  impressions: number
  reach: number
  frequency: number
  cpm: number
  spend: number
  demographics: {
    age: { [key: string]: number }
    gender: { [key: string]: number }
  }
  locations: Array<{
    name: string
    impressions: number
    spend: number
  }>
  hourlyData: Array<{
    hour: number
    impressions: number
  }>
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({
    impressions: 0,
    reach: 0,
    frequency: 0,
    cpm: 7.0,
    spend: 0,
    demographics: {
      age: { '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0 },
      gender: { 'Male': 0, 'Female': 0, 'Other': 0 }
    },
    locations: [],
    hourlyData: []
  })

  const [isLive, setIsLive] = useState(true)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        setData(prev => ({
          ...prev,
          impressions: prev.impressions + Math.floor(Math.random() * 50) + 10,
          reach: Math.floor(prev.impressions * 0.3),
          frequency: Math.round((prev.impressions / Math.max(prev.reach, 1)) * 10) / 10,
          spend: prev.impressions * 0.007,
          demographics: {
            age: {
              '18-24': Math.floor(Math.random() * 1000) + 500,
              '25-34': Math.floor(Math.random() * 1500) + 800,
              '35-44': Math.floor(Math.random() * 1200) + 600,
              '45-54': Math.floor(Math.random() * 800) + 400,
              '55+': Math.floor(Math.random() * 600) + 300
            },
            gender: {
              'Male': Math.floor(Math.random() * 2000) + 1000,
              'Female': Math.floor(Math.random() * 1800) + 900,
              'Other': Math.floor(Math.random() * 200) + 100
            }
          },
          locations: [
            { name: 'Oxford Street', impressions: Math.floor(Math.random() * 500) + 200, spend: 0 },
            { name: 'Covent Garden', impressions: Math.floor(Math.random() * 400) + 150, spend: 0 },
            { name: 'Camden Market', impressions: Math.floor(Math.random() * 300) + 100, spend: 0 },
            { name: 'Shoreditch', impressions: Math.floor(Math.random() * 350) + 120, spend: 0 }
          ].map(loc => ({ ...loc, spend: loc.impressions * 0.007 })),
          hourlyData: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            impressions: Math.floor(Math.random() * 200) + 50
          }))
        }))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-GB').format(num)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Analytics</h2>
          <p className="text-gray-600">Real-time performance insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isLive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isLive ? 'Live' : 'Paused'}</span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.impressions)}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.reach)}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frequency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.frequency}</div>
            <p className="text-xs text-blue-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Optimal range
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.spend)}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              £{data.cpm.toFixed(2)} CPM
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Age Groups</h4>
                <div className="space-y-2">
                  {Object.entries(data.demographics.age).map(([age, count]) => (
                    <div key={age} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{age}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...Object.values(data.demographics.age))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Gender</h4>
                <div className="space-y-2">
                  {Object.entries(data.demographics.gender).map(([gender, count]) => (
                    <div key={gender} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{gender}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...Object.values(data.demographics.gender))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Location Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.locations.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{location.name}</p>
                      <p className="text-sm text-gray-600">{formatNumber(location.impressions)} impressions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(location.spend)}</p>
                    <p className="text-sm text-gray-600">£{data.cpm.toFixed(2)} CPM</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Performance (Last 24 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end space-x-1">
            {data.hourlyData.map((hour, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-600 rounded-t"
                  style={{ height: `${(hour.impressions / Math.max(...data.hourlyData.map(h => h.impressions))) * 200}px` }}
                />
                <span className="text-xs text-gray-500 mt-2">{hour.hour}:00</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Live Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">47</div>
              <div className="text-sm text-green-800">Active Screens</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-blue-800">Current Locations</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3.2s</div>
              <div className="text-sm text-purple-800">Avg. Display Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
