import { useEffect, useState, useCallback } from 'react'

interface ScrambleTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  characters?: string
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'

export function ScrambleText({
  text,
  className = '',
  delay = 0,
  duration = 1500,
  characters = DEFAULT_CHARS,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const scramble = useCallback(() => {
    setIsAnimating(true)
    const originalText = text
    const length = originalText.length
    const totalFrames = Math.floor(duration / 30)
    let frame = 0

    const interval = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const revealedCount = Math.floor(progress * length)

      let result = ''
      for (let i = 0; i < length; i++) {
        if (originalText[i] === ' ') {
          result += ' '
        } else if (i < revealedCount) {
          result += originalText[i]
        } else {
          result += characters[Math.floor(Math.random() * characters.length)]
        }
      }

      setDisplayText(result)

      if (frame >= totalFrames) {
        clearInterval(interval)
        setDisplayText(originalText)
        setIsAnimating(false)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [text, duration, characters])

  useEffect(() => {
    const timer = setTimeout(scramble, delay)
    return () => clearTimeout(timer)
  }, [scramble, delay])

  return (
    <span className={`font-mono ${className}`} data-animating={isAnimating}>
      {displayText || text.replace(/./g, ' ')}
    </span>
  )
}

interface ScrambleTextHoverProps {
  text: string
  className?: string
  characters?: string
}

export function ScrambleTextHover({
  text,
  className = '',
  characters = DEFAULT_CHARS,
}: ScrambleTextHoverProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!isHovering) {
      setDisplayText(text)
      return
    }

    let frame = 0
    const totalFrames = 20
    const length = text.length

    const interval = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const revealedCount = Math.floor(progress * length)

      let result = ''
      for (let i = 0; i < length; i++) {
        if (text[i] === ' ') {
          result += ' '
        } else if (i < revealedCount) {
          result += text[i]
        } else {
          result += characters[Math.floor(Math.random() * characters.length)]
        }
      }

      setDisplayText(result)

      if (frame >= totalFrames) {
        clearInterval(interval)
        setDisplayText(text)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [isHovering, text, characters])

  return (
    <span
      className={className}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {displayText}
    </span>
  )
}
