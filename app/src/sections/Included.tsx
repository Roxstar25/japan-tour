import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const includedItems = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Guides',
    description: '2 awesome guides who know everything about Japan!',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20M2 12c0-5.5 4.5-10 10-10s10 4.5 10 10M2 12c0 5.5 4.5 10 10 10" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v20" />
      </svg>
    ),
    title: 'Flights',
    description: 'Routes: Moscow — Osaka, Tokyo — Moscow',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="8" width="20" height="12" rx="2" ry="2" />
        <path d="M6 8V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
    title: 'Transfers',
    description: 'From the airport to the hotels',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Hotels',
    description: 'Comfortable accommodation, 2 people per room (breakfasts included)',
  },
]

export default function Included() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Heading animation
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
        },
      }
    )

    // Cards stagger animation
    cardsRef.current.forEach((card, i) => {
      if (!card) return
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && section.contains(st.trigger as Element)) st.kill()
      })
    }
  }, [])

  return (
    <section
      id="included"
      ref={sectionRef}
      className="relative w-full bg-[#0A0A0A] py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Heading with hairline */}
      <div ref={headingRef} className="flex items-center gap-6 px-6 md:px-10 lg:px-16 mb-16 md:mb-20">
        <h2 className="font-display text-[clamp(48px,10vw,120px)] text-[#FAFAFA] leading-none tracking-wide whitespace-nowrap">
          WHAT'S INCLUDED
        </h2>
        <div className="flex-1 hairline" />
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {includedItems.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => { cardsRef.current[i] = el }}
              className="glass-card p-8 cursor-default group"
            >
              {/* Icon */}
              <div
                className="text-[#D4F87A] mb-6 transition-transform duration-300"
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-small-caps text-[#FAFAFA] mb-4 tracking-[0.2em]">
                {item.title}
              </h3>

              {/* Description */}
              <p className="font-body text-[14px] text-[#FAFAFA]/60 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
