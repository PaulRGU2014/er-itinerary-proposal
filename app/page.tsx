import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="border-b border-[#f0f0f0] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <span className="text-white font-playfair text-lg font-bold">E</span>
            </div>
            <span className="font-playfair text-xl tracking-wider text-black">EXCLUSIVE RESORTS</span>
          </div>
          <div className="flex items-center space-x-8 text-sm tracking-wide">
            <a href="#" className="text-[#666666] hover:text-[#d4af37] transition-colors">HOME</a>
            <a href="#" className="text-[#666666] hover:text-[#d4af37] transition-colors">ABOUT</a>
            <a href="#" className="text-[#666666] hover:text-[#d4af37] transition-colors">CONTACT</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Label */}
            <div className="inline-flex items-center space-x-2">
              <div className="w-12 h-0.5 bg-gradient-to-r from-[#d4af37] to-transparent"></div>
              <span className="font-lato text-sm tracking-[2px] text-[#8b8680] uppercase">Luxury Experience</span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="font-playfair text-5xl lg:text-6xl leading-[1.1] text-[#2c2416] mb-6">
                Curated Itineraries
              </h1>
              <p className="font-lora text-lg text-[#8b8680] leading-relaxed">
                Discover expertly crafted travel proposals designed for the discerning traveler. Each itinerary is meticulously tailored to create unforgettable luxury experiences at the world's finest destinations.
              </p>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link
                href="/concierge"
                className="group inline-flex items-center justify-center px-8 py-4 bg-black text-white font-lato font-semibold tracking-wide uppercase text-sm transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                Concierge Dashboard
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/proposals/1"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-black text-black font-lato font-semibold tracking-wide uppercase text-sm transition-all duration-300 hover:bg-black hover:text-white"
              >
                View Sample Proposal
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 lg:h-full min-h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8e4df] to-[#d4c5b9] rounded-lg overflow-hidden">
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <pattern id="luxury-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#luxury-pattern)" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex items-center justify-center text-center p-8">
                <div className="space-y-6">
                  <div className="inline-block">
                    <p className="font-playfair text-6xl text-[#d4af37]">✦</p>
                  </div>
                  <h2 className="font-playfair text-3xl text-[#2c2416] leading-tight">
                    Bespoke Travel Solutions
                  </h2>
                  <p className="font-lora text-[#8b8680] text-sm max-w-xs mx-auto">
                    Exclusive access to the world's most coveted resorts and experiences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Curated Proposals",
              description: "Handpicked itineraries designed specifically for your preferences and lifestyle"
            },
            {
              title: "Seamless Planning",
              description: "From conception to confirmation, experience effortless luxury travel planning"
            },
            {
              title: "Concierge Support",
              description: "Dedicated expertise ensuring every detail exceeds your expectations"
            }
          ].map((feature, idx) => (
            <div key={idx} className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f8f8f8] border border-[#d4af37]">
                <span className="text-[#d4af37] font-playfair text-2xl">•</span>
              </div>
              <h3 className="font-playfair text-xl text-black">{feature.title}</h3>
              <p className="font-lora text-[#666666] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#f0f0f0] bg-[#f8f8f8] mt-32">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <p className="font-lora text-sm text-[#666666] mb-4">
            Crafted with precision for the discerning traveler
          </p>
          <div className="flex justify-center space-x-8 text-xs tracking-wide">
            <a href="#" className="text-[#666666] hover:text-[#d4af37] transition-colors">PRIVACY</a>
            <span className="text-[#d4af37]">•</span>
            <a href="#" className="text-[#666666] hover:text-[#d4af37] transition-colors">TERMS</a>
            <span className="text-[#d4af37]">•</span>
            <a href="#" className="text-[#666666] hover:text-[#d4af37] transition-colors">CONTACT</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
