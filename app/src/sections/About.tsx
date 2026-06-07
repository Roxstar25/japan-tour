import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cities = [
  {
    days: 'Days 1–3',
    name: 'Osaka',
    photos: [
      { src: 'images/osaka-castle.jpg', alt: 'Osaka Castle' },
      { src: 'images/osaka-skyline.jpg', alt: 'Osaka Skyline' },
    ],
    rotation: -3,
  },
  {
    days: 'Days 4–6',
    name: 'Kyoto',
    photos: [
      { src: 'images/kyoto-pagoda.jpg', alt: 'Kyoto Pagoda' },
      { src: 'images/kyoto-shrine.jpg', alt: 'Kyoto Shrine' },
    ],
    rotation: 2,
  },
  {
    days: 'Days 7–10',
    name: 'Tokyo',
    photos: [
      { src: 'images/tokyo-shibuya.jpg', alt: 'Shibuya Crossing' },
      { src: 'images/tokyo-street.jpg', alt: 'Tokyo Street' },
    ],
    rotation: -2,
  },
]

function PhotoCluster({ photos, rotation }: { photos: { src: string; alt: string }[]; rotation: number }) {
  return (
    <div
      className="relative w-[220px] h-[160px] group cursor-pointer"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {photos.map((photo, i) => (
        <div
          key={i}
          className="absolute w-[140px] h-[100px] bg-[#111] p-[4px] rounded-[3px] shadow-lg transition-all duration-300"
          style={{
            top: i === 0 ? '0' : '40px',
            left: i === 0 ? '0' : '60px',
            zIndex: i === 0 ? 2 : 1,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-full object-cover rounded-[2px]"
            loading="lazy"
          />
        </div>
      ))}
      {/* Hover effect - photos separate */}
      <style>{`
        .group:hover > div:nth-child(1) { transform: rotate(-4deg) translate(-4px, -4px); }
        .group:hover > div:nth-child(2) { transform: rotate(4deg) translate(4px, 4px); }
      `}</style>
    </div>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const cityRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // All scroll reveals are gated behind prefers-reduced-motion: no-preference.
    // Under reduced motion no fromTo runs, so elements keep their natural opacity:1.
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Heading fade in
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

      // Text paragraphs fade in
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
          },
        }
      )

      // Timeline cities: viewport-triggered, staggered reveal (Osaka 0ms, Kyoto 200ms, Tokyo 400ms)
      cityRefs.current.forEach((city, i) => {
        if (!city) return
        gsap.fromTo(
          city,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: city,
              start: 'top 85%',
            },
          }
        )
      })
    })

    return () => {
      mm.revert()
    }
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-[#0A0A0A] py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Heading with hairline rules */}
      <div ref={headingRef} className="relative flex items-center gap-6 px-6 md:px-10 lg:px-16 mb-16 md:mb-24">
        <div className="flex-1 hairline" />
        <h2 className="font-display text-[clamp(48px,10vw,120px)] text-[#FAFAFA] leading-none tracking-wide text-center">
          ABOUT THE TOUR
        </h2>
        <div className="flex-1 hairline" />
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Text */}
          <div ref={textRef} className="space-y-8">
            <p className="font-serif text-[clamp(18px,2.5vw,26px)] text-[#FAFAFA]/90 leading-relaxed font-light">
              We've planned a simple and convenient 10-day itinerary for your trip to Japan. You'll visit three cities:{' '}
              <span className="text-[#D4F87A]">Osaka, Kyoto, and Tokyo</span>.
            </p>
            <p className="font-serif text-[clamp(18px,2.5vw,26px)] text-[#FAFAFA]/90 leading-relaxed font-light">
              No need to worry about routes, schedules, or finding places — everything is already organized. We'll show you where to go, what to see, and where to eat, so you can simply{' '}
              <span className="text-[#D4F87A]">enjoy the journey</span>.
            </p>
          </div>

          {/* Right column - Timeline */}
          <div ref={timelineRef} className="relative pl-8 lg:pl-12">
            {/* Vertical hairline */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[rgba(255,255,255,0.15)]" />

            <div className="space-y-12 md:space-y-16">
              {cities.map((city, i) => (
                <div
                  key={city.name}
                  ref={(el) => { cityRefs.current[i] = el }}
                  className="relative"
                >
                  {/* Node dot */}
                  <div className="absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full bg-[#D4F87A]" />

                  <div className="space-y-3">
                    <span className="text-small-caps text-[#888888] block">{city.days}</span>
                    <h3 className="font-display text-[clamp(32px,5vw,56px)] text-[#FAFAFA] leading-none">
                      {city.name}
                    </h3>
                    <div className="pt-4">
                      <PhotoCluster photos={city.photos} rotation={city.rotation} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
