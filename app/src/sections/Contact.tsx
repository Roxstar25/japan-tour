import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({ name: '', phone: '', comment: '' })

  useEffect(() => {
    const section = sectionRef.current
    const bg = bgRef.current
    const form = formRef.current
    if (!section || !bg || !form) return

    // Background parallax
    gsap.to(bg, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    // Form slide in
    gsap.fromTo(
      form,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && section.contains(st.trigger as Element)) st.kill()
      })
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert('Thank you! We will contact you soon.')
    setFormData({ name: '', phone: '', comment: '' })
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-[120%]"
        style={{ top: '-10%' }}
      >
        <img
          src="images/contact-bg.jpg"
          alt="Cherry blossoms framing Mount Fuji"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]/30" />
      </div>

      {/* Form Panel */}
      <div
        ref={formRef}
        className="relative z-10 flex items-center min-h-screen px-6 md:px-10 lg:px-16 py-24"
      >
        <div className="glass-panel w-full max-w-md p-8 md:p-10">
          <h2 className="font-serif text-[clamp(24px,3vw,32px)] text-[#FAFAFA] font-light leading-snug mb-2">
            Want to join us, but still have questions?
          </h2>
          <p className="text-small-caps text-[#888888] mb-8">Leave a request</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input-line"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input-line"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={3}
                className="form-input-line resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-4 rounded-full font-medium text-sm transition-all duration-300"
              style={{
                background: '#FAFAFA',
                color: '#0A0A0A',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D4F87A'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FAFAFA'
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
