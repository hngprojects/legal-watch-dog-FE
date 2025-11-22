<script setup lang="ts">
import { ref } from 'vue'
import MainHeader from '@/components/landing-page/MainHeader.vue'
import MainFooter from '@/components/landing-page/MainFooter.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const handleDemoClick = () => {
  console.log('Demo clicked')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#FAF7F4] to-[#F2EDE8]">
    <MainHeader />
    
    <!-- Hero Section -->
    <section class="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <Badge 
          variant="secondary"
          class="text-gray-600 border border-gray-300 bg-white px-5 py-2 text-sm font-medium shadow-sm mb-8 rounded-full"
        >
          AI-Powered Regulatory Intelligence
        </Badge>
        
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          How Legal Watch Dog Works
        </h1>
        
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Stay ahead of legal changes with AI-powered monitoring.<br />
          Never miss an important update across any jurisdiction.
        </p>

        <Button
          @click="handleDemoClick"
          class="px-8 py-3 bg-[#3a1f14] text-white hover:bg-[#2d1810] rounded-lg font-medium inline-flex items-center gap-2"
        >
          <span>▶</span>
          Watch 2-minute Demo
        </Button>
      </div>
    </section>

    <!-- Animated Card Section -->
    <section class="py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <Card class="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-gray-200">
          <div class="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-20 h-20" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="#3a1f14" stroke-width="3"/>
              <circle cx="50" cy="30" r="8" fill="#3a1f14"/>
              <path d="M50 38 L50 62" stroke="#3a1f14" stroke-width="3"/>
              <path d="M35 50 L50 62 L65 50" stroke="#3a1f14" stroke-width="3" fill="none"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">The world changes fast...</h3>
        </Card>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div class="max-w-4xl mx-auto text-center mb-12">
        <Badge 
          variant="secondary"
          class="text-gray-600 border border-gray-300 bg-white px-5 py-2 text-sm font-medium shadow-sm mb-8 rounded-full"
        >
          AI-Powered Regulatory Intelligence
        </Badge>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          How Legal Watch Dog Works
        </h2>
        <p class="text-lg text-gray-600 mb-4">
          Stay ahead of legal changes with AI-powered monitoring.
        </p>
        <p class="text-gray-600">
          Never miss an important update across any jurisdiction.
        </p>
        <Button
          @click="handleDemoClick"
          class="mt-6 px-8 py-3 bg-[#3a1f14] text-white hover:bg-[#2d1810] rounded-lg font-medium"
        >
          Watch 5-minute Demo
        </Button>
      </div>
    </section>

    <!-- Steps Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span class="text-gray-900">5</span>
            <span class="text-[#F59E0B]"> Simple Steps</span>
            <span class="text-gray-900"> to Stay Informed</span>
          </h2>
          <p class="text-gray-600 text-lg">
            From setups to alerts in minutes
          </p>
        </div>

        <!-- Steps -->
        <div class="space-y-24">
          <!-- Step 1 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  01
                </div>
                <span class="text-2xl font-semibold text-[#F59E0B]">Step 1</span>
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-4">Set Your Project</h3>
              <p class="text-gray-600 text-lg">
                Define what you want to monitor or any legal topic across multiple jurisdiction.
              </p>
            </div>
            <div class="order-1 lg:order-2">
              <Card class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div class="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop" 
                    alt="Set Your Project Screenshot"
                    class="w-full h-full object-cover"
                  />
                </div>
              </Card>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="order-1">
              <Card class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div class="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&h=600&fit=crop" 
                    alt="Define Your Jurisdiction Screenshot"
                    class="w-full h-full object-cover"
                  />
                </div>
              </Card>
            </div>
            <div class="order-2">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  02
                </div>
                <span class="text-2xl font-semibold text-[#F59E0B]">Step 2</span>
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-4">Define Your Jurisdiction</h3>
              <p class="text-gray-600 text-lg">
                Choose the country you want to follow and track changes.
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  03
                </div>
                <span class="text-2xl font-semibold text-[#F59E0B]">Step 3</span>
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-4">Add Trusted Sources</h3>
              <p class="text-gray-600 text-lg">
                Choose the government sites or regulatory bodies you want to track.
              </p>
            </div>
            <div class="order-1 lg:order-2">
              <Card class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div class="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop" 
                    alt="Add Trusted Sources Screenshot"
                    class="w-full h-full object-cover"
                  />
                </div>
              </Card>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="order-1">
              <Card class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div class="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop" 
                    alt="Automated Monitoring Screenshot"
                    class="w-full h-full object-cover"
                  />
                </div>
              </Card>
            </div>
            <div class="order-2">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  04
                </div>
                <span class="text-2xl font-semibold text-[#F59E0B]">Step 4</span>
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-4">Automated Monitoring</h3>
              <p class="text-gray-600 text-lg">
                Our system tracks / checks your sources for changes 24/7.
              </p>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-[#F59E0B] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  05
                </div>
                <span class="text-2xl font-semibold text-[#F59E0B]">Step 5</span>
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-4">Automated Alerts</h3>
              <p class="text-gray-600 text-lg">
                Receive notification when important changes happen.
              </p>
            </div>
            <div class="order-1 lg:order-2">
              <Card class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div class="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" 
                    alt="Automated Alerts Screenshot"
                    class="w-full h-full object-cover"
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <MainFooter />
  </div>
</template>

<style scoped>
button:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>