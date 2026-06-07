import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const polaroidData = [
  { img: 'images/polaroid-kyoto-pagoda.jpg', video: 'videos/pagoda.mp4', caption: '3 cities in Japan' },
  { img: 'images/polaroid-rice-fields.jpg', video: 'videos/rice-fields.mp4', caption: '10 days' },
  { img: 'images/polaroid-red-shrine.jpg', video: 'videos/shrine.mp4', caption: 'gigabytes of photos' },
  { img: 'images/polaroid-ramen.jpg', video: 'videos/ramen.mp4', caption: 'eat ramen' },
  { img: 'images/polaroid-shinjuku.jpg', video: 'videos/shinjuku.mp4', caption: 'enjoy the vibe' },
]

function PolaroidCard({ img, video, caption }: { img: string; video: string; caption: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [isHovered])

  return (
    <div
      className="relative flex-shrink-0 w-[160px] h-[200px] bg-[#1a1a1a] rounded-[4px] p-[6px] pb-[28px] cursor-pointer transition-all"
      style={{
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(255, 184, 197, 0.2), 0 8px 24px rgba(0,0,0,0.4)'
          : '0 8px 32px rgba(0,0,0,0.4)',
        transitionDuration: '400ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full overflow-hidden rounded-[2px]">
        <img
          src={img}
          alt={caption}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <video
          ref={videoRef}
          src={video}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
        />
      </div>
      <span className="absolute bottom-[8px] left-[10px] text-small-caps text-[#888888] text-[10px]">
        {caption}
      </span>
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const mountainsRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const figureRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const mountains = mountainsRef.current
    const text = textRef.current
    const figure = figureRef.current
    const cards = cardsRef.current
    if (!hero || !mountains || !text || !figure || !cards) return

    // Hero parallax: mountains at 0.3x, text at 0.5x, figure fixed, cards at 0.4x.
    // Wrapped in gsap.matchMedia so it is skipped entirely under prefers-reduced-motion
    // (elements stay in their natural, untransformed positions).
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(mountains, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      })

      gsap.to(text, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      })

      // Cards drift left at 0.4x
      gsap.to(cards, {
        x: -120,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      })

      // Kimono figure stays mostly fixed (slight parallax for depth)
      gsap.to(figure, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      })
    })

    return () => {
      mm.revert()
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #2a1f14 0%, #4a3728 30%, #6b5340 60%, #0A0A0A 100%)' }}
    >
      {/* ===== LAYER 0: Background gradient sky ===== */}
      <div className="absolute inset-0 z-0" />

      {/* ===== LAYER 10: JAPAN Typography (behind mountains) ===== */}
      <div
        ref={textRef}
        className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-center pointer-events-none select-none"
        style={{ height: '75%' }}
      >
        <h1
          className="font-display text-[clamp(120px,22vw,400px)] leading-[0.75] tracking-[0.02em] text-[#FAFAFA]/10 whitespace-nowrap"
          style={{
            WebkitTextStroke: '1px rgba(250, 250, 250, 0.25)',
            textShadow: '0 0 80px rgba(245, 232, 211, 0.08)',
          }}
        >
          JAPAN
        </h1>
      </div>

      {/* ===== LAYER 20: Mountain Image (in front of text) ===== */}
      <div
        ref={mountainsRef}
        className="absolute inset-x-0 bottom-0 z-20 w-full"
        style={{ height: '70%' }}
      >
        <img
          src="images/hero-mountains.jpg"
          alt="Misty Japanese mountains at dawn"
          className="w-full h-full object-cover object-bottom"
          style={{
            // Top of the mountain image fades to transparent so the JAPAN text
            // behind (z-10) reads through. Larger 2nd stop = more letterform shown
            // above the ridge. Tune this % live against the reference (Prompt 2: ~40–50%).
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 28%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 28%, black 100%)',
          }}
        />
        {/* Gradient overlay at top of mountains to blend with sky */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(42,31,20,0.95) 0%, rgba(42,31,20,0.3) 20%, transparent 40%, transparent 100%)',
          }}
        />
      </div>

      {/* ===== LAYER 30: Foreground (Kimono figure, Nav, Cards) ===== */}
      {/* Kimono Figure - right side */}
      <div
        ref={figureRef}
        className="absolute z-30 pointer-events-none"
        style={{
          right: '2%',
          bottom: '8%',
          width: 'clamp(200px, 28vw, 420px)',
          height: 'clamp(320px, 42vw, 600px)',
        }}
      >
        <img
          src="images/kimono-figure.png"
          alt="Woman in floral kimono gazing at mountains"
          className="w-full h-full object-contain object-bottom"
          style={{
            filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))',
          }}
          loading="eager"
        />
      </div>

      {/* Cherry blossom branches framing right edge */}
      <div
        className="absolute z-30 pointer-events-none hidden lg:block"
        style={{
          right: '-2%',
          top: '5%',
          width: 'clamp(120px, 16vw, 240px)',
          height: 'clamp(200px, 28vh, 400px)',
        }}
      >
        <img
          src="images/cherry-branches.png"
          alt="Cherry blossom branches"
          className="w-full h-full object-contain object-top-right"
          style={{
            filter: 'drop-shadow(0 4px 20px rgba(255,183,197,0.2))',
            transform: 'scaleX(-1) rotate(-10deg)',
          }}
          loading="eager"
        />
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="absolute top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-10 lg:px-16 py-6">
        {/* Logo - top left */}
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#FAFAFA]">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span className="text-small-caps text-[#FAFAFA]">JAPAN TOURS</span>
        </div>

        {/* Nav links - top right */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-small-caps text-[#FAFAFA]/80 nav-link hover:text-[#FAFAFA] transition-colors">
            About
          </a>
          <a href="#included" className="text-small-caps text-[#FAFAFA]/80 nav-link hover:text-[#FAFAFA] transition-colors">
            Included
          </a>
          <a href="#contact" className="text-small-caps text-[#FAFAFA]/80 nav-link hover:text-[#FAFAFA] transition-colors">
            Contacts
          </a>
          <a
            href="#contact"
            className="ml-4 px-5 py-2 border border-[#FAFAFA]/40 rounded-full text-small-caps text-[#FAFAFA]/90 hover:border-[#FAFAFA] hover:bg-[#FAFAFA]/5 transition-all duration-300"
          >
            Book
          </a>
        </div>
      </nav>

      {/* Social icons - right edge, vertical */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
        <a href="#" className="text-[#FAFAFA]/30 hover:text-[#FAFAFA]/70 transition-colors" aria-label="Instagram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="5" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
        <a href="#" className="text-[#FAFAFA]/30 hover:text-[#FAFAFA]/70 transition-colors" aria-label="Facebook">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </a>
        <a href="#" className="text-[#FAFAFA]/30 hover:text-[#FAFAFA]/70 transition-colors" aria-label="Telegram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.2 2L2.5 10.2c-.5.2-.5 1.1 0 1.4l4.6 1.7 1.8 5.8c.1.4.6.6.9.3l2.6-2.4 5.1 3.8c.4.3.9 0 1-.4L22.5 3c.1-.5-.4-.9-.8-1h-.5z" />
            <path d="M9 14l5-4" />
          </svg>
        </a>
      </div>

      {/* ===== POLAROID CARD STRIP ===== */}
      <div
        ref={cardsRef}
        className="absolute bottom-8 left-6 md:left-10 lg:left-16 z-40"
      >
        <div className="flex gap-4">
          {polaroidData.map((item, i) => (
            <PolaroidCard key={i} {...item} />
          ))}
        </div>
      </div>

      {/* Book button - floating near kimono */}
      <a
        href="#contact"
        className="absolute z-40 hidden md:flex items-center gap-2 px-6 py-3 rounded-full text-[#0A0A0A] font-medium text-sm transition-all duration-300 group"
        style={{
          right: 'clamp(180px, 26vw, 380px)',
          bottom: '12%',
          background: '#F5E8D3',
          backdropFilter: 'blur(12px)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.background = 'linear-gradient(to top, #D4F87A 0%, #D4F87A 100%)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.background = '#F5E8D3'
        }}
      >
        <span>Book Now</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </section>
  )
}
