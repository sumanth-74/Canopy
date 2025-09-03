'use client'

import { useState } from 'react'
import { Zap, Palette, Type, Image, Download, RotateCcw } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface AdCreative {
  headline: string
  description: string
  cta: string
  colors: string[]
  logo?: string
  background?: string
}

interface AIAdStudioProps {
  creative: AdCreative
  onUpdate: (creative: AdCreative) => void
}

export default function AIAdStudio({ creative, onUpdate }: AIAdStudioProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('text')

  const colorPalettes = [
    ['#3B82F6', '#FFFFFF', '#1E40AF'],
    ['#10B981', '#FFFFFF', '#047857'],
    ['#F59E0B', '#FFFFFF', '#D97706'],
    ['#EF4444', '#FFFFFF', '#DC2626'],
    ['#8B5CF6', '#FFFFFF', '#7C3AED'],
    ['#06B6D4', '#FFFFFF', '#0891B2'],
  ]

  const generateWithAI = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation with realistic delays
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const aiSuggestions = [
      {
        headline: "Summer Sale - 50% Off Everything!",
        description: "Don't miss out on our biggest sale of the year. Visit us today!",
        cta: "Shop Now"
      },
      {
        headline: "New Menu Items Available",
        description: "Fresh ingredients, amazing flavors. Come taste the difference!",
        cta: "Order Now"
      },
      {
        headline: "Professional Services You Can Trust",
        description: "Expert solutions for all your needs. Book your consultation today.",
        cta: "Get Quote"
      }
    ]
    
    const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)]
    
    onUpdate({
      ...creative,
      ...randomSuggestion,
      colors: colorPalettes[Math.floor(Math.random() * colorPalettes.length)]
    })
    
    setIsGenerating(false)
  }

  const updateCreative = (field: keyof AdCreative, value: any) => {
    onUpdate({
      ...creative,
      [field]: value
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ad Creation Studio</h3>
          <Button
            onClick={generateWithAI}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'text', label: 'Text', icon: Type },
            { id: 'colors', label: 'Colors', icon: Palette },
            { id: 'assets', label: 'Assets', icon: Image }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headline
              </label>
              <input
                type="text"
                value={creative.headline}
                onChange={(e) => updateCreative('headline', e.target.value)}
                placeholder="Enter your headline"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={creative.description}
                onChange={(e) => updateCreative('description', e.target.value)}
                placeholder="Describe your offer or business"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call to Action
              </label>
              <select
                value={creative.cta}
                onChange={(e) => updateCreative('cta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select CTA</option>
                <option value="Visit Now">Visit Now</option>
                <option value="Call Today">Call Today</option>
                <option value="Book Online">Book Online</option>
                <option value="Learn More">Learn More</option>
                <option value="Get Quote">Get Quote</option>
                <option value="Shop Now">Shop Now</option>
                <option value="Order Now">Order Now</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Palette
              </label>
              <div className="grid grid-cols-2 gap-3">
                {colorPalettes.map((palette, index) => (
                  <button
                    key={index}
                    onClick={() => updateCreative('colors', palette)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      JSON.stringify(creative.colors) === JSON.stringify(palette)
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex space-x-1 mb-2">
                      {palette.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">Palette {index + 1}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Colors
              </label>
              <div className="flex space-x-2">
                {creative.colors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...creative.colors]
                        newColors[index] = e.target.value
                        updateCreative('colors', newColors)
                      }}
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Upload
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload your logo</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload background image</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="bg-upload"
                />
                <label
                  htmlFor="bg-upload"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button variant="outline" className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gray-900 p-6">
              <div 
                className="bg-white rounded-lg p-6 text-center relative"
                style={{ 
                  background: creative.background || `linear-gradient(135deg, ${creative.colors[0]}20, ${creative.colors[1]}20)`
                }}
              >
                {/* Logo placeholder */}
                <div 
                  className="w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: creative.colors[0] }}
                >
                  {creative.logo ? 'LOGO' : 'LOGO'}
                </div>

                {/* Headline */}
                <h4 
                  className="font-bold text-xl mb-3"
                  style={{ color: creative.colors[0] }}
                >
                  {creative.headline || 'Your Headline'}
                </h4>

                {/* Description */}
                <p 
                  className="text-gray-600 mb-4 text-sm"
                  style={{ color: creative.colors[2] || '#6B7280' }}
                >
                  {creative.description || 'Your description will appear here'}
                </p>

                {/* CTA Button */}
                <button 
                  className="px-6 py-2 rounded-lg font-medium text-white transition-colors"
                  style={{ backgroundColor: creative.colors[0] }}
                >
                  {creative.cta || 'Call to Action'}
                </button>

                {/* Taxi screen indicator */}
                <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Taxi Screen
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Info */}
        <div className="mt-4 text-sm text-gray-600">
          <p>• Optimized for taxi-top digital screens</p>
          <p>• 16:9 aspect ratio</p>
          <p>• High contrast for visibility</p>
        </div>
      </div>
    </div>
  )
}
