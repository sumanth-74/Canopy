'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, Pause, Settings, BarChart3, MapPin, Eye, Edit, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import toast from 'react-hot-toast'

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCreative, setEditedCreative] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCampaignDetails()
  }, [params.id])

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/campaigns/${params.id}`)

      if (response.ok) {
        const data = await response.json()
        setCampaign(data)
        setEditedCreative(data.creative || {})
      } else if (response.status === 404) {
        // Campaign not found - redirect to home
        router.push('/')
      } else {
        console.error('Failed to fetch campaign:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching campaign:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    if (!campaign) return

    try {
      const newStatus = campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
      const response = await fetch(`/api/campaigns/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setCampaign({ ...campaign, status: newStatus })
        toast.success(`Campaign ${newStatus.toLowerCase()} successfully!`)
      } else {
        toast.error('Failed to update campaign status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update campaign status')
    }
  }

  const handleSaveCreative = async () => {
    if (!campaign || !editedCreative) return

    try {
      const response = await fetch(`/api/campaigns/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ creative: editedCreative })
      })

      if (response.ok) {
        setCampaign({ ...campaign, creative: editedCreative })
        setIsEditing(false)
        toast.success('Creative updated successfully!')
      } else {
        toast.error('Failed to update creative')
      }
    } catch (error) {
      console.error('Error updating creative:', error)
      toast.error('Failed to update creative')
    }
  }

  const handleCancelEdit = () => {
    setEditedCreative(campaign?.creative || {})
    setIsEditing(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign not found</h2>
          <p className="text-gray-600 mb-6">The campaign you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="canopy-button-secondary hover-lift" onClick={() => router.push('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 canopy-gradient rounded-lg flex items-center justify-center hover-lift">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-2xl font-bold canopy-text-gradient">Canopy</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                campaign?.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : campaign?.status === 'PAUSED'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {campaign?.status || 'DRAFT'}
              </span>
              <Button className="canopy-button-secondary hover-lift" size="sm" onClick={handleStatusChange}>
                {campaign?.status === 'ACTIVE' ? (
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
              <Button className="canopy-button hover-lift" size="sm" onClick={() => setActiveTab('creative')}>
                <Settings className="w-4 h-4 mr-2" />
                Edit Creative
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
            {campaign.description || 'Outdoor advertising campaign'} • {campaign.targetLocation} • {campaign.targetRadius}km radius
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
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(campaign.impressions || 0)}</div>
                  <p className="text-xs text-green-600 font-medium">+12.5% from yesterday</p>
                </div>
              </div>

              <div className="canopy-card canopy-card-hover">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-600">Reach</h3>
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(campaign.reach || 0)}</div>
                  <p className="text-xs text-green-600 font-medium">+8.2% from yesterday</p>
                </div>
              </div>

              <div className="canopy-card canopy-card-hover">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-600">Spend</h3>
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency((campaign.impressions || 0) * 0.007)}</div>
                  <p className="text-xs text-gray-600">of {formatCurrency(campaign.budget || 0)} budget</p>
                </div>
              </div>

              <div className="canopy-card canopy-card-hover">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-600">CPM</h3>
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gray-900">£7.00</div>
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
                      <p className="font-semibold text-gray-900 mt-1">{campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Status:</span>
                      <p className="font-semibold text-gray-900 mt-1">{campaign.status}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Budget:</span>
                      <p className="font-semibold text-gray-900 mt-1">{formatCurrency(campaign.budget || 0)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Target Location:</span>
                      <p className="font-semibold text-gray-900 mt-1">{campaign.targetLocation}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Target Radius:</span>
                      <p className="font-semibold text-gray-900 mt-1">{campaign.targetRadius} km</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Impressions:</span>
                      <p className="font-semibold text-gray-900 mt-1">{formatNumber(campaign.impressions || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="canopy-card canopy-card-hover">
                <div className="border-b border-orange-100 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    🎨 Creative Preview
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">AI Generated</span>
                  </h3>
                </div>
                <div>
                  {campaign.creative ? (
                    <>
                      {/* Enhanced Ad Preview */}
                      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-6 mb-4 overflow-hidden relative">
                        {/* Animated background elements */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                          <div className="absolute top-4 left-4 w-8 h-8 bg-orange-500 rounded-full animate-ping"></div>
                          <div className="absolute top-8 right-8 w-6 h-6 bg-orange-400 rounded-full animate-pulse"></div>
                          <div className="absolute bottom-4 left-1/4 w-4 h-4 bg-orange-300 rounded-full animate-bounce"></div>
                        </div>

                        <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-center shadow-2xl border border-orange-200">
                          {/* Dynamic Logo Based on Business Type */}
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-ad-glow relative overflow-hidden">
                            <div className="absolute inset-0 animate-ad-shimmer rounded-2xl"></div>
                            <span className="text-white font-bold text-xl relative z-10 animate-logo-spin">
                              {campaign.creative.businessTypeEmoji ||
                               (campaign.businessType?.toLowerCase().includes('restaurant') ? '🍽️' :
                                campaign.businessType?.toLowerCase().includes('retail') ? '🛍️' :
                                campaign.businessType?.toLowerCase().includes('fitness') ? '💪' :
                                campaign.businessType?.toLowerCase().includes('tech') ? '💻' :
                                campaign.businessType?.toLowerCase().includes('health') ? '🏥' :
                                campaign.businessType?.toLowerCase().includes('education') ? '📚' :
                                campaign.businessType?.toLowerCase().includes('finance') ? '💰' :
                                campaign.businessType?.toLowerCase().includes('travel') ? '✈️' :
                                '🚀')}
                            </span>
                          </div>

                          {/* Animated Headline */}
                          <div className="mb-4 animate-ad-slide-in">
                            <h4 className="font-bold text-2xl mb-2 text-gray-900 animate-gradient-shift">
                              {campaign.creative.headline || 'Your Ad Headline'}
                            </h4>
                            <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full animate-ad-shimmer"></div>
                          </div>

                          {/* Engaging Description */}
                          <p className="text-gray-700 mb-4 text-base leading-relaxed animate-ad-bounce-in" style={{animationDelay: '0.2s'}}>
                            {campaign.creative.description || 'Your compelling ad description appears here'}
                          </p>

                          {/* Animated CTA */}
                          <button className="canopy-button px-6 py-3 font-semibold hover:scale-105 transition-transform duration-300 shadow-xl animate-button-pulse" style={{animationDelay: '0.4s'}}>
                            {campaign.creative.cta || 'Call to Action'}
                          </button>

                          {/* Special Badge */}
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                            NEW!
                          </div>
                        </div>
                      </div>

                      {/* Creative Details */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <h5 className="font-semibold text-green-900 text-sm mb-1 flex items-center">
                            🎭 Logo Concept
                          </h5>
                          <p className="text-xs text-gray-600">
                            {campaign.creative.logoConcept || 'Modern, clean design with business-specific elements'}
                          </p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <h5 className="font-semibold text-blue-900 text-sm mb-1 flex items-center">
                            🎬 Animation Style
                          </h5>
                          <p className="text-xs text-gray-600">
                            {campaign.creative.animationSuggestion || 'Smooth transitions with engaging motion'}
                          </p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <h5 className="font-semibold text-purple-900 text-sm mb-1 flex items-center">
                            🎨 Color Scheme
                          </h5>
                          <p className="text-xs text-gray-600">
                            {campaign.creative.colorScheme || 'Orange and white with complementary accents'}
                          </p>
                        </div>

                        <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                          <h5 className="font-semibold text-pink-900 text-sm mb-1 flex items-center">
                            ✨ Visual Elements
                          </h5>
                          <p className="text-xs text-gray-600">
                            {campaign.creative.visualElements || 'Professional imagery with motion graphics'}
                          </p>
                        </div>
                      </div>

                      {/* Billboard Simulation */}
                      <div className="mt-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 text-white text-center">
                        <div className="text-xs text-gray-400 mb-2">🚗 LIVE TAXI-TOP DISPLAY</div>
                        <div className="flex justify-center space-x-4 text-sm">
                          <span>📍 {campaign.targetLocation || 'Your Location'}</span>
                          <span>👁️ {Math.floor((campaign.impressions || 0) / 7)} views/day</span>
                          <span>🎯 {campaign.targetRadius}km radius</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No creative data available</p>
                      <p className="text-sm text-gray-400 mt-2">Generate creative content to see your ad preview</p>
                    </div>
                  )}
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
                      <span className="font-semibold text-gray-900">{campaign.targetLocation}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Radius:</span>
                      <span className="font-semibold text-gray-900">{campaign.targetRadius} km</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Status:</span>
                      <span className="font-semibold text-gray-900">{campaign.status}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-600 font-medium">Budget:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(campaign.budget || 0)}</span>
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
              <h3 className="text-xl font-bold text-gray-900 flex items-center justify-between">
                Creative Settings
                {!isEditing ? (
                  <Button className="canopy-button-secondary hover-lift" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Creative
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button className="canopy-button-secondary hover-lift" onClick={handleCancelEdit}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button className="canopy-button hover-lift" onClick={handleSaveCreative}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </h3>
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
                      value={isEditing ? editedCreative?.headline || '' : campaign.creative?.headline || ''}
                      onChange={(e) => setEditedCreative({...editedCreative, headline: e.target.value})}
                      className="canopy-input"
                      disabled={!isEditing}
                      placeholder="Enter your ad headline..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={isEditing ? editedCreative?.description || '' : campaign.creative?.description || ''}
                      onChange={(e) => setEditedCreative({...editedCreative, description: e.target.value})}
                      rows={3}
                      className="canopy-input"
                      disabled={!isEditing}
                      placeholder="Enter your ad description..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Call to Action
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editedCreative?.cta || '' : campaign.creative?.cta || ''}
                      onChange={(e) => setEditedCreative({...editedCreative, cta: e.target.value})}
                      className="canopy-input"
                      disabled={!isEditing}
                      placeholder="Enter call-to-action text..."
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Color Palette</h4>
                  <div className="flex space-x-2 mb-6">
                    {campaign.creative?.colors ? campaign.creative.colors.map((color: any, index: number) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-lg border-2 border-orange-200 hover-lift"
                        style={{ backgroundColor: color }}
                      />
                    )) : (
                      <div className="text-gray-500 text-sm p-3 bg-orange-50 rounded-lg">No colors available</div>
                    )}
                  </div>
                  {!isEditing && (
                    <Button className="canopy-button hover-lift w-full" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Start Editing
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
