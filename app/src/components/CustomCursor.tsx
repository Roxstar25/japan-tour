import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const isHoveringRef = useRef(false)

  useEffect(() => {
    const dot = dotRef.current
    const circle = circleRef.current
    if (!dot || !circle) return

    // Default ring sits at 60% of its 32px size; grows to a full 32px on hover.
    gsap.set(circle, { scale: 0.6 })

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX
      posRef.current.y = e.clientY

      gsap.to(dot, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.05,
        ease: 'power2.out',
      })

      gsap.to(circle, {
        x: e.clientX - 16,
        y: e.clientY - 16,
        duration: 0.15,
        ease: 'power2.out',
      })
    }

    const handleMouseEnterInteractive = () => {
      if (isHoveringRef.current) return
      isHoveringRef.current = true
      gsap.to(dot, { scale: 0, duration: 0.2, ease: 'power2.out' })
      gsap.to(circle, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' })
    }

    const handleMouseLeaveInteractive = () => {
      isHoveringRef.current = false
      gsap.to(dot, { scale: 1, duration: 0.2, ease: 'power2.out' })
      gsap.to(circle, { scale: 0.6, opacity: 0.4, duration: 0.3, ease: 'power2.out' })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Attach listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnterInteractive)
      el.addEventListener('mouseleave', handleMouseLeaveInteractive)
    })

    // MutationObserver for dynamic elements
    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll('a, button, [data-cursor-hover]')
      newElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive)
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive)
        el.addEventListener('mouseenter', handleMouseEnterInteractive)
        el.addEventListener('mouseleave', handleMouseLeaveInteractive)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#FAFAFA] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        style={{ transform: 'translate(-100px, -100px)' }}
      />
      <div
        ref={circleRef}
        className="fixed top-0 left-0 w-8 h-8 border border-[#FAFAFA]/50 rounded-full pointer-events-none z-[9998] opacity-40 hidden lg:block"
        style={{ transform: 'translate(-100px, -100px)' }}
      />
    </>
  )
}
