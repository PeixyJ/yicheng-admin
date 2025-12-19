import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ScrambleText } from './scramble-text'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background"
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 border border-accent/20 rounded-full"
        animate={{
          x: mousePosition.x * 30,
          y: mousePosition.y * 30,
          rotate: 360,
        }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-24 h-24 bg-accent/10"
        animate={{
          x: mousePosition.x * -20,
          y: mousePosition.y * -20,
        }}
      />

      {/* Top Bar */}
      <motion.div
        className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-border/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-accent animate-pulse" />
          <span className="font-mono text-sm text-muted-foreground tracking-wider">
            <ScrambleText text="YICHENG.ADMIN" delay={500} />
          </span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Overline */}
          <motion.p
            className="font-mono text-sm text-accent mb-6 tracking-[0.3em]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ScrambleText text="DIGITAL EXPERIENCE" delay={800} />
          </motion.p>

          {/* Main Headline */}
          <div className="overflow-hidden">
            <motion.h1
              className="font-display text-[clamp(4rem,15vw,14rem)] leading-[0.85] tracking-tight text-foreground"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.33, 1, 0.68, 1] }}
            >
              CRAFT
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className="font-display text-[clamp(4rem,15vw,14rem)] leading-[0.85] tracking-tight text-foreground flex items-center gap-6"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.75, ease: [0.33, 1, 0.68, 1] }}
            >
              <span className="text-accent">&</span>
              <span>CODE</span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            className="mt-8 max-w-md text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Building exceptional digital experiences with precision and creativity.
          </motion.p>
        </motion.div>

        {/* Decorative Line */}
        <motion.div
          className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 w-px h-48 bg-gradient-to-b from-transparent via-accent to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        />
      </div>

      {/* Bottom Bar */}
      <motion.div
        className="relative z-10 flex justify-between items-center px-8 py-6 border-t border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="flex gap-8">
          <a href="#work" className="font-mono text-sm text-muted-foreground hover:text-accent transition-colors">
            [01] WORK
          </a>
          <a href="#about" className="font-mono text-sm text-muted-foreground hover:text-accent transition-colors">
            [02] ABOUT
          </a>
          <a href="#contact" className="font-mono text-sm text-muted-foreground hover:text-accent transition-colors">
            [03] CONTACT
          </a>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="flex items-center gap-3"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-mono text-xs text-muted-foreground">SCROLL</span>
          <div className="w-px h-8 bg-accent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
