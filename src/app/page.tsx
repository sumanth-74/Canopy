'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, MapPin, Target, Zap, BarChart3, CreditCard } from 'lucide-react'
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, HoverLift, FloatingElement } from '@/components/ui/animated'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (session) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="canopy-glass backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <FadeIn delay={0.2}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 canopy-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold canopy-text-gradient">Canopy</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => router.push('/auth/signin')}
                  className="text-orange-600 hover:text-orange-700 px-4 py-2 rounded-xl text-sm font-medium smooth-transition hover:bg-orange-50"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => router.push('/auth/signup')}
                  className="canopy-button text-sm"
                >
                  Get Started
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <FadeIn delay={0.6}>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Outdoor Advertising
              <span className="block canopy-text-gradient">
                Made Simple
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.8}>
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              The world's first self-serve outdoor advertising platform. Create AI-powered campaigns 
              for taxi-top digital billboards in minutes, not months.
            </p>
          </FadeIn>
          <FadeIn delay={1.0}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <HoverLift>
                <button 
                  onClick={() => router.push('/auth/signup')}
                  className="canopy-button text-lg px-10 py-4 flex items-center justify-center"
                >
                  Start Your Campaign
                  <ArrowRight className="ml-3 w-6 h-6" />
                </button>
              </HoverLift>
              <HoverLift>
                <button 
                  onClick={() => router.push('/auth/signin')}
                  className="canopy-button-secondary text-lg px-10 py-4"
                >
                  Sign In
                </button>
              </HoverLift>
            </div>
          </FadeIn>
        </div>

        {/* Features Grid */}
        <StaggerContainer className="mt-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <StaggerItem>
              <FeatureCard
                icon={<Zap className="w-10 h-10 text-orange-500" />}
                title="AI-Powered Creation"
                description="Design stunning ads with AI assistance. Input your brand, and watch as we create compelling visuals optimized for taxi-top screens."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<Target className="w-10 h-10 text-orange-500" />}
                title="Smart Targeting"
                description="Target customers around your store, near competitors, or on high-traffic routes. Our AI recommends the best locations for maximum impact."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<MapPin className="w-10 h-10 text-orange-500" />}
                title="Real-Time Tracking"
                description="See exactly where your ads are running with live tracking. Monitor impressions, reach, and demographic insights in real-time."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<BarChart3 className="w-10 h-10 text-orange-500" />}
                title="Advanced Analytics"
                description="Get detailed insights into your campaign performance with demographic data, engagement metrics, and ROI tracking."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<CreditCard className="w-10 h-10 text-orange-500" />}
                title="Simple Pricing"
                description="Transparent pricing at £7 CPM. No hidden fees, no minimum spend. Pay only for the impressions you get."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<ArrowRight className="w-10 h-10 text-orange-500" />}
                title="Instant Launch"
                description="Launch campaigns in minutes, not months. No agencies, no lengthy sales cycles. Just create, pay, and go live."
              />
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* CTA Section */}
        <FadeIn delay={1.2}>
          <div className="mt-32 canopy-card canopy-card-hover p-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Outdoor Advertising?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using Canopy to reach their customers in the real world.
            </p>
            <HoverLift>
              <button 
                onClick={() => router.push('/auth/signup')}
                className="canopy-button text-xl px-12 py-4"
              >
                Start Your First Campaign
              </button>
            </HoverLift>
          </div>
        </FadeIn>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <HoverLift>
      <div className="canopy-card canopy-card-hover p-8 h-full">
        <div className="mb-6 p-3 bg-orange-50 rounded-xl w-fit">{icon}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </HoverLift>
  )
}

