import { Link } from "react-router-dom";
import hero from "/hero.jpeg";

function HeroSection() {
  return (
    <section className="bg-[#F7F5F0] py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className=" max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        <div className="grid items-center lg:gap-14 lg:grid-cols-2">
          
          {/* Left Content */}
          <div className="max-w-2xl order-2 lg:order-1">
            
            <span className="hidden lg:block items-center rounded-full border border-[#d8e4db] bg-white/70 px-4 py-1.5 text-sm font-medium tracking-wide text-[#2d7c5f] backdrop-blur">
              100% Organic Products
            </span>

            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-[#111111] sm:text-6xl lg:text-7xl">
              Pure Nature,
              <br />
              <span className="text-[#2d7c5f]">
                Carefully Delivered.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#6f6f6f] sm:text-lg">
              Thoughtfully sourced organic essentials crafted for a
              cleaner and healthier lifestyle.
            </p>

            <div className="mt-10 flex items-center gap-4 flex-wrap">
              
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl bg-[#2d7c5f] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#256b52]"
              >
                Shop Collection
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-xl border border-[#d7d7d7] bg-white px-7 py-3.5 text-sm font-medium text-[#1a1a1a] transition-all duration-300 hover:border-[#2d7c5f] hover:text-[#2d7c5f]"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative order-1 lg:order-2">
            
            {/* Background Blur Shape */}
            <div className="absolute -top-10 -right-10 h-72 w-72 rounded-full bg-[#dfeee6] blur-3xl opacity-70" />

            {/* Main Image Container */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/40 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur">
              
              <img
                src={hero}
                alt="Organic Products"
                className="h-full w-full object-cover"
              />

              {/* Floating Card */}
              <div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
                <p className="text-sm text-[#7a7a7a]">
                  Trusted by
                </p>
                <h4 className="text-xl font-semibold text-[#111111]">
                  12k+ Customers
                </h4>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;