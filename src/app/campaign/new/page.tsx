'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, MapPin, Target, Zap, CreditCard, Check } from 'lucide-react'
import { formatCurrency, calculateImpressions } from '@/lib/utils'
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/animated'
import MapboxMap from '@/components/MapboxMap'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function NewCampaignPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [campaignData, setCampaignData] = useState({
    name: '',
    budget: 100,
    businessType: '',
    location: '',
    targetRadius: 1,
    creative: {
      headline: '',
      description: '',
      cta: '',
      colors: ['#3B82F6', '#FFFFFF'],
      logo: null as File | null
    }
  })
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)

  // Redirect if not authenticated
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const steps = [
    { id: 1, title: 'Campaign Setup', description: 'Budget & Business Info' },
    { id: 2, title: 'AI Ad Creation', description: 'Design Your Ad' },
    { id: 3, title: 'Targeting', description: 'Choose Locations' },
    { id: 4, title: 'Review', description: 'Final Check' },
    { id: 5, title: 'Payment', description: 'Launch Campaign' }
  ]

  const businessTypes = [
    'Restaurant & Food',
    'Retail & Shopping',
    'Health & Beauty',
    'Professional Services',
    'Entertainment',
    'Technology',
    'Real Estate',
    'Automotive',
    'Other'
  ]

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      // Handle campaign launch
      await launchCampaign()
    }
  }

  const launchCampaign = async () => {
    setIsLoading(true)
    try {
      // Create campaign
      const campaignResponse = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: campaignData.name,
          description: `${campaignData.businessType} campaign`,
          budget: campaignData.budget,
          targetLocation: selectedLocation?.address || campaignData.location,
          targetRadius: campaignData.targetRadius,
          creative: campaignData.creative,
          targetAudience: {
            ageRange: '25-45',
            interests: [campaignData.businessType.toLowerCase()],
            timeOfDay: 'all'
          }
        }),
      })

      if (!campaignResponse.ok) {
        throw new Error('Failed to create campaign')
      }

      const campaign = await campaignResponse.json()

      // Create payment intent
      const paymentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: campaign.id,
          amount: campaignData.budget * 1.02, // Include 2% platform fee
          currency: 'GBP'
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await paymentResponse.json()

      // In a real implementation, you would integrate with Stripe Elements here
      // For demo purposes, we'll simulate a successful payment

      // Set flag to refresh dashboard
      localStorage.setItem('canopy-refresh-dashboard', 'true')

      toast.success('Campaign created successfully!')
      router.push('/')
    } catch (error) {
      console.error('Error launching campaign:', error)
      toast.error('Failed to launch campaign. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const estimatedImpressions = calculateImpressions(campaignData.budget)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <div className="canopy-glass backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <FadeIn delay={0.2}>
              <div className="flex items-center space-x-6">
                <button className="flex items-center text-orange-600 hover:text-orange-700 smooth-transition">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 canopy-gradient rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-2xl font-bold canopy-text-gradient">Canopy</span>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="text-sm text-orange-600 font-semibold bg-orange-50 px-4 py-2 rounded-full">
                Step {currentStep} of 5
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <FadeIn delay={0.6}>
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 smooth-transition ${
                    currentStep >= step.id 
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg' 
                      : 'border-orange-200 text-orange-400 bg-white'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <span className="text-sm font-bold">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-4 hidden sm:block">
                    <p className={`text-sm font-semibold ${
                      currentStep >= step.id ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-20 h-1 mx-6 rounded-full ${
                      currentStep > step.id ? 'bg-orange-500' : 'bg-orange-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Step Content */}
        <FadeIn delay={0.8}>
          <div className="canopy-card p-10">
                                {currentStep === 1 && <CampaignSetupStep data={campaignData} setData={setCampaignData} />}
                    {currentStep === 2 && <AICreationStep data={campaignData} setData={setCampaignData} />}
                    {currentStep === 3 && <TargetingStep data={campaignData} setData={setCampaignData} onLocationSelect={setSelectedLocation} />}
                    {currentStep === 4 && <ReviewStep data={campaignData} estimatedImpressions={estimatedImpressions} />}
                    {currentStep === 5 && <PaymentStep data={campaignData} estimatedImpressions={estimatedImpressions} />}
          </div>
        </FadeIn>

        {/* Navigation */}
        <FadeIn delay={1.0}>
          <div className="flex justify-between mt-12">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center px-8 py-4 canopy-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </button>
            
            <div className="flex items-center space-x-6">
              {currentStep < 5 && (
                <div className="text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
                  Estimated impressions: <span className="font-bold">{estimatedImpressions.toLocaleString()}</span>
                </div>
              )}
              <button
                onClick={handleNext}
                className="flex items-center px-8 py-4 canopy-button"
              >
                {currentStep === 5 ? 'Launch Campaign' : 'Next'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

function CampaignSetupStep({ data, setData }: { data: any, setData: any }) {
  return (
    <StaggerContainer className="space-y-8">
      <StaggerItem>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Campaign Setup</h2>
          <p className="text-xl text-gray-600">Let's start by setting up your campaign basics</p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
              Campaign Name
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({...data, name: e.target.value})}
              placeholder="e.g., Summer Sale - Central London"
              className="canopy-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
              Business Type
            </label>
            <select
              value={data.businessType}
              onChange={(e) => setData({...data, businessType: e.target.value})}
              className="canopy-input"
            >
              <option value="">Select business type</option>
              {['Restaurant & Food', 'Retail & Shopping', 'Health & Beauty', 'Professional Services', 'Entertainment', 'Technology', 'Real Estate', 'Automotive', 'Other'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div>
          <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
            Budget (£)
          </label>
          <div className="relative">
            <input
              type="number"
              value={data.budget}
              onChange={(e) => setData({...data, budget: Number(e.target.value)})}
              min="50"
              max="10000"
              className="canopy-input pr-12"
            />
            <div className="absolute right-4 top-3 text-orange-500 font-semibold">£</div>
          </div>
          <p className="text-sm text-orange-600 mt-2 font-medium">
            Minimum £50. CPM: £7.00
          </p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
          <h3 className="font-bold text-orange-900 mb-4 text-xl">Campaign Estimate</h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-orange-700 font-semibold">Estimated Impressions:</span>
              <span className="font-bold ml-2 text-orange-900">{calculateImpressions(data.budget).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-orange-700 font-semibold">Estimated Reach:</span>
              <span className="font-bold ml-2 text-orange-900">{Math.round(calculateImpressions(data.budget) * 0.3).toLocaleString()} people</span>
            </div>
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}

function AICreationStep({ data, setData }: { data: any, setData: any }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateWithAI = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-creative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Create compelling ad copy for ${data.businessType} business. Focus on outdoor advertising for taxi-top screens.`,
          businessType: data.businessType
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate creative')
      }

      const creative = await response.json()
      setData({
        ...data,
        creative: {
          ...data.creative,
          headline: creative.headline,
          description: creative.description,
          cta: creative.cta
        }
      })
    } catch (error) {
      console.error('Error generating creative:', error)
      // Fallback to default content
      setData({
        ...data,
        creative: {
          ...data.creative,
          headline: `${data.businessType} Special Offer`,
          description: 'Visit us today for amazing deals and great service!',
          cta: 'Visit Now'
        }
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <StaggerContainer className="space-y-8">
      <StaggerItem>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Ad Creation</h2>
          <p className="text-xl text-gray-600">Let AI help you create compelling ad content</p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
                Headline
              </label>
              <input
                type="text"
                value={data.creative.headline}
                onChange={(e) => setData({...data, creative: {...data.creative, headline: e.target.value}})}
                placeholder="Enter your headline"
                className="canopy-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={data.creative.description}
                onChange={(e) => setData({...data, creative: {...data.creative, description: e.target.value}})}
                placeholder="Describe your offer or business"
                rows={4}
                className="canopy-input resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
                Call to Action
              </label>
              <select
                value={data.creative.cta}
                onChange={(e) => setData({...data, creative: {...data.creative, cta: e.target.value}})}
                className="canopy-input"
              >
                <option value="">Select CTA</option>
                <option value="Visit Now">Visit Now</option>
                <option value="Call Today">Call Today</option>
                <option value="Book Online">Book Online</option>
                <option value="Learn More">Learn More</option>
                <option value="Get Quote">Get Quote</option>
              </select>
            </div>

            <HoverLift>
              <button
                onClick={generateWithAI}
                disabled={isGenerating}
                className="w-full canopy-button py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-3" />
                  {isGenerating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Generating with AI...
                    </div>
                  ) : (
                    'Generate with AI'
                  )}
                </div>
              </button>
            </HoverLift>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
            <h3 className="font-bold text-orange-900 mb-6 text-xl">Live Preview</h3>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-2xl">L</span>
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-900">
                  {data.creative.headline || 'Your Headline'}
                </h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {data.creative.description || 'Your description will appear here'}
                </p>
                <button className="canopy-button px-8 py-3">
                  {data.creative.cta || 'Call to Action'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}

function TargetingStep({ data, setData, onLocationSelect }: { data: any, setData: any, onLocationSelect?: (location: any) => void }) {
  return (
    <StaggerContainer className="space-y-8">
      <StaggerItem>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Campaign Planning</h2>
          <p className="text-xl text-gray-600">Our AI recommends the best targeting options for your campaign</p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
                Target Location
              </label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => setData({...data, location: e.target.value})}
                placeholder="e.g., Central London, Oxford Street"
                className="canopy-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-4 uppercase tracking-wide">
                Target Radius (km)
              </label>
              <div className="bg-white rounded-2xl p-6 border border-orange-200">
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={data.targetRadius}
                  onChange={(e) => setData({...data, targetRadius: Number(e.target.value)})}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-orange-600 mt-4 font-medium">
                  <span>0.5 km</span>
                  <span className="font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">{data.targetRadius} km</span>
                  <span>5 km</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-4 flex items-center text-lg">
                <Target className="w-5 h-5 mr-3" />
                AI Recommendations
              </h3>
              <ul className="text-orange-800 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  Target high-footfall areas within 1km radius
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  Focus on commuter routes during peak hours
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  Consider competitor locations for conquesting
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  Optimize for weekend traffic patterns
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
            <h3 className="font-bold text-orange-900 mb-6 text-xl">Targeting Map</h3>
            <div className="h-80 rounded-2xl overflow-hidden">
              <MapboxMap
                targetRadius={data.targetRadius}
                onLocationSelect={onLocationSelect}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}

function ReviewStep({ data, estimatedImpressions }: { data: any, estimatedImpressions: number }) {
  return (
    <StaggerContainer className="space-y-8">
      <StaggerItem>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Campaign Review</h2>
          <p className="text-xl text-gray-600">Review your campaign details before launching</p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-6 text-xl">Campaign Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">Name:</span>
                  <span className="font-bold text-orange-900">{data.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">Business Type:</span>
                  <span className="font-bold text-orange-900">{data.businessType}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">Budget:</span>
                  <span className="font-bold text-orange-900">{formatCurrency(data.budget)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">Location:</span>
                  <span className="font-bold text-orange-900">{data.location}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-orange-700 font-semibold">Radius:</span>
                  <span className="font-bold text-orange-900">{data.targetRadius} km</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-6 text-xl">Creative Preview</h3>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-200">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-2xl">L</span>
                  </div>
                  <h4 className="font-bold text-xl mb-3 text-gray-900">{data.creative.headline}</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">{data.creative.description}</p>
                  <button className="canopy-button px-8 py-3">
                    {data.creative.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-6 text-xl">Campaign Performance Estimate</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">Estimated Impressions:</span>
                  <span className="font-bold text-2xl text-orange-900">{estimatedImpressions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">Estimated Reach:</span>
                  <span className="font-bold text-2xl text-orange-900">{Math.round(estimatedImpressions * 0.3).toLocaleString()} people</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">CPM:</span>
                  <span className="font-bold text-2xl text-orange-900">£7.00</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-orange-700 font-semibold">Campaign Duration:</span>
                  <span className="font-bold text-2xl text-orange-900">7 days</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <h3 className="font-bold text-green-900 mb-4 text-xl">Ready to Launch!</h3>
              <p className="text-green-800 leading-relaxed">
                Your campaign is ready to go live. Click "Next" to proceed with payment and launch your campaign.
              </p>
            </div>
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}

function PaymentStep({ data, estimatedImpressions }: { data: any, estimatedImpressions: number }) {
  const [paymentMethod, setPaymentMethod] = useState('card')

  return (
    <StaggerContainer className="space-y-8">
      <StaggerItem>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment & Launch</h2>
          <p className="text-xl text-gray-600">Complete your payment to launch your campaign</p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-6 text-xl">Payment Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">Campaign Budget:</span>
                  <span className="font-bold text-orange-900">{formatCurrency(data.budget)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">Platform Fee (2%):</span>
                  <span className="font-bold text-orange-900">{formatCurrency(data.budget * 0.02)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-t-2 border-orange-300">
                  <span className="text-orange-800 font-bold text-lg">Total:</span>
                  <span className="font-bold text-2xl text-orange-900">{formatCurrency(data.budget * 1.02)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-6 text-xl">Payment Method</h3>
              <div className="space-y-4">
                <label className="flex items-center p-4 bg-white rounded-xl border border-orange-200 cursor-pointer hover:border-orange-300 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-orange-600 bg-orange-100 border-orange-300 focus:ring-orange-500 focus:ring-2 mr-4"
                  />
                  <CreditCard className="w-6 h-6 mr-4 text-orange-500" />
                  <div>
                    <span className="text-lg font-semibold text-gray-900">Credit/Debit Card</span>
                    <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                  </div>
                </label>
                <label className="flex items-center p-4 bg-white rounded-xl border border-orange-200 cursor-pointer hover:border-orange-300 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-orange-600 bg-orange-100 border-orange-300 focus:ring-orange-500 focus:ring-2 mr-4"
                  />
                  <div>
                    <span className="text-lg font-semibold text-gray-900">PayPal</span>
                    <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-6 text-xl">Campaign Launch Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">Campaign Name:</span>
                  <span className="font-bold text-orange-900">{data.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">Launch Date:</span>
                  <span className="font-bold text-orange-900">Today</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-orange-200">
                  <span className="text-orange-700 font-semibold">Duration:</span>
                  <span className="font-bold text-orange-900">7 days</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-orange-700 font-semibold">Expected Impressions:</span>
                  <span className="font-bold text-orange-900">{estimatedImpressions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <h3 className="font-bold text-green-900 mb-4 text-xl">What happens next?</h3>
              <ul className="text-green-800 space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Your campaign will go live within 15 minutes
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  You'll receive a confirmation email
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Access real-time analytics in your dashboard
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Monitor performance and make adjustments
                </li>
              </ul>
            </div>
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}
