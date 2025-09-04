'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ArrowRight, MapPin, Target, Zap, CreditCard, Check, Settings, Sparkles, Map, Eye, DollarSign, Upload, Palette, Monitor, AlertCircle } from 'lucide-react'
import { formatCurrency, calculateImpressions } from '@/lib/utils'
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/animated'
import MapProvider from '@/components/MapProvider'
import CanopyLogo from '@/components/CanopyLogo'
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
    budget: '',
    businessType: '',
    location: '',
    targetRadius: 1,
    creative: {
      headline: '',
      description: '',
      cta: '',
      colors: ['#f97316', '#FFFFFF'],
      logo: null as File | null,
      logoUrl: '',
      logoConcept: '',
      animationSuggestion: '',
      colorScheme: '',
      visualElements: '',
      screenFormat: 'taxi-top',
      maxCharacters: 50,
      currentCharacters: 0,
      appliedLogoConcept: '',
      appliedAnimation: '',
      salePercentage: '',
      discountType: ''
    }
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

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
    { id: 1, title: 'Setup', description: 'Budget & Info', icon: Settings },
    { id: 2, title: 'AI Create', description: 'Design Ad', icon: Sparkles },
    { id: 3, title: 'Target', description: 'Locations', icon: Map },
    { id: 4, title: 'Review', description: 'Final Check', icon: Eye },
    { id: 5, title: 'Launch', description: 'Payment', icon: DollarSign }
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

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {}
    
    if (step === 1) {
      if (!campaignData.name.trim()) {
        newErrors.name = 'Campaign name is required'
      }
      if (!campaignData.businessType) {
        newErrors.businessType = 'Business type is required'
      }
      if (!campaignData.location.trim()) {
        newErrors.location = 'Location is required'
      }
      const budget = Number(campaignData.budget)
      if (!campaignData.budget || isNaN(budget)) {
        newErrors.budget = 'Budget is required'
      } else if (budget < 50) {
        newErrors.budget = 'Minimum budget is £50'
      }
    } else if (step === 2) {
      if (!campaignData.creative.headline.trim()) {
        newErrors.headline = 'Headline is required'
      }
      if (!campaignData.creative.description.trim()) {
        newErrors.description = 'Description is required'
      }
      if (!campaignData.creative.cta.trim()) {
        newErrors.cta = 'Call to action is required'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (currentStep < 5) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1)
      }
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
          budget: Number(campaignData.budget),
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
          amount: Number(campaignData.budget) * 1.02, // Include 2% platform fee
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

  const estimatedImpressions = calculateImpressions(Number(campaignData.budget) || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <div className="canopy-glass backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <FadeIn delay={0.2}>
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
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="text-sm text-orange-600 font-semibold bg-orange-50 px-3 py-1.5 rounded-full">
                Step {currentStep} of 5
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <FadeIn delay={0.6}>
          <div className="mb-8">
            {/* Compact Progress Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition-shadow duration-300">
              {/* Progress Line */}
              <div className="relative mb-4">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-orange-100 rounded-full transform -translate-y-1/2"></div>
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transform -translate-y-1/2 transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-pulse opacity-50"></div>
                </div>
              </div>
              
              {/* Step Indicators */}
              <div className="flex justify-between items-center">
                {steps.map((step, index) => {
                  const IconComponent = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center group cursor-pointer">
                      <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 smooth-transition group-hover:scale-105 ${
                        isCompleted 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg' 
                          : isActive
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg ring-4 ring-orange-200'
                          : 'border-orange-200 text-orange-400 bg-white hover:border-orange-300 hover:shadow-md'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                      </div>
                      
                      {/* Step Labels */}
                      <div className="mt-2 text-center">
                        <p className={`text-xs font-semibold transition-colors ${
                          isActive || isCompleted ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Step Content */}
        <FadeIn delay={0.8}>
          <div className="canopy-card p-10">
                                {currentStep === 1 && <CampaignSetupStep data={campaignData} setData={setCampaignData} errors={errors} clearError={clearError} />}
                    {currentStep === 2 && <AICreationStep data={campaignData} setData={setCampaignData} errors={errors} clearError={clearError} />}
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
                disabled={isLoading}
                className="flex items-center px-8 py-4 canopy-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {currentStep === 5 ? 'Launching...' : 'Loading...'}
                  </div>
                ) : (
                  <>
                    {currentStep === 5 ? 'Launch Campaign' : 'Next'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

function CampaignSetupStep({ data, setData, errors, clearError }: { data: any, setData: any, errors: any, clearError: (field: string) => void }) {
  const budget = Number(data.budget) || 0
  
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
              Campaign Name *
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => {
                setData({...data, name: e.target.value})
                clearError('name')
              }}
              placeholder="e.g., Summer Sale - Central London"
              className={`canopy-input ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
              Business Type *
            </label>
            <select
              value={data.businessType}
              onChange={(e) => {
                setData({...data, businessType: e.target.value})
                clearError('businessType')
              }}
              className={`canopy-input ${errors.businessType ? 'border-red-500 focus:border-red-500' : ''}`}
            >
              <option value="">Select business type</option>
              {['Restaurant & Food', 'Retail & Shopping', 'Health & Beauty', 'Professional Services', 'Entertainment', 'Technology', 'Real Estate', 'Automotive', 'Other'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
              Location *
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => {
                setData({...data, location: e.target.value})
                clearError('location')
              }}
              placeholder="e.g., Central London, UK"
              className={`canopy-input ${errors.location ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
              Budget (£) *
            </label>
            <div className="relative">
              <input
                type="number"
                value={data.budget}
                onChange={(e) => {
                  setData({...data, budget: e.target.value})
                  clearError('budget')
                }}
                min="50"
                max="10000"
                placeholder="100"
                className={`canopy-input pr-12 ${errors.budget ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              <div className="absolute right-4 top-3 text-orange-500 font-semibold">£</div>
            </div>
            {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            <p className="text-sm text-orange-600 mt-2 font-medium">
              Minimum £50. CPM: £7.00
            </p>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
          <h3 className="font-bold text-orange-900 mb-4 text-xl">Campaign Estimate</h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-orange-700 font-semibold">Estimated Impressions:</span>
              <span className="font-bold ml-2 text-orange-900">{calculateImpressions(budget).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-orange-700 font-semibold">Estimated Reach:</span>
              <span className="font-bold ml-2 text-orange-900">{Math.round(calculateImpressions(budget) * 0.3).toLocaleString()} people</span>
            </div>
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}

function AICreationStep({ data, setData, errors, clearError }: { data: any, setData: any, errors: any, clearError: (field: string) => void }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [previewAnimation, setPreviewAnimation] = useState('')
  const [isTestingAnimation, setIsTestingAnimation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Use persistent state from campaignData
  const appliedLogoConcept = data.creative.appliedLogoConcept || ''
  const appliedAnimation = data.creative.appliedAnimation || ''
  const salePercentage = data.creative.salePercentage || ''
  const discountType = data.creative.discountType || ''
  

  
  // Logo upload handler
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Logo file must be smaller than 2MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setData({
          ...data,
          creative: {
            ...data.creative,
            logo: file,
            logoUrl: e.target?.result as string
          }
        })
        toast.success('Logo uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  // Apply logo concept to preview (persistent)
  const handleApplyLogoConcept = () => {
    if (data.creative.logoConcept) {
      setData({
        ...data,
        creative: {
          ...data.creative,
          appliedLogoConcept: data.creative.logoConcept
        }
      })
      toast.success('Logo concept applied! Click "Remove" to revert.')
    }
  }

  // Remove applied logo concept
  const handleRemoveLogoConcept = () => {
    setData({
      ...data,
      creative: {
        ...data.creative,
        appliedLogoConcept: ''
      }
    })
    toast.success('Logo concept removed!')
  }

  // Apply animation from AI suggestions (persistent)
  const handleApplyAISuggestion = () => {
    if (data.creative.animationSuggestion) {
      setData({
        ...data,
        creative: {
          ...data.creative,
          appliedAnimation: data.creative.animationSuggestion
        }
      })
      setIsTestingAnimation(true)
      toast.success('AI animation applied! Click "Remove" to revert.')
    }
  }

  // Remove applied animation
  const handleRemoveAnimation = () => {
    setData({
      ...data,
      creative: {
        ...data.creative,
        appliedAnimation: ''
      }
    })
    setIsTestingAnimation(false)
    toast.success('Animation removed!')
  }

  // Test animation from AI suggestions (temporary preview)
  const handleTestAISuggestion = () => {
    if (data.creative.animationSuggestion) {
      setIsTestingAnimation(true)
      toast.success('Testing AI animation suggestion!')
      // Show animation for 5 seconds with more flashy effects
      setTimeout(() => {
        setIsTestingAnimation(false)
      }, 5000)
    }
  }

  // Test current animation settings (temporary preview)
  const handleTestCurrentAnimation = () => {
    setPreviewAnimation('test')
    setIsTestingAnimation(true)
    toast.success('Testing current animation!')
    // Show animation for 5 seconds with more flashy effects
    setTimeout(() => {
      setPreviewAnimation('')
      setIsTestingAnimation(false)
    }, 5000)
  }
  
  // Color picker handler
  const handleColorChange = (color: string, index: number) => {
    const newColors = [...data.creative.colors]
    newColors[index] = color
    setData({
      ...data,
      creative: {
        ...data.creative,
        colors: newColors
      }
    })
  }
  
  // Screen format validation
  const validateScreenFormat = (text: string) => {
    const maxChars = data.creative.maxCharacters
    return text.length <= maxChars
  }

  const generateWithAI = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-creative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Based on the user's input, create enhanced ad creative suggestions for taxi-top screen advertising. 
          
User's Current Content:
- Headline: "${data.creative.headline || 'Not provided'}"
- Description: "${data.creative.description || 'Not provided'}"
- CTA: "${data.creative.cta || 'Not provided'}"
- Business Type: "${data.businessType}"

Please analyze the user's content and provide:
1. Enhanced headline that builds on their input
2. Improved description that expands on their offer
3. Better CTA that matches their content
4. Logo concept that fits their specific business/offer
5. Animation suggestions that complement their content
6. Color scheme that matches their brand/offer
7. Visual elements that enhance their message

Focus on making the suggestions relevant to what they've actually written, not just generic business type content.`,
          businessType: data.businessType,
          userContent: {
            headline: data.creative.headline,
            description: data.creative.description,
            cta: data.creative.cta
          }
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
          cta: creative.cta,
          logoConcept: creative.logoConcept,
          animationSuggestion: creative.animationSuggestion,
          colorScheme: creative.colorScheme,
          visualElements: creative.visualElements,
          currentCharacters: (creative.headline?.length || 0) + (creative.description?.length || 0) + (creative.cta?.length || 0)
        }
      })
    } catch (error) {
      console.error('Error generating creative:', error)
      // Fallback to user's existing content with enhancements
      setData({
        ...data,
        creative: {
          ...data.creative,
          headline: data.creative.headline || `${data.businessType} Special Offer`,
          description: data.creative.description || 'Visit us today for amazing deals and great service!',
          cta: data.creative.cta || 'Visit Now',
          logoConcept: `${data.businessType} themed logo with modern design`,
          animationSuggestion: 'Smooth fade transitions with pulsing CTA button',
          colorScheme: 'Orange and white with complementary accents',
          visualElements: 'Professional imagery with motion graphics',
          currentCharacters: (data.creative.headline?.length || 0) + (data.creative.description?.length || 0) + (data.creative.cta?.length || 0)
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Form Fields */}
          <div className="xl:col-span-1 space-y-6">
            {/* Logo Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
                Logo Upload
              </label>
              <div className="border-2 border-dashed border-orange-200 rounded-lg p-4 text-center hover:border-orange-300 transition-colors">
                {data.creative.logoUrl ? (
                  <div className="space-y-2">
                    <img src={data.creative.logoUrl} alt="Uploaded logo" className="w-16 h-16 mx-auto object-contain rounded" />
                    <p className="text-sm text-green-600">Logo uploaded successfully!</p>
                    <button
                      onClick={() => setData({...data, creative: {...data.creative, logo: null, logoUrl: ''}})}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove logo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-orange-400" />
                    <p className="text-sm text-gray-600">Click to upload logo</p>
                    <p className="text-xs text-gray-500">Max 2MB, PNG/JPG</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded hover:bg-orange-200 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Color Picker Section */}
            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
                Brand Colors
              </label>
              <div className="flex items-center space-x-3">
                {data.creative.colors.map((color: string, index: number) => (
                  <div key={index} className="relative">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    />
                    {showColorPicker && (
                      <div className="absolute top-12 left-0 z-10 bg-white p-2 rounded-lg shadow-lg border">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => handleColorChange(e.target.value, index)}
                          className="w-8 h-8 border-0 rounded cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700"
                >
                  <Palette className="w-4 h-4" />
                  <span>Customize</span>
                </button>
              </div>
            </div>

            {/* Screen Format Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Monitor className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">Taxi-Top Screen Format</span>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <p>• Max characters: {data.creative.maxCharacters}</p>
                <p>• Current: {data.creative.currentCharacters}</p>
                <p>• Optimized for outdoor visibility</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
                Headline *
              </label>
              <input
                type="text"
                value={data.creative.headline}
                onChange={(e) => {
                  const newValue = e.target.value
                  setData({
                    ...data, 
                    creative: {
                      ...data.creative, 
                      headline: newValue,
                      currentCharacters: newValue.length + data.creative.description.length + data.creative.cta.length
                    }
                  })
                  clearError('headline')
                }}
                placeholder="Enter your headline"
                className={`canopy-input ${errors.headline ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.headline && <p className="text-red-500 text-sm mt-1">{errors.headline}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
                Description *
              </label>
              <textarea
                value={data.creative.description}
                onChange={(e) => {
                  const newValue = e.target.value
                  setData({
                    ...data, 
                    creative: {
                      ...data.creative, 
                      description: newValue,
                      currentCharacters: data.creative.headline.length + newValue.length + data.creative.cta.length
                    }
                  })
                  clearError('description')
                }}
                placeholder="Describe your offer or business"
                rows={4}
                className={`canopy-input resize-none ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-orange-600 mb-3 uppercase tracking-wide">
                Call to Action *
              </label>
              <select
                value={data.creative.cta}
                onChange={(e) => {
                  const newValue = e.target.value
                  setData({
                    ...data, 
                    creative: {
                      ...data.creative, 
                      cta: newValue,
                      currentCharacters: data.creative.headline.length + data.creative.description.length + newValue.length
                    }
                  })
                  clearError('cta')
                }}
                className={`canopy-input ${errors.cta ? 'border-red-500 focus:border-red-500' : ''}`}
              >
                <option value="">Select CTA</option>
                <option value="Visit Now">Visit Now</option>
                <option value="Call Today">Call Today</option>
                <option value="Book Online">Book Online</option>
                <option value="Learn More">Learn More</option>
                <option value="Get Quote">Get Quote</option>
                <option value="Shop Now">Shop Now</option>
                <option value="Order Online">Order Online</option>
                <option value="Book Today">Book Today</option>
              </select>
              {errors.cta && <p className="text-red-500 text-sm mt-1">{errors.cta}</p>}
            </div>

            {/* Optional Sale/Discount Fields */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-orange-700 mb-3 flex items-center">
                🏷️ Sale & Discount (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-orange-600 mb-2 uppercase tracking-wide">
                    Sale Percentage
                  </label>
                  <input
                    type="number"
                    value={salePercentage}
                    onChange={(e) => setData({
                      ...data,
                      creative: {
                        ...data.creative,
                        salePercentage: e.target.value
                      }
                    })}
                    placeholder="e.g., 50"
                    min="1"
                    max="99"
                    className="canopy-input text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter percentage (1-99)</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-orange-600 mb-2 uppercase tracking-wide">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setData({
                      ...data,
                      creative: {
                        ...data.creative,
                        discountType: e.target.value
                      }
                    })}
                    className="canopy-input text-sm"
                  >
                    <option value="">Select discount type</option>
                    <option value="OFF">OFF</option>
                    <option value="SALE">SALE</option>
                    <option value="DISCOUNT">DISCOUNT</option>
                    <option value="CLEARANCE">CLEARANCE</option>
                    <option value="SPECIAL">SPECIAL</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Choose discount type</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-orange-600">
                <p>💡 These will appear as badges in the ad corners when filled</p>
              </div>
            </div>

            <HoverLift>
              <button
                onClick={generateWithAI}
                disabled={isGenerating}
                className="w-full canopy-button py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center">
                  <Zap className="w-4 h-4 mr-2" />
                  {isGenerating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate with AI'
                  )}
                </div>
              </button>
            </HoverLift>

            {/* Preview Animation Controls */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Preview Effects</span>
                <button
                  onClick={handleTestCurrentAnimation}
                  className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded hover:bg-orange-200 transition-colors"
                >
                  {isTestingAnimation ? '🎬 Testing...' : 'Test Animation'}
                </button>
              </div>
              <div className="text-xs text-gray-600">
                <p>• Real-time character count tracking</p>
                <p>• Screen format validation</p>
                <p>• Live color updates</p>
                <p>• Logo integration</p>
              </div>
            </div>
          </div>

          {/* Right Column - Live Preview and AI Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Live Preview */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-4 text-lg">Live Preview</h3>
            {/* Dynamic Ad Background Based on Custom Colors or AI Suggestions */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-300" style={{
              background: data.creative.colors && data.creative.colors.length >= 2 ? 
                `linear-gradient(135deg, ${data.creative.colors[0]} 0%, ${data.creative.colors[1]} 50%, ${data.creative.colors[0]} 100%)` :
                data.creative.colorScheme?.includes('blue') ? 
                'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)' :
                data.creative.colorScheme?.includes('green') ? 
                'linear-gradient(135deg, #065f46 0%, #10b981 50%, #34d399 100%)' :
                data.creative.colorScheme?.includes('purple') ? 
                'linear-gradient(135deg, #581c87 0%, #8b5cf6 50%, #a78bfa 100%)' :
                data.creative.colorScheme?.includes('red') ? 
                'linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #f87171 100%)' :
                data.creative.colorScheme?.includes('gold') ? 
                'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fbbf24 100%)' :
                'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)'
            }}>
              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-20">
                {data.creative.visualElements?.includes('stars') && (
                  <div className="absolute top-4 right-4 text-yellow-300 animate-pulse text-2xl">⭐</div>
                )}
                {data.creative.visualElements?.includes('arrow') && (
                  <div className="absolute top-8 left-8 text-white animate-bounce text-3xl">⬆️</div>
                )}
                {data.creative.visualElements?.includes('motion') && (
                  <div className="absolute bottom-4 left-4 text-white animate-pulse text-xl">✨</div>
                )}
                {data.creative.visualElements?.includes('trail') && (
                  <div className="absolute bottom-8 right-8 text-yellow-200 animate-ping text-lg">💫</div>
                )}
                
                {/* Enhanced Flashy Effects During Animation Testing or When Applied */}
                {(isTestingAnimation || appliedAnimation) && (
                  <>
                    {/* Floating Money/Coin Effects for Sales */}
                    {(salePercentage || discountType) && (
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
              {(salePercentage || discountType) && (
                <>
                  {/* Top Right Corner - Discount Type Badge */}
                  {discountType && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-sale-bounce border-2 border-white shadow-lg z-20">
                      {discountType}!
                    </div>
                  )}
                  
                  {/* Top Left Corner - Percent Off Badge */}
                  {salePercentage && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-sale-bounce border border-white shadow-lg z-20">
                      {salePercentage}% OFF
                    </div>
                  )}
                </>
              )}

              {/* Ad Content */}
              <div className="relative z-10 p-6 text-center">
                {/* Dynamic Logo - Uploaded, Applied Concept, or Business Type Based */}
                <div className={`w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg relative overflow-hidden border-2 border-white/30 ${
                  (appliedLogoConcept || appliedAnimation) ? 'animate-ad-bounce-in' : 'animate-ad-glow'
                }`}>
                  <div className="absolute inset-0 animate-ad-shimmer rounded-full"></div>
                  {data.creative.logoUrl ? (
                    <img 
                      src={data.creative.logoUrl} 
                      alt="Business logo" 
                      className="w-12 h-12 object-contain relative z-10 animate-logo-spin drop-shadow-lg rounded-full"
                    />
                  ) : appliedLogoConcept ? (
                    <div className="text-white font-bold text-3xl animate-logo-spin drop-shadow-lg">
                      {appliedLogoConcept.includes('arrow') ? '⬆️' :
                       appliedLogoConcept.includes('star') ? '⭐' :
                       appliedLogoConcept.includes('circle') ? '⭕' :
                       appliedLogoConcept.includes('diamond') ? '💎' :
                       appliedLogoConcept.includes('heart') ? '❤️' :
                       appliedLogoConcept.includes('shield') ? '🛡️' :
                       appliedLogoConcept.includes('crown') ? '👑' :
                       appliedLogoConcept.includes('lightning') ? '⚡' :
                       appliedLogoConcept.includes('fire') ? '🔥' :
                       appliedLogoConcept.includes('rocket') ? '🚀' :
                       appliedLogoConcept.includes('food') ? '🍽️' :
                       appliedLogoConcept.includes('shopping') ? '🛍️' :
                       appliedLogoConcept.includes('beauty') ? '💄' :
                       appliedLogoConcept.includes('service') ? '💼' :
                       appliedLogoConcept.includes('entertainment') ? '🎬' :
                       appliedLogoConcept.includes('tech') ? '💻' :
                       appliedLogoConcept.includes('real estate') ? '🏠' :
                       appliedLogoConcept.includes('auto') ? '🚗' : '✨'}
                    </div>
                  ) : (
                    <span className="text-white font-bold text-xl relative z-10 animate-logo-spin drop-shadow-lg">
                      {data.businessType === 'Restaurant & Food' ? '🍽️' :
                       data.businessType === 'Retail & Shopping' ? '🛍️' :
                       data.businessType === 'Health & Beauty' ? '💄' :
                       data.businessType === 'Professional Services' ? '💼' :
                       data.businessType === 'Entertainment' ? '🎬' :
                       data.businessType === 'Technology' ? '💻' :
                       data.businessType === 'Real Estate' ? '🏠' :
                       data.businessType === 'Automotive' ? '🚗' :
                       '🚀'}
                    </span>
                  )}
                </div>
                
                {/* Animated Headline */}
                <div className={`mb-3 ${(isTestingAnimation || appliedAnimation) ? 'animate-ad-bounce-in' : 'animate-ad-slide-in'}`}>
                  <h4 className={`font-bold text-2xl mb-2 text-white drop-shadow-lg ${
                    (isTestingAnimation || appliedAnimation) ? 'animate-neon-glow' : 'animate-gradient-shift'
                  }`}>
                    {data.creative.headline || 'Your Headline Here'}
                  </h4>
                  <div className={`w-16 h-1 bg-white/80 mx-auto rounded-full ${
                    (isTestingAnimation || appliedAnimation) ? 'animate-pulse' : 'animate-ad-shimmer'
                  }`}></div>
                  
                  {/* Flashy Sale/Discount Effects for Headline */}
                  {(salePercentage || discountType) && (isTestingAnimation || appliedAnimation) && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-pulse"></div>
                      <div className="absolute top-2 right-2 text-yellow-300 text-lg animate-bounce">💰</div>
                      <div className="absolute bottom-2 left-2 text-yellow-300 text-lg animate-bounce">🎉</div>
                    </div>
                  )}
                </div>
                
                {/* Engaging Description */}
                <p className="text-white/90 mb-4 leading-relaxed text-base max-w-md mx-auto animate-ad-bounce-in drop-shadow-md" style={{animationDelay: '0.2s'}}>
                  {data.creative.description || 'Your compelling description will appear here'}
                </p>
                
                {/* Animated CTA Button */}
                <div className="relative">
                  <button className={`bg-white text-orange-600 px-6 py-2 text-base font-bold hover:scale-105 transition-transform duration-300 shadow-xl rounded-full border-2 border-white/20 backdrop-blur-sm ${
                    (isTestingAnimation || appliedAnimation) ? 'animate-flashy-pulse' : 'animate-button-pulse'
                  }`} style={{animationDelay: '0.4s'}}>
                    {data.creative.cta || 'Call to Action'}
                  </button>
                  
                  {/* Flashy CTA Effects */}
                  {(isTestingAnimation || appliedAnimation) && (
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
              {data.creative.animationSuggestion?.includes('trail') && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-pulse opacity-60"></div>
                </div>
              )}
              
              {/* Professional Services Special Effects */}
              {data.businessType === 'Professional Services' && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                  <div className="absolute top-8 right-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-4 left-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  {/* Star trail effect for Professional Services */}
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-pulse opacity-40"></div>
                </div>
              )}
              
              {/* Star Effects for any business with stars in visual elements */}
              {data.creative.visualElements?.includes('stars') && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-6 left-6 text-yellow-300 animate-pulse text-lg">⭐</div>
                  <div className="absolute top-12 right-12 text-yellow-200 animate-ping text-sm">✨</div>
                  <div className="absolute bottom-6 right-6 text-yellow-300 animate-pulse text-lg">⭐</div>
                  <div className="absolute bottom-12 left-12 text-yellow-200 animate-ping text-sm">✨</div>
                </div>
              )}
            </div>
            
            </div>
            
            {/* Enhanced AI-Generated Creative Details */}
            {data.creative.logoConcept && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-orange-900">AI Creative Insights</h3>
                  <div className="flex items-center space-x-2 text-sm text-orange-600">
                    <Sparkles className="w-4 h-4" />
                    <span>Powered by AI</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/90 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-orange-900 mb-2 flex items-center text-sm">
                      🎭 Logo Concept
                      <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">AI Suggestion</span>
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">{data.creative.logoConcept}</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={appliedLogoConcept ? handleRemoveLogoConcept : handleApplyLogoConcept}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          appliedLogoConcept 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'text-orange-600 hover:text-orange-700 underline'
                        }`}
                      >
                        {appliedLogoConcept ? 'Remove' : 'Apply to preview'}
                      </button>
                      {appliedLogoConcept && (
                        <span className="text-xs text-green-600 font-semibold">✓ Applied</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white/90 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-orange-900 mb-2 flex items-center text-sm">
                      ✨ Animation Style
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Live Preview</span>
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">{data.creative.animationSuggestion}</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={appliedAnimation ? handleRemoveAnimation : handleApplyAISuggestion}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          appliedAnimation 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'text-orange-600 hover:text-orange-700 underline'
                        }`}
                      >
                        {appliedAnimation ? 'Remove' : 'Apply animation'}
                      </button>
                      <button 
                        onClick={handleTestAISuggestion}
                        className="text-xs text-blue-600 hover:text-blue-700 underline transition-colors"
                      >
                        {isTestingAnimation && !appliedAnimation ? '🎬 Testing...' : 'Test preview'}
                      </button>
                      {appliedAnimation && (
                        <span className="text-xs text-green-600 font-semibold">✓ Applied</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white/90 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-orange-900 mb-2 flex items-center text-sm">
                      🎨 Color Scheme
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Applied</span>
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">{data.creative.colorScheme}</p>
                    <div className="flex space-x-1 mt-2">
                      {data.creative.colors.map((color: string, index: number) => (
                        <div key={index} className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/90 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-orange-900 mb-2 flex items-center text-sm">
                      🖼️ Visual Elements
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Active</span>
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">{data.creative.visualElements}</p>
                    <div className="flex space-x-1 mt-2">
                      {data.creative.visualElements?.includes('stars') && <span className="text-sm">⭐</span>}
                      {data.creative.visualElements?.includes('arrow') && <span className="text-sm">⬆️</span>}
                      {data.creative.visualElements?.includes('motion') && <span className="text-sm">✨</span>}
                      {data.creative.visualElements?.includes('trail') && <span className="text-sm">💫</span>}
                    </div>
                  </div>
                </div>
                
                {/* Screen Format Validation */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-800 text-sm flex items-center">
                      <Monitor className="w-4 h-4 mr-2" />
                      Screen Format Validation
                    </h4>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {data.creative.currentCharacters <= data.creative.maxCharacters ? 'Valid' : 'Over Limit'}
                    </span>
                  </div>
                  <div className="text-xs text-green-700 space-y-1">
                    <p>• Format: Taxi-top screen optimized</p>
                    <p>• Visibility: High contrast for outdoor viewing</p>
                    <p>• Animation: Smooth transitions for attention</p>
                    <p>• Layout: Mobile-first responsive design</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}

function TargetingStep({ data, setData, onLocationSelect }: { data: any, setData: any, onLocationSelect?: (location: any) => void }) {
  const [aiRecommendations, setAiRecommendations] = useState<any>(null)
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false)

  // Generate AI targeting recommendations
  const generateTargetingRecommendations = async () => {
    setIsGeneratingRecommendations(true)
    try {
      const response = await fetch('/api/ai/generate-targeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessType: data.businessType,
          location: data.location,
          budget: data.budget,
          targetRadius: data.targetRadius
        }),
      })

      if (response.ok) {
        const recommendations = await response.json()
        setAiRecommendations(recommendations)
      }
    } catch (error) {
      console.error('Error generating targeting recommendations:', error)
      // Fallback recommendations
      setAiRecommendations({
        optimalRadius: data.targetRadius,
        competitorLocations: [
          { name: 'Competitor A', address: '123 Main St', distance: '0.8km' },
          { name: 'Competitor B', address: '456 High St', distance: '1.2km' }
        ],
        highFootfallRoutes: [
          { name: 'Oxford Street', type: 'Shopping District', traffic: 'High' },
          { name: 'King\'s Road', type: 'Commuter Route', traffic: 'Peak Hours' }
        ],
        peakHours: ['7-9 AM', '5-7 PM'],
        recommendations: [
          'Target high-footfall areas within 1km radius',
          'Focus on commuter routes during peak hours',
          'Consider competitor locations for conquesting',
          'Optimize for weekend traffic patterns'
        ]
      })
    } finally {
      setIsGeneratingRecommendations(false)
    }
  }

  // Generate recommendations on component mount
  useEffect(() => {
    if (data.businessType && data.location) {
      generateTargetingRecommendations()
    }
  }, [data.businessType, data.location])

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
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-orange-900 flex items-center text-lg">
                  <Target className="w-5 h-5 mr-3" />
                  AI Targeting Recommendations
                </h3>
                <button
                  onClick={generateTargetingRecommendations}
                  disabled={isGeneratingRecommendations}
                  className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {isGeneratingRecommendations ? '🔄 Generating...' : '🔄 Regenerate'}
                </button>
              </div>
              
              {isGeneratingRecommendations ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                  <p className="text-sm text-orange-700">Analyzing location and generating recommendations...</p>
                </div>
              ) : aiRecommendations ? (
                <div className="space-y-4">
                  {/* Optimal Radius Recommendation */}
                  <div className="bg-white rounded-lg p-3 border border-orange-200">
                    <h4 className="font-semibold text-orange-900 text-sm mb-2">🎯 Optimal Radius</h4>
                    <p className="text-sm text-orange-800">
                      Recommended: <span className="font-bold">{aiRecommendations.optimalRadius}km</span> radius for {data.businessType} businesses
                    </p>
                  </div>

                  {/* Competitor Locations */}
                  {aiRecommendations.competitorLocations && aiRecommendations.competitorLocations.length > 0 && (
                    <div className="bg-white rounded-lg p-3 border border-orange-200">
                      <h4 className="font-semibold text-orange-900 text-sm mb-2">🏢 Competitor Locations</h4>
                      <div className="space-y-1">
                        {aiRecommendations.competitorLocations.map((competitor: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <span className="text-orange-800">{competitor.name}</span>
                            <span className="text-orange-600 font-medium">{competitor.distance}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* High Footfall Routes */}
                  {aiRecommendations.highFootfallRoutes && aiRecommendations.highFootfallRoutes.length > 0 && (
                    <div className="bg-white rounded-lg p-3 border border-orange-200">
                      <h4 className="font-semibold text-orange-900 text-sm mb-2">🚶 High Footfall Routes</h4>
                      <div className="space-y-1">
                        {aiRecommendations.highFootfallRoutes.map((route: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <span className="text-orange-800">{route.name}</span>
                            <span className="text-orange-600 font-medium">{route.traffic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Peak Hours */}
                  {aiRecommendations.peakHours && aiRecommendations.peakHours.length > 0 && (
                    <div className="bg-white rounded-lg p-3 border border-orange-200">
                      <h4 className="font-semibold text-orange-900 text-sm mb-2">⏰ Peak Hours</h4>
                      <p className="text-xs text-orange-800">
                        {aiRecommendations.peakHours.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* General Recommendations */}
                  <div className="bg-white rounded-lg p-3 border border-orange-200">
                    <h4 className="font-semibold text-orange-900 text-sm mb-2">💡 Strategic Recommendations</h4>
                    <ul className="text-orange-800 space-y-1">
                      {aiRecommendations.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start text-xs">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-orange-700">Enter your business type and location to get AI recommendations</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-orange-900 text-xl">Interactive Targeting Map</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-orange-700">Available Screens</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-orange-700">Competitors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-orange-700">High Traffic</span>
                </div>
              </div>
            </div>
            
            <div className="h-80 rounded-2xl overflow-hidden relative">
              <MapProvider
                targetRadius={data.targetRadius}
                onLocationSelect={onLocationSelect}
                className="h-full"
                showScreens={true}
                showCompetitors={aiRecommendations?.competitorLocations}
                showTrafficRoutes={aiRecommendations?.highFootfallRoutes}
              />
              
              {/* Map Overlay Info */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Target className="w-3 h-3 text-orange-500" />
                    <span>Radius: {data.targetRadius}km</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    <span>Screens: 12 available</span>
                  </div>
                  {aiRecommendations && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>Coverage: {Math.round(data.targetRadius * 3.14 * 100)}km²</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Map Statistics */}
            {aiRecommendations && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-3 text-center border border-orange-200">
                  <div className="text-lg font-bold text-orange-900">12</div>
                  <div className="text-xs text-orange-600">Available Screens</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-orange-200">
                  <div className="text-lg font-bold text-orange-900">{aiRecommendations.competitorLocations?.length || 0}</div>
                  <div className="text-xs text-orange-600">Competitors Nearby</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-orange-200">
                  <div className="text-lg font-bold text-orange-900">{aiRecommendations.highFootfallRoutes?.length || 0}</div>
                  <div className="text-xs text-orange-600">High Traffic Routes</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}

function ReviewStep({ data, estimatedImpressions }: { data: any, estimatedImpressions: number }) {
  // Use persistent state from campaignData (same as Step 2)
  const appliedLogoConcept = data.creative.appliedLogoConcept || ''
  const appliedAnimation = data.creative.appliedAnimation || ''
  const salePercentage = data.creative.salePercentage || ''
  const discountType = data.creative.discountType || ''

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
              <h3 className="font-bold text-orange-900 mb-6 text-xl">🎨 Creative Preview</h3>

              {/* Main Ad Preview with Dynamic Background - Same as Step 2 */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-orange-300 mb-6" style={{
                background: data.creative.colors && data.creative.colors.length >= 2 ? 
                  `linear-gradient(135deg, ${data.creative.colors[0]} 0%, ${data.creative.colors[1]} 50%, ${data.creative.colors[0]} 100%)` :
                  data.creative.colorScheme?.includes('blue') ? 
                  'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)' :
                  data.creative.colorScheme?.includes('green') ? 
                  'linear-gradient(135deg, #065f46 0%, #10b981 50%, #34d399 100%)' :
                  data.creative.colorScheme?.includes('purple') ? 
                  'linear-gradient(135deg, #581c87 0%, #8b5cf6 50%, #a78bfa 100%)' :
                  data.creative.colorScheme?.includes('red') ?
                  'linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #f87171 100%)' :
                  data.creative.colorScheme?.includes('gold') ? 
                  'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fbbf24 100%)' :
                  'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)'
              }}>

                <div className="absolute inset-0 opacity-20">
                  {data.creative.visualElements?.includes('stars') && (
                    <div className="absolute top-4 right-4 text-yellow-300 animate-pulse text-2xl">⭐</div>
                  )}
                  {data.creative.visualElements?.includes('arrow') && (
                    <div className="absolute top-8 left-8 text-white animate-bounce text-3xl">⬆️</div>
                  )}
                  {data.creative.visualElements?.includes('motion') && (
                    <div className="absolute bottom-4 left-4 text-white animate-pulse text-xl">✨</div>
                  )}
                  {data.creative.visualElements?.includes('trail') && (
                    <div className="absolute bottom-8 right-8 text-yellow-200 animate-ping text-lg">💫</div>
                  )}
                  
                  {/* Enhanced Flashy Effects When Animation is Applied */}
                  {appliedAnimation && (
                    <>
                      {/* Floating Money/Coin Effects for Sales */}
                      {(salePercentage || discountType) && (
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
                {(salePercentage || discountType) && (
                  <>
                    {/* Top Right Corner - Discount Type Badge */}
                    {discountType && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-sale-bounce border-2 border-white shadow-lg z-20">
                        {discountType}!
                      </div>
                    )}
                    
                    {/* Top Left Corner - Percent Off Badge */}
                    {salePercentage && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-sale-bounce border border-white shadow-lg z-20">
                        {salePercentage}% OFF
                      </div>
                    )}
                  </>
                )}

                {/* Ad Content */}
                <div className="relative z-10 p-6 text-center">
                  {/* Dynamic Logo - Uploaded, Applied Concept, or Business Type Based */}
                  <div className={`w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg relative overflow-hidden border-2 border-white/30 ${
                    (appliedLogoConcept || appliedAnimation) ? 'animate-ad-bounce-in' : 'animate-ad-glow'
                  }`}>
                    <div className="absolute inset-0 animate-ad-shimmer rounded-full"></div>
                    {data.creative.logoUrl ? (
                      <img 
                        src={data.creative.logoUrl} 
                        alt="Business logo" 
                        className="w-12 h-12 object-contain relative z-10 animate-logo-spin drop-shadow-lg rounded-full"
                      />
                    ) : appliedLogoConcept ? (
                      <div className="text-white font-bold text-3xl animate-logo-spin drop-shadow-lg">
                        {appliedLogoConcept.includes('arrow') ? '⬆️' :
                         appliedLogoConcept.includes('star') ? '⭐' :
                         appliedLogoConcept.includes('circle') ? '⭕' :
                         appliedLogoConcept.includes('diamond') ? '💎' :
                         appliedLogoConcept.includes('heart') ? '❤️' :
                         appliedLogoConcept.includes('shield') ? '🛡️' :
                         appliedLogoConcept.includes('crown') ? '👑' :
                         appliedLogoConcept.includes('lightning') ? '⚡' :
                         appliedLogoConcept.includes('fire') ? '🔥' :
                         appliedLogoConcept.includes('rocket') ? '🚀' :
                         appliedLogoConcept.includes('food') ? '🍽️' :
                         appliedLogoConcept.includes('shopping') ? '🛍️' :
                         appliedLogoConcept.includes('beauty') ? '💄' :
                         appliedLogoConcept.includes('service') ? '💼' :
                         appliedLogoConcept.includes('entertainment') ? '🎬' :
                         appliedLogoConcept.includes('tech') ? '💻' :
                         appliedLogoConcept.includes('real estate') ? '🏠' :
                         appliedLogoConcept.includes('auto') ? '🚗' : '✨'}
                      </div>
                    ) : (
                      <span className="text-white font-bold text-xl relative z-10 animate-logo-spin drop-shadow-lg">
                        {data.businessType === 'Restaurant & Food' ? '🍽️' :
                         data.businessType === 'Retail & Shopping' ? '🛍️' :
                         data.businessType === 'Health & Beauty' ? '💄' :
                         data.businessType === 'Professional Services' ? '💼' :
                         data.businessType === 'Entertainment' ? '🎬' :
                         data.businessType === 'Technology' ? '💻' :
                         data.businessType === 'Real Estate' ? '🏠' :
                         data.businessType === 'Automotive' ? '🚗' :
                         '🚀'}
                      </span>
                    )}
                  </div>
                  
                  {/* Animated Headline */}
                  <div className={`mb-3 ${appliedAnimation ? 'animate-ad-bounce-in' : 'animate-ad-slide-in'}`}>
                    <h4 className={`font-bold text-2xl mb-2 text-white drop-shadow-lg ${
                      appliedAnimation ? 'animate-neon-glow' : 'animate-gradient-shift'
                    }`}>
                      {data.creative.headline || 'Your Headline Here'}
                    </h4>
                    <div className={`w-16 h-1 bg-white/80 mx-auto rounded-full ${
                      appliedAnimation ? 'animate-pulse' : 'animate-ad-shimmer'
                    }`}></div>
                    
                    {/* Flashy Sale/Discount Effects for Headline */}
                    {(salePercentage || discountType) && appliedAnimation && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-pulse"></div>
                        <div className="absolute top-2 right-2 text-yellow-300 text-lg animate-bounce">💰</div>
                        <div className="absolute bottom-2 left-2 text-yellow-300 text-lg animate-bounce">🎉</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Engaging Description */}
                  <p className="text-white/90 mb-4 leading-relaxed text-base max-w-md mx-auto animate-ad-bounce-in drop-shadow-md" style={{animationDelay: '0.2s'}}>
                    {data.creative.description || 'Your compelling description will appear here'}
                  </p>
                  
                  {/* Animated CTA Button */}
                  <div className="relative">
                    <button className={`bg-white text-orange-600 px-6 py-2 text-base font-bold hover:scale-105 transition-transform duration-300 shadow-xl rounded-full border-2 border-white/20 backdrop-blur-sm ${
                      appliedAnimation ? 'animate-flashy-pulse' : 'animate-button-pulse'
                    }`} style={{animationDelay: '0.4s'}}>
                      {data.creative.cta || 'Call to Action'}
                    </button>
                    
                    {/* Flashy CTA Effects */}
                    {appliedAnimation && (
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
                {data.creative.animationSuggestion?.includes('trail') && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-pulse opacity-60"></div>
                  </div>
                )}
                
                {/* Professional Services Special Effects */}
                {data.businessType === 'Professional Services' && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                    <div className="absolute top-8 right-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-4 left-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    {/* Star trail effect for Professional Services */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-pulse opacity-40"></div>
                  </div>
                )}
                
                {/* Star Effects for any business with stars in visual elements */}
                {data.creative.visualElements?.includes('stars') && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-6 left-6 text-yellow-300 animate-pulse text-lg">⭐</div>
                    <div className="absolute top-12 right-12 text-yellow-200 animate-ping text-sm">✨</div>
                    <div className="absolute bottom-6 right-6 text-yellow-300 animate-pulse text-lg">⭐</div>
                    <div className="absolute bottom-12 left-12 text-yellow-200 animate-ping text-sm">✨</div>
                  </div>
                )}
              </div>

              {/* Creative Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-xl p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                    🎭 Logo Concept
                  </h4>
                  <p className="text-sm text-gray-600">
                    {data.creative.logoConcept || 'Modern, clean design with business-specific elements'}
                  </p>
                </div>

                <div className="bg-white/80 rounded-xl p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                    🎬 Animation Style
                  </h4>
                  <p className="text-sm text-gray-600">
                    {data.creative.animationSuggestion || 'Smooth transitions with engaging motion'}
                  </p>
                </div>

                <div className="bg-white/80 rounded-xl p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                    🎨 Color Scheme
                  </h4>
                  <p className="text-sm text-gray-600">
                    {data.creative.colorScheme || 'Orange and white with complementary accents'}
                  </p>
                </div>

                <div className="bg-white/80 rounded-xl p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                    ✨ Visual Elements
                  </h4>
                  <p className="text-sm text-gray-600">
                    {data.creative.visualElements || 'Professional imagery with motion graphics'}
                  </p>
                </div>
              </div>

              {/* Professional Ad Mockup */}
              <div className="mt-6 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-6 text-white">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-2">OUTDOOR ADVERTISING PREVIEW</div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
                    TAXI-TOP DIGITAL BILLBOARD
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl mb-1">🚗</div>
                      <div className="text-xs text-gray-300">Moving Display</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">👁️</div>
                      <div className="text-xs text-gray-300">High Visibility</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-xs text-gray-300">Targeted Reach</div>
                    </div>
                  </div>
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
