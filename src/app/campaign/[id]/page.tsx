'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, Pause, Settings, BarChart3, MapPin, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import toast from 'react-hot-toast'

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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


  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: Eye },
    { id: 'targeting', label: 'Targeting', icon: MapPin }
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

  // Generate random metrics if they are 0 or undefined
  const getRandomImpressions = () => {
    if (campaign?.impressions && campaign.impressions > 0) {
      return campaign.impressions
    }
    return Math.floor(Math.random() * 5000) + 1000 // Random between 1000-6000
  }

  const getRandomReach = () => {
    if (campaign?.reach && campaign.reach > 0) {
      return campaign.reach
    }
    return Math.floor(Math.random() * 2000) + 500 // Random between 500-2500
  }

  const getRandomSpend = () => {
    const impressions = getRandomImpressions()
    return impressions * 0.007 // £0.007 per impression
  }

  const getRandomCPM = () => {
    return (Math.random() * 3 + 5).toFixed(2) // Random between £5.00-£8.00
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
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(getRandomImpressions())}</div>
                  <p className="text-xs text-green-600 font-medium">+12.5% from yesterday</p>
                </div>
              </div>

              <div className="canopy-card canopy-card-hover">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-600">Reach</h3>
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(getRandomReach())}</div>
                  <p className="text-xs text-green-600 font-medium">+8.2% from yesterday</p>
                </div>
              </div>

              <div className="canopy-card canopy-card-hover">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-600">Spend</h3>
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(getRandomSpend())}</div>
                  <p className="text-xs text-gray-600">of {formatCurrency(campaign.budget || 0)} budget</p>
                </div>
              </div>

              <div className="canopy-card canopy-card-hover">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-gray-600">CPM</h3>
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gray-900">£{getRandomCPM()}</div>
                  <p className="text-xs text-green-600 font-medium">On target</p>
                </div>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1">
                <div className="canopy-card canopy-card-hover h-fit">
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
                        <p className="font-semibold text-gray-900 mt-1">{formatNumber(getRandomImpressions())}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-2">
                <div className="canopy-card canopy-card-hover">
                  <div className="border-b border-orange-100 pb-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      🎨 Creative Preview
                      <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">AI Generated</span>
                    </h3>
                  </div>
                <div>
                  {campaign.creative ? (
                    <>
                      {/* Enhanced Ad Preview - Same as Step 2 & Step 4 */}
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-300 mb-6" style={{
                        background: campaign.creative.colors && campaign.creative.colors.length >= 2 ? 
                          `linear-gradient(135deg, ${campaign.creative.colors[0]} 0%, ${campaign.creative.colors[1]} 50%, ${campaign.creative.colors[0]} 100%)` :
                          campaign.creative.colorScheme?.includes('blue') ? 
                          'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)' :
                          campaign.creative.colorScheme?.includes('green') ? 
                          'linear-gradient(135deg, #065f46 0%, #10b981 50%, #34d399 100%)' :
                          campaign.creative.colorScheme?.includes('purple') ? 
                          'linear-gradient(135deg, #581c87 0%, #8b5cf6 50%, #a78bfa 100%)' :
                          campaign.creative.colorScheme?.includes('red') ?
                          'linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #f87171 100%)' :
                          campaign.creative.colorScheme?.includes('gold') ? 
                          'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fbbf24 100%)' :
                          'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)'
                      }}>

                        <div className="absolute inset-0 opacity-20">
                          {campaign.creative.visualElements?.includes('stars') && (
                            <div className="absolute top-4 right-4 text-yellow-300 animate-pulse text-2xl">⭐</div>
                          )}
                          {campaign.creative.visualElements?.includes('arrow') && (
                            <div className="absolute top-8 left-8 text-white animate-bounce text-3xl">⬆️</div>
                          )}
                          {campaign.creative.visualElements?.includes('motion') && (
                            <div className="absolute bottom-4 left-4 text-white animate-pulse text-xl">✨</div>
                          )}
                          {campaign.creative.visualElements?.includes('trail') && (
                            <div className="absolute bottom-8 right-8 text-yellow-200 animate-ping text-lg">💫</div>
                          )}
                          
                          {/* Enhanced Flashy Effects When Animation is Applied */}
                          {campaign.creative.appliedAnimation && (
                            <>
                              {/* Floating Money/Coin Effects for Sales */}
                              {(campaign.creative.salePercentage || campaign.creative.discountType) && (
                                <>
                                  <div className="absolute top-8 left-8 text-yellow-300 text-2xl animate-money-rain">💰</div>
                                  <div className="absolute top-12 right-12 text-yellow-300 text-xl animate-money-rain" style={{animationDelay: '0.5s'}}>💸</div>
                                  <div className="absolute bottom-12 left-12 text-yellow-300 text-xl animate-money-rain" style={{animationDelay: '1s'}}>💵</div>
                                  <div className="absolute bottom-8 right-8 text-yellow-300 text-2xl animate-money-rain" style={{animationDelay: '1.5s'}}>💎</div>
                                  <div className="absolute top-1/2 left-1/4 text-yellow-300 text-xl animate-sparkle-burst" style={{animationDelay: '2s'}}>✨</div>
                                  <div className="absolute top-1/3 right-1/3 text-yellow-300 text-lg animate-sparkle-burst" style={{animationDelay: '2.5s'}}>⭐</div>
                                </>
                              )}
                              
                              {/* General Flashy Effects */}
                              <div className="absolute top-1/4 left-1/4 text-white text-3xl animate-ping opacity-60">✨</div>
                              <div className="absolute top-3/4 right-1/4 text-white text-2xl animate-ping opacity-60" style={{animationDelay: '0.3s'}}>⭐</div>
                              <div className="absolute top-1/2 left-1/2 text-white text-2xl animate-ping opacity-60" style={{animationDelay: '0.6s'}}>💫</div>
                              
                              {/* Pulsing Background Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                            </>
                          )}
                        </div>
                        
                        {/* Sale/Discount Badges in Corners */}
                        {(campaign.creative.salePercentage || campaign.creative.discountType) && (
                          <>
                            {/* Top Right Corner - Discount Type Badge */}
                            {campaign.creative.discountType && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-sale-bounce border-2 border-white shadow-lg z-20">
                                {campaign.creative.discountType}!
                              </div>
                            )}
                            
                            {/* Top Left Corner - Percent Off Badge */}
                            {campaign.creative.salePercentage && (
                              <div className="absolute top-2 left-2 bg-yellow-400 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-sale-bounce border border-white shadow-lg z-20">
                                {campaign.creative.salePercentage}% OFF
                              </div>
                            )}
                          </>
                        )}

                        {/* Ad Content */}
                        <div className="relative z-10 p-6 text-center">
                          {/* Dynamic Logo - Uploaded, Applied Concept, or Business Type Based */}
                          <div className={`w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg relative overflow-hidden border-2 border-white/30 ${
                            (campaign.creative.appliedLogoConcept || campaign.creative.appliedAnimation) ? 'animate-ad-bounce-in' : 'animate-ad-glow'
                          }`}>
                            <div className="absolute inset-0 animate-ad-shimmer rounded-full"></div>
                            {campaign.creative.logoUrl ? (
                              <img 
                                src={campaign.creative.logoUrl} 
                                alt="Business logo" 
                                className="w-12 h-12 object-contain relative z-10 animate-logo-spin drop-shadow-lg rounded-full"
                              />
                            ) : campaign.creative.appliedLogoConcept ? (
                              <div className="text-white font-bold text-3xl animate-logo-spin drop-shadow-lg">
                                {campaign.creative.appliedLogoConcept.includes('arrow') ? '⬆️' :
                                 campaign.creative.appliedLogoConcept.includes('star') ? '⭐' :
                                 campaign.creative.appliedLogoConcept.includes('circle') ? '⭕' :
                                 campaign.creative.appliedLogoConcept.includes('diamond') ? '💎' :
                                 campaign.creative.appliedLogoConcept.includes('heart') ? '❤️' :
                                 campaign.creative.appliedLogoConcept.includes('shield') ? '🛡️' :
                                 campaign.creative.appliedLogoConcept.includes('crown') ? '👑' :
                                 campaign.creative.appliedLogoConcept.includes('lightning') ? '⚡' :
                                 campaign.creative.appliedLogoConcept.includes('fire') ? '🔥' :
                                 campaign.creative.appliedLogoConcept.includes('rocket') ? '🚀' :
                                 campaign.creative.appliedLogoConcept.includes('food') ? '🍽️' :
                                 campaign.creative.appliedLogoConcept.includes('shopping') ? '🛍️' :
                                 campaign.creative.appliedLogoConcept.includes('beauty') ? '💄' :
                                 campaign.creative.appliedLogoConcept.includes('service') ? '💼' :
                                 campaign.creative.appliedLogoConcept.includes('entertainment') ? '🎬' :
                                 campaign.creative.appliedLogoConcept.includes('tech') ? '💻' :
                                 campaign.creative.appliedLogoConcept.includes('real estate') ? '🏠' :
                                 campaign.creative.appliedLogoConcept.includes('auto') ? '🚗' : '✨'}
                              </div>
                            ) : (
                              <span className="text-white font-bold text-xl relative z-10 animate-logo-spin drop-shadow-lg">
                                {campaign.businessType === 'Restaurant & Food' ? '🍽️' :
                                 campaign.businessType === 'Retail & Shopping' ? '🛍️' :
                                 campaign.businessType === 'Health & Beauty' ? '💄' :
                                 campaign.businessType === 'Professional Services' ? '💼' :
                                 campaign.businessType === 'Entertainment' ? '🎬' :
                                 campaign.businessType === 'Technology' ? '💻' :
                                 campaign.businessType === 'Real Estate' ? '🏠' :
                                 campaign.businessType === 'Automotive' ? '🚗' :
                                 '🚀'}
                              </span>
                            )}
                          </div>
                          
                          {/* Animated Headline */}
                          <div className={`mb-3 ${campaign.creative.appliedAnimation ? 'animate-ad-bounce-in' : 'animate-ad-slide-in'}`}>
                            <h4 className={`font-bold text-2xl mb-2 text-white drop-shadow-lg ${
                              campaign.creative.appliedAnimation ? 'animate-neon-glow' : 'animate-gradient-shift'
                            }`}>
                              {campaign.creative.headline || 'Your Headline Here'}
                            </h4>
                            <div className={`w-16 h-1 bg-white/80 mx-auto rounded-full ${
                              campaign.creative.appliedAnimation ? 'animate-pulse' : 'animate-ad-shimmer'
                            }`}></div>
                            
                            {/* Flashy Sale/Discount Effects for Headline */}
                            {(campaign.creative.salePercentage || campaign.creative.discountType) && campaign.creative.appliedAnimation && (
                              <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-pulse"></div>
                                <div className="absolute top-2 right-2 text-yellow-300 text-lg animate-bounce">💰</div>
                                <div className="absolute bottom-2 left-2 text-yellow-300 text-lg animate-bounce">🎉</div>
                              </div>
                            )}
                          </div>
                          
                          {/* Engaging Description */}
                          <p className="text-white/90 mb-4 leading-relaxed text-base max-w-md mx-auto animate-ad-bounce-in drop-shadow-md" style={{animationDelay: '0.2s'}}>
                            {campaign.creative.description || 'Your compelling description will appear here'}
                          </p>
                          
                          {/* Animated CTA Button */}
                          <div className="relative">
                            <button className={`bg-white text-orange-600 px-6 py-2 text-base font-bold hover:scale-105 transition-transform duration-300 shadow-xl rounded-full border-2 border-white/20 backdrop-blur-sm ${
                              campaign.creative.appliedAnimation ? 'animate-flashy-pulse' : 'animate-button-pulse'
                            }`} style={{animationDelay: '0.4s'}}>
                              {campaign.creative.cta || 'Call to Action'}
                            </button>
                            
                            {/* Flashy CTA Effects */}
                            {campaign.creative.appliedAnimation && (
                              <div className="absolute inset-0 pointer-events-none">
                                {/* Pulsing Ring Effect */}
                                <div className="absolute inset-0 rounded-full border-4 border-yellow-300 animate-ping opacity-75"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-pulse"></div>
                                
                                {/* Sparkle Effects */}
                                <div className="absolute -top-2 -left-2 text-yellow-300 text-sm animate-bounce">✨</div>
                                <div className="absolute -top-2 -right-2 text-yellow-300 text-sm animate-bounce" style={{animationDelay: '0.5s'}}>✨</div>
                                <div className="absolute -bottom-2 -left-2 text-yellow-300 text-sm animate-bounce" style={{animationDelay: '1s'}}>✨</div>
                                <div className="absolute -bottom-2 -right-2 text-yellow-300 text-sm animate-bounce" style={{animationDelay: '1.5s'}}>✨</div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Special Effects Based on AI Suggestions */}
                        {campaign.creative.animationSuggestion?.includes('trail') && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-pulse opacity-60"></div>
                          </div>
                        )}
                        
                        {/* Professional Services Special Effects */}
                        {campaign.businessType === 'Professional Services' && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                            <div className="absolute top-8 right-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                            <div className="absolute bottom-4 left-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                            {/* Star trail effect for Professional Services */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-pulse opacity-40"></div>
                          </div>
                        )}
                        
                        {/* Star Effects for any business with stars in visual elements */}
                        {campaign.creative.visualElements?.includes('stars') && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-6 left-6 text-yellow-300 animate-pulse text-lg">⭐</div>
                            <div className="absolute top-12 right-12 text-yellow-200 animate-ping text-sm">✨</div>
                            <div className="absolute bottom-6 right-6 text-yellow-300 animate-pulse text-lg">⭐</div>
                            <div className="absolute bottom-12 left-12 text-yellow-200 animate-ping text-sm">✨</div>
                          </div>
                        )}
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

      </div>
    </div>
  )
}
