import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { ProjectsShowcase } from '@/components/sections/projects-showcase'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <HeroSection />
      <FeaturesSection />
      <ProjectsShowcase />
    </main>
  )
}