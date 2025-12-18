import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { ScrambleTextHover } from './scramble-text'

export function FooterSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <footer ref={ref} className="relative bg-foreground text-background overflow-hidden">
      {/* Large Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-display text-[20vw] text-background/5 whitespace-nowrap">
          YICHENG
        </span>
      </div>

      <div className="relative z-10 px-8 md:px-16 lg:px-24 py-24">
        {/* CTA Section */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-sm text-background/60 mb-6 tracking-[0.3em]">
            READY TO START?
          </p>
          <h2 className="font-display text-5xl md:text-8xl lg:text-9xl mb-8">
            <ScrambleTextHover text="LET'S BUILD" />
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center gap-4 px-8 py-4 bg-accent text-accent-foreground font-mono text-sm tracking-wider hover:bg-accent/90 transition-colors"
          >
            <span>GET STARTED</span>
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Footer Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-12 border-t border-background/20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-accent" />
              <span className="font-mono text-sm tracking-wider">YICHENG.ADMIN</span>
            </div>
            <p className="text-background/60 max-w-sm leading-relaxed">
              Crafting digital experiences that push boundaries and inspire action.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-mono text-xs text-background/40 mb-4 tracking-wider">NAVIGATION</p>
            <ul className="space-y-3">
              {['Home', 'Work', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-background/60 hover:text-accent transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="font-mono text-xs text-background/40 mb-4 tracking-wider">CONNECT</p>
            <ul className="space-y-3">
              {['Twitter', 'GitHub', 'LinkedIn', 'Dribbble'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-background/60 hover:text-accent transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-4 mt-16 pt-8 border-t border-background/10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="font-mono text-xs text-background/40">
            &copy; {new Date().getFullYear()} YICHENG. ALL RIGHTS RESERVED.
          </p>
          <p className="font-mono text-xs text-background/40">
            DESIGNED & BUILT WITH PRECISION
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
