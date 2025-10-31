import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Droplets } from "lucide-react";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: "url(/images/water-flow-home.gif)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Much lighter overlay to show water GIF clearly */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-blue-900/25 to-cyan-900/30"></div>

      {/* Very subtle overlay for text readability without hiding the animation */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-900/10"></div>

      {/* Content */}
      <div className="relative z-10">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center backdrop-blur-sm bg-white/5 rounded-lg mx-4 mt-4 border border-black">
          <div className="flex items-center space-x-2">
            <Droplets className="h-8 w-8 text-cyan-400 drop-shadow-lg" />
            <span className="text-xl font-bold text-white drop-shadow-lg [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
              Water Compass Blueprint
            </span>
          </div>
          <div className="space-x-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-white hover:text-cyan-300 hover:bg-white/20 backdrop-blur-sm border border-black [text-shadow:_1px_1px_2px_rgb(0_0_0_/_30%)]"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-xl border border-black [text-shadow:_1px_1px_2px_rgb(0_0_0_/_30%)]">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-2xl [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)]">
              Smart Water Forecasting for{" "}
              <span className="text-cyan-200 animate-pulse [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)]">
                Sustainable Communities
              </span>
            </h1>
            <p className="text-xl text-black max-w-2xl mx-auto drop-shadow-lg backdrop-blur-md bg-white/15 p-6 rounded-xl border border-black shadow-2xl [text-shadow:_1px_1px_2px_rgb(255_255_255_/_80%)]">
              Track groundwater levels, predict borewell failures, and get
              AI-powered insights to manage water resources effectively.
            </p>
            <div className="flex gap-4 justify-center pt-8 flex-wrap">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white shadow-xl"
                >
                  Try Demo Dashboard
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-white/10 text-white border-black hover:bg-white/20 backdrop-blur-sm"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-lg px-8 text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
            <div className="bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-black hover:bg-white/25 transition-all duration-300 hover:scale-105 hover:shadow-3xl">
              <div className="text-cyan-300 text-5xl mb-6 drop-shadow-lg">
                📊
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                30-Day Forecasts
              </h3>
              <p className="text-white/95 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_30%)]">
                AI-powered predictions for groundwater levels and rainfall
                patterns
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-black hover:bg-white/25 transition-all duration-300 hover:scale-105 hover:shadow-3xl">
              <div className="text-cyan-300 text-5xl mb-6 drop-shadow-lg">
                🗺️
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                Community Maps
              </h3>
              <p className="text-white/95 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_30%)]">
                Track borewells, recharge zones, and water quality in your area
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-black hover:bg-white/25 transition-all duration-300 hover:scale-105 hover:shadow-3xl">
              <div className="text-cyan-300 text-5xl mb-6 drop-shadow-lg">
                🤖
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">
                AI Assistant
              </h3>
              <p className="text-white/95 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_30%)]">
                Get instant answers about water conservation and sustainability
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
