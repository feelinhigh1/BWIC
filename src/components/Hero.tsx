import Link from "next/link";
import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center overflow-hidden mt-15">
      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3e%3cpath d='m 10 0 l 0 0 0 10' fill='none' stroke='white' stroke-width='0.5'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23grid)'/%3e%3c/svg%3e")`,
          animation: "gridMove 20s linear infinite",
        }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl opacity-10 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/5 w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl opacity-10 animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-fade-in-up">
          {/* Company Name */}
          <div className="text-blue-400 text-sm sm:text-base font-semibold mb-4 tracking-widest uppercase animate-slide-in-left">
            Blue Whale Investment
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-6 leading-tight animate-slide-in-right">
            Your Gateway to
            <br />
            <span className="text-blue-400">Blue Whale Investment</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-lg sm:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Discover exclusive real estate investment opportunities across
            residential, commercial, and luxury property markets. We specialize
            in high-yield properties with proven track records and exceptional
            growth potential.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-in-up">
            <Link href="/properties" className="group relative ">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
                <span className="relative z-10">Explore Properties</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </button>
            </Link>
          </div>

          {/* Stats Section */}
          {/* <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 animate-fade-in-up">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                $3.2B+
              </div>
              <div className="text-slate-400 text-sm uppercase tracking-wider">
                Property Portfolio Value
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                850+
              </div>
              <div className="text-slate-400 text-sm uppercase tracking-wider">
                Properties Managed
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                18%
              </div>
              <div className="text-slate-400 text-sm uppercase tracking-wider">
                Average ROI
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(10px, 10px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out 0.3s both;
        }

        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out 0.6s both;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out 0.9s both;
        }

        .animate-slide-in-up {
          animation: slide-in-up 1s ease-out 1.2s both;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
