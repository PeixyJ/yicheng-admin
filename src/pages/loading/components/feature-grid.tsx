import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { ScrambleTextHover } from './scramble-text'

interface FeatureCardProps {
  number: string
  title: string
  description: string
  index: number
}

function FeatureCard({ number, title, description, index }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      className="group relative p-8 border border-border/50 bg-background hover:bg-accent/5 transition-colors duration-500"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Number */}
      <span className="absolute top-4 right-4 font-mono text-xs text-muted-foreground">
        {number}
      </span>

      {/* Hover Accent Line */}
      <motion.div
        className="absolute left-0 top-0 w-1 bg-accent"
        initial={{ height: 0 }}
        whileHover={{ height: '100%' }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative">
        <h3 className="font-display text-3xl mb-4 text-foreground group-hover:text-accent transition-colors">
          <ScrambleTextHover text={title} />
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <motion.div
        className="absolute bottom-8 right-8 w-8 h-8 flex items-center justify-center text-accent opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ x: 5 }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path
            d="M7 17L17 7M17 7H7M17 7V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  )
}

const features = [
  {
    number: '01',
    title: 'STRATEGY',
    description: 'Deep understanding of your goals and audience to create meaningful digital solutions.',
  },
  {
    number: '02',
    title: 'DESIGN',
    description: 'Crafting visually stunning interfaces that balance aesthetics with functionality.',
  },
  {
    number: '03',
    title: 'DEVELOP',
    description: 'Building robust, scalable applications with cutting-edge technologies.',
  },
  {
    number: '04',
    title: 'LAUNCH',
    description: 'Seamless deployment and continuous optimization for peak performance.',
  },
]

export function FeatureGrid() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-8 md:px-16 lg:px-24 bg-background">
      {/* Section Header */}
      <motion.div
        ref={headerRef}
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-sm text-accent mb-4 tracking-[0.3em]">
          OUR PROCESS
        </p>
        <h2 className="font-display text-5xl md:text-7xl text-foreground">
          HOW WE WORK
        </h2>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/50">
        {features.map((feature, index) => (
          <FeatureCard key={feature.number} {...feature} index={index} />
        ))}
      </div>
    </section>
  )
}
