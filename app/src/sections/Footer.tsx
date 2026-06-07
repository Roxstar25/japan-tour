export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0A0A0A] pt-12 pb-8">
      {/* Hairline */}
      <div className="mx-6 md:mx-10 lg:mx-16 hairline mb-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {/* Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Nav links - centered on mobile, left on desktop */}
          <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <a href="#" className="text-small-caps text-[#FAFAFA]/60 nav-link hover:text-[#FAFAFA] transition-colors">
              Home
            </a>
            <a href="#about" className="text-small-caps text-[#FAFAFA]/60 nav-link hover:text-[#FAFAFA] transition-colors">
              About
            </a>
            <a href="#included" className="text-small-caps text-[#FAFAFA]/60 nav-link hover:text-[#FAFAFA] transition-colors">
              Included
            </a>
            <a href="#contact" className="text-small-caps text-[#FAFAFA]/60 nav-link hover:text-[#FAFAFA] transition-colors">
              Contacts
            </a>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[rgba(255,255,255,0.06)]">
          {/* Logo - bottom left */}
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#FAFAFA]/50">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-small-caps text-[#FAFAFA]/50 text-[10px]">JAPAN TOURS</span>
          </div>

          {/* Social icons - bottom right */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#FAFAFA]/30 hover:text-[#FAFAFA]/70 transition-colors" aria-label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="text-[#FAFAFA]/30 hover:text-[#FAFAFA]/70 transition-colors" aria-label="Facebook">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="text-[#FAFAFA]/30 hover:text-[#FAFAFA]/70 transition-colors" aria-label="Telegram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.2 2L2.5 10.2c-.5.2-.5 1.1 0 1.4l4.6 1.7 1.8 5.8c.1.4.6.6.9.3l2.6-2.4 5.1 3.8c.4.3.9 0 1-.4L22.5 3c.1-.5-.4-.9-.8-1h-.5z" />
                <path d="M9 14l5-4" />
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-[11px] text-[#888888]/50">
            &copy; {new Date().getFullYear()} Japan Tours. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
