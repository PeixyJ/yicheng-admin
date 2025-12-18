import { motion } from 'motion/react'

interface MarqueeTextProps {
  text: string
  direction?: 'left' | 'right'
  speed?: number
  className?: string
}

export function MarqueeText({
  text,
  direction = 'left',
  speed = 20,
  className = '',
}: MarqueeTextProps) {
  const repeatedText = Array(6).fill(text).join(' \u2022 ')

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-block"
        animate={{
          x: direction === 'left' ? [0, '-50%'] : ['-50%', 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        <span className="inline-block pr-8">{repeatedText}</span>
        <span className="inline-block pr-8">{repeatedText}</span>
      </motion.div>
    </div>
  )
}

export function MarqueeDivider() {
  return (
    <section className="py-8 border-y border-border/50 bg-accent/5">
      <MarqueeText
        text="DESIGN \u2022 DEVELOP \u2022 DEPLOY \u2022 ITERATE"
        className="font-display text-4xl md:text-6xl text-foreground/10"
        speed={25}
      />
    </section>
  )
}
