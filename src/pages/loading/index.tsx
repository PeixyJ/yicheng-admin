import { Link } from 'react-router-dom'
import { AnimatedNoise } from './components/animated-noise'
import { HeroSection } from './components/hero-section'
import { MarqueeDivider } from './components/marquee-text'
import { FeatureGrid } from './components/feature-grid'
import { FooterSection } from './components/footer-section'

export default function LoadingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Animated Noise Overlay */}
      <AnimatedNoise opacity={0.03} />

      {/* Login Button - Fixed */}
      <Link
        to="/login"
        className="fixed top-6 right-6 z-50 px-5 py-2.5 font-mono text-xs tracking-wider border border-border bg-background/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300"
      >
        LOGIN
      </Link>

      {/* Main Content */}
      <main>
        <HeroSection />
        <MarqueeDivider />
        <FeatureGrid />
        <FooterSection />
      </main>
    </div>
  )
}
