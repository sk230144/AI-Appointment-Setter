'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Phone, Sparkles, TrendingUp, Users, CheckCircle2, ArrowRight } from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center space-y-8 animate-fadeIn">
            {/* Floating badge */}
            <div className="inline-flex items-center gap-2 glass-badge text-sm animate-float">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI-Powered Booking System</span>
            </div>

            {/* Main heading with gradient */}
            <h1 className="text-6xl md:text-8xl font-bold">
              <span className="gradient-text">Virtual Assistant</span>
              <br />
              <span className="text-gray-800">Appointment Booking</span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Next-generation voice-powered appointment scheduling with intelligent
              slot management and real-time availability
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-gradient px-8 py-4 text-lg group cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/appointments')}
                className="glass-button px-8 py-4 text-lg cursor-pointer"
              >
                View Demo
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <StatsCard
              icon={<Users className="w-8 h-8" />}
              value="10,000+"
              label="Appointments Booked"
              gradient="from-blue-500 to-cyan-500"
            />
            <StatsCard
              icon={<TrendingUp className="w-8 h-8" />}
              value="99.9%"
              label="Uptime Guarantee"
              gradient="from-purple-500 to-pink-500"
            />
            <StatsCard
              icon={<CheckCircle2 className="w-8 h-8" />}
              value="< 2s"
              label="Average Response"
              gradient="from-green-500 to-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-5xl font-bold">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for seamless appointment management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Phone className="w-10 h-10" />}
              title="Voice Booking"
              description="Natural language processing for effortless phone appointments"
              color="text-blue-600"
            />
            <FeatureCard
              icon={<Calendar className="w-10 h-10" />}
              title="Smart Scheduling"
              description="AI-powered slot suggestions based on availability patterns"
              color="text-purple-600"
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10" />}
              title="Real-time Updates"
              description="Instant notifications and live dashboard synchronization"
              color="text-pink-600"
            />
            <FeatureCard
              icon={<Sparkles className="w-10 h-10" />}
              title="Auto-Reminders"
              description="Automated SMS and email reminders to reduce no-shows"
              color="text-cyan-600"
            />
            <FeatureCard
              icon={<TrendingUp className="w-10 h-10" />}
              title="Analytics"
              description="Comprehensive insights into booking patterns and trends"
              color="text-green-600"
            />
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Multi-tenant"
              description="Support for multiple businesses and staff members"
              color="text-orange-600"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent to-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-5xl font-bold">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-xl text-gray-600">
              Simple, fast, and intelligent booking in 3 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Call & Speak"
              description="Customers call your number and speak naturally to book appointments"
            />
            <StepCard
              number="02"
              title="AI Processing"
              description="Our AI understands the request and finds available time slots instantly"
            />
            <StepCard
              number="03"
              title="Confirmed"
              description="Appointment is booked and confirmed with instant notifications sent"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card-strong p-12 text-center space-y-8">
            <h2 className="text-5xl font-bold">
              Ready to <span className="gradient-text">Transform</span> Your Booking?
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of businesses using our AI-powered appointment system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-gradient px-10 py-5 text-lg">
                Start Free Trial
              </button>
              <button className="glass-button px-10 py-5 text-lg">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Stats Card Component
function StatsCard({ icon, value, label, gradient }: any) {
  return (
    <div className="glass-card p-8 group cursor-pointer">
      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} bg-opacity-10 mb-4 group-hover:scale-110 transition-transform`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className="text-4xl font-bold mb-2 gradient-text">{value}</div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon, title, description, color }: any) {
  return (
    <div className="glass-card p-8 group hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className={`${color} mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

// Step Card Component
function StepCard({ number, title, description }: any) {
  return (
    <div className="relative">
      <div className="glass-card-strong p-8 h-full">
        <div className="text-6xl font-bold gradient-text mb-6 opacity-50">
          {number}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
      {/* Connecting line (hidden on last item) */}
      <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-transparent -translate-y-1/2 last:hidden" />
    </div>
  )
}