function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [realCampaigns, setRealCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [dashboardStats, setDashboardStats] = useState({
    activeCampaigns: 0,
    totalImpressions: 0,
    totalSpend: 0,
    avgCpm: 0
  })

  useEffect(() => {
    if (session) {
      fetchRealCampaigns()

      // Check if we need to refresh after campaign creation
      const shouldRefresh = localStorage.getItem('canopy-refresh-dashboard')
      if (shouldRefresh) {
        localStorage.removeItem('canopy-refresh-dashboard')
        fetchRealCampaigns()
      }

      // Set up real-time updates every 30 seconds
      const interval = setInterval(() => {
        fetchRealCampaigns()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [session])

  const fetchRealCampaigns = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/campaigns')
      if (response.ok) {
        const data = await response.json()
        setRealCampaigns(data)
        calculateDashboardStats(data)
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDashboardStats = (campaigns: any[]) => {
    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length
    const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0)
    const totalSpend = campaigns.reduce((sum, c) => sum + ((c.impressions || 0) * 0.007), 0)
    const avgCpm = campaigns.length > 0 ? totalSpend / (totalImpressions / 1000) : 0

    setDashboardStats({
      activeCampaigns,
      totalImpressions,
      totalSpend,
      avgCpm: avgCpm || 7.00
    })
  }

  // Function to refresh campaigns (can be called from campaign details page)
  const refreshCampaigns = () => {
    fetchRealCampaigns()
  }

  // Expose refresh function globally for campaign details page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refreshDashboard = refreshCampaigns
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="canopy-glass backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <FadeIn delay={0.2}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 canopy-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="text-2xl font-bold canopy-text-gradient">Canopy</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-orange-600 font-medium">
                  Welcome back, {session?.user?.name || 'User'}
                </span>
                <button 
                  onClick={() => router.push('/campaign/new')}
                  className="canopy-button text-sm"
                >
                  New Campaign
                </button>
                <button 
                  onClick={() => signOut()}
                  className="canopy-button-secondary text-sm"
                >
                  Sign Out
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FadeIn delay={0.6}>
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Campaign Dashboard</h1>
                <p className="text-xl text-gray-600">Manage your outdoor advertising campaigns</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live updates enabled</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Stats Cards */}
        <StaggerContainer className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StaggerItem>
              <StatCard 
                title="Active Campaigns" 
                value={dashboardStats.activeCampaigns.toString()} 
                change={`${realCampaigns.length} total campaigns`} 
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard 
                title="Total Impressions" 
                value={dashboardStats.totalImpressions.toLocaleString()} 
                change="Real-time data" 
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard 
                title="Total Spend" 
                value={`£${dashboardStats.totalSpend.toFixed(2)}`} 
                change="Calculated from impressions" 
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard 
                title="Avg. CPM" 
                value={`£${dashboardStats.avgCpm.toFixed(2)}`} 
                change="Based on actual performance" 
              />
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Campaign List */}
        <FadeIn delay={0.8}>
          <div className="canopy-card">
            <div className="px-8 py-6 border-b border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900">Recent Campaigns</h2>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {/* Hardcoded campaigns */}
                <CampaignRow
                  name="Summer Sale - Central London"
                  status="Active"
                  impressions="12,450"
                  spend="£87.15"
                  cpm="£7.00"
                  isHardcoded={true}
                />
                <CampaignRow
                  name="New Product Launch"
                  status="Active"
                  impressions="8,920"
                  spend="£62.44"
                  cpm="£7.00"
                  isHardcoded={true}
                />
                <CampaignRow
                  name="Brand Awareness - West End"
                  status="Paused"
                  impressions="23,861"
                  spend="£167.03"
                  cpm="£7.00"
                  isHardcoded={true}
                />

                {/* Real campaigns from database */}
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    <span className="ml-2 text-gray-600">Loading your campaigns...</span>
                  </div>
                ) : realCampaigns.length > 0 ? (
                  <>
                    {/* Separator */}
                    <div className="border-t border-orange-200 pt-6">
                      <h3 className="text-lg font-semibold text-orange-900 mb-4">Your Campaigns</h3>
                    </div>
                    {realCampaigns.map((campaign) => (
                      <CampaignRow
                        key={campaign.id}
                        id={campaign.id}
                        name={campaign.name}
                        status={campaign.status}
                        impressions={campaign.impressions?.toLocaleString() || '0'}
                        spend={`£${((campaign.impressions || 0) * 0.007).toFixed(2)}`}
                        cpm={`£${((campaign.impressions || 0) * 0.007) / ((campaign.impressions || 0) / 1000) || 7.00}`}
                        isHardcoded={false}
                        onStatusChange={refreshCampaigns}
                      />
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

function StatCard({ title, value, change }: { title: string, value: string, change: string }) {
  return (
    <HoverLift>
      <div className="canopy-card canopy-card-hover p-8">
        <h3 className="text-sm font-medium text-orange-600 mb-2 uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        <p className="text-sm text-green-600 font-medium">{change}</p>
      </div>
    </HoverLift>
  )
}

function CampaignRow({ id, name, status, impressions, spend, cpm, isHardcoded, onStatusChange }: {
  id?: string,
  name: string,
  status: string,
  impressions: string,
  spend: string,
  cpm: string,
  isHardcoded?: boolean,
  onStatusChange?: () => void
}) {
  const statusColor = status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'
  
  const handleStatusToggle = async () => {
    if (isHardcoded || !id || !onStatusChange) return
    
    try {
      const newStatus = status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        onStatusChange() // Refresh the dashboard
      }
    } catch (error) {
      console.error('Error updating campaign status:', error)
    }
  }
  
  return (
    <div className="flex items-center justify-between py-6 border-b border-orange-100 last:border-b-0 smooth-transition hover:bg-orange-50/50 rounded-lg px-4 -mx-4">
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 text-lg mb-2">{name}</h3>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${statusColor}`}>
            {status}
          </span>
          {!isHardcoded && id && (
            <button
              onClick={handleStatusToggle}
              className={`text-xs px-2 py-1 rounded-full font-medium smooth-transition ${
                status === 'ACTIVE' 
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {status === 'ACTIVE' ? 'Pause' : 'Resume'}
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-12 text-sm text-gray-600">
        <div className="text-center">
          <span className="font-bold text-lg text-gray-900">{impressions}</span>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Impressions</div>
        </div>
        <div className="text-center">
          <span className="font-bold text-lg text-gray-900">{spend}</span>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Spend</div>
        </div>
        <div className="text-center">
          <span className="font-bold text-lg text-gray-900">{cpm}</span>
          <div className="text-xs text-gray-500 uppercase tracking-wide">CPM</div>
        </div>
        <button
          onClick={() => {
            if (isHardcoded) {
              // Navigate to demo page for hardcoded campaigns
              window.location.href = `/campaign/demo/${Math.random().toString(36).substr(2, 9)}`
            } else if (id) {
              // Navigate to real campaign details for real campaigns
              window.location.href = `/campaign/${id}`
            }
          }}
          className="text-orange-600 hover:text-orange-700 font-semibold smooth-transition hover:bg-orange-50 px-4 py-2 rounded-lg"
        >
          View Details
        </button>
      </div>
    </div>
  )
}
