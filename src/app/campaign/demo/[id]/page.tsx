'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, Pause, Settings, BarChart3, MapPin, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import CanopyLogo from '@/components/CanopyLogo'

export default function DemoCampaignDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  // Mock campaign data for demo campaigns
  const campaign = {
    id: params.id,
    name: 'Summer Sale - Central London',
    status: 'Active',
    budget: 500,
    spent: 316.62,
    impressions: 45231,
    reach: 13569,
    frequency: 3.3,
    cpm: 7.0,
    startDate: '2024-01-15',
    endDate: '2024-01-22',
    businessType: 'Retail & Shopping',
    location: 'Central London',
    targetRadius: 2,
    creative: {
      headline: 'Summer Sale - 50% Off Everything!',
      description: 'Don\'t miss out on our biggest sale of the year. Visit us today!',
      cta: 'Shop Now',
      colors: ['#f97316', '#FFFFFF', '#ea580c'],
      logoConcept: 'Modern shopping bag icon with orange gradient and clean typography',
      animationSuggestion: 'Smooth slide-in from left with pulsing discount badge and bounce effect on CTA',
      colorScheme: 'Vibrant orange and white with subtle shadow effects',
      visualElements: 'Sale tags, discount percentages, and shopping cart icons with motion graphics'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: Eye },
    { id: 'targeting', label: 'Targeting', icon: MapPin },
    { id: 'creative', label: 'Creative', icon: Settings }
  ]

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <div className="canopy-glass backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center justify-center w-8 h-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg smooth-transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-3">
                <CanopyLogo size="md" variant="full" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                campaign.status === 'Active'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                {campaign.status}
              </span>
              <Button className="canopy-button-secondary hover-lift" size="sm">
                {campaign.status === 'Active' ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              <Button className="canopy-button hover-lift" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Campaign Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.name}</h1>
          <p className="text-gray-600">
            {campaign.businessType} • {campaign.location} • {campaign.targetRadius}km radius
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="canopy-card canopy-card-hover p-2">
            <nav className="flex space-x-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-3 px-6 rounded-lg font-medium text-sm smooth-transition hover-lift ${
                    activeTab === tab.id
                      ? 'canopy-gradient text-white shadow-lg'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="canopy-card canopy-card-hover">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-600">Impressions</h3>
                  <Eye className="h-5 w-5 text-orange-500" />
                </div>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(campaign.impressions)}</div>
                  <p className="text-xs text-green-600 font-medium">+12.5% from yesterday</p>
                </div>
              </div>

              <div className="canopy-card canopy-card-hover">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-600">Reach</h3>
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(campaign.reach)}</div>
                  <p className="text-xs text-green-600 font-medium">+8.2% from yesterday</p>
                </div>
              </div>

              <div className="canopy-card canopy-card-hover">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-600">Spend</h3>
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(campaign.spent)}</div>
                  <p className="text-xs text-gray-600">of {formatCurrency(campaign.budget)} budget</p>
                </div>
              </div>

              <div className="canopy-card canopy-card-hover">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-600">CPM</h3>
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gray-900">£{campaign.cpm.toFixed(2)}</div>
                  <p className="text-xs text-green-600 font-medium">On target</p>
                </div>
              </div>
            </div>

                        {/* Campaign Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="canopy-card canopy-card-hover">
                <div className="border-b border-orange-100 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Campaign Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 font-medium">Start Date:</span>
                      <p className="font-semibold text-gray-900 mt-1">{new Date(campaign.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">End Date:</span>
                      <p className="font-semibold text-gray-900 mt-1">{new Date(campaign.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Business Type:</span>
                      <p className="font-semibold text-gray-900 mt-1">{campaign.businessType}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Target Location:</span>
                      <p className="font-semibold text-gray-900 mt-1">{campaign.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Target Radius:</span>
                      <p className="font-semibold text-gray-900 mt-1">{campaign.targetRadius} km</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Frequency:</span>
                      <p className="font-semibold text-gray-900 mt-1">{campaign.frequency}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="canopy-card canopy-card-hover">
                <div className="border-b border-orange-100 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    🎨 Creative Preview
                    <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">AI Generated</span>
                  </h3>
                </div>
                <div>
                  {/* Enhanced Ad Preview */}
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-6 mb-4 overflow-hidden relative">
                    {/* Animated background elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                      <div className="absolute top-4 left-4 w-8 h-8 bg-orange-500 rounded-full animate-ping"></div>
                      <div className="absolute top-8 right-8 w-6 h-6 bg-orange-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-4 left-1/4 w-4 h-4 bg-orange-300 rounded-full animate-bounce"></div>
                    </div>

                    <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center shadow-2xl border border-orange-200">
                      {/* Dynamic Logo */}
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-ad-glow relative overflow-hidden">
                        <div className="absolute inset-0 animate-ad-shimmer rounded-2xl"></div>
                        <span className="text-white font-bold text-xl relative z-10 animate-logo-spin">🛍️</span>
                      </div>

                      {/* Animated Headline */}
                      <div className="mb-4 animate-ad-slide-in">
                        <h4 className="font-bold text-2xl mb-2 text-gray-900 animate-gradient-shift">
                          {campaign.creative.headline}
                        </h4>
                        <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full animate-ad-shimmer"></div>
                      </div>

                      {/* Engaging Description */}
                      <p className="text-gray-700 mb-4 text-base leading-relaxed animate-ad-bounce-in" style={{animationDelay: '0.2s'}}>
                        {campaign.creative.description}
                      </p>

                      {/* Animated CTA */}
                      <button className="canopy-button px-6 py-3 font-semibold hover:scale-105 transition-transform duration-300 shadow-xl animate-button-pulse" style={{animationDelay: '0.4s'}}>
                        {campaign.creative.cta}
                      </button>

                      {/* Sale Badge */}
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                        SALE!
                      </div>
                    </div>
                  </div>

                  {/* Creative Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <h5 className="font-semibold text-orange-900 text-sm mb-1">🎭 Logo</h5>
                      <p className="text-xs text-gray-600">{campaign.creative.logoConcept}</p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <h5 className="font-semibold text-orange-900 text-sm mb-1">🎬 Animation</h5>
                      <p className="text-xs text-gray-600">{campaign.creative.animationSuggestion}</p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <h5 className="font-semibold text-orange-900 text-sm mb-1">🎨 Colors</h5>
                      <p className="text-xs text-gray-600">{campaign.creative.colorScheme}</p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <h5 className="font-semibold text-orange-900 text-sm mb-1">✨ Visuals</h5>
                      <p className="text-xs text-gray-600">{campaign.creative.visualElements}</p>
                    </div>
                  </div>

                  {/* Billboard Mockup */}
                  <div className="mt-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 text-white text-center">
                    <div className="text-xs text-gray-400 mb-2">🚗 TAXI-TOP DISPLAY</div>
                    <div className="flex justify-center space-x-4 text-sm">
                      <span>📍 London</span>
                      <span>👁️ 10k+ views/day</span>
                      <span>🎯 Targeted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard />}

        {activeTab === 'targeting' && (
          <div className="canopy-card canopy-card-hover">
            <div className="border-b border-orange-100 pb-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900">Targeting Settings</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Location Targeting</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Target Location:</span>
                      <span className="font-semibold text-gray-900">{campaign.location}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Radius:</span>
                      <span className="font-semibold text-gray-900">{campaign.targetRadius} km</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Available Screens:</span>
                      <span className="font-semibold text-gray-900">47 screens</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Targeting Map</h4>
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg h-48 flex items-center justify-center border border-orange-200">
                    <div className="text-center text-gray-700">
                      <MapPin className="w-10 h-10 mx-auto mb-3 text-orange-500" />
                      <p className="font-medium">Interactive targeting map</p>
                      <p className="text-sm text-gray-600 mt-1">Map integration coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'creative' && (
          <div className="canopy-card canopy-card-hover">
            <div className="border-b border-orange-100 pb-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900">Creative Settings</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={campaign.creative.headline}
                      className="canopy-input"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={campaign.creative.description}
                      rows={3}
                      className="canopy-input"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Call to Action
                    </label>
                    <input
                      type="text"
                      value={campaign.creative.cta}
                      className="canopy-input"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Color Palette</h4>
                  <div className="flex space-x-2 mb-6">
                    {campaign.creative.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-lg border-2 border-orange-200 hover-lift"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <Button className="canopy-button hover-lift w-full">
                    Edit Creative
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
