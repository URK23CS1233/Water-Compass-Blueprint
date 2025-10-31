import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { MapPin } from "lucide-react";

export default function Map() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url(/images/water-spring-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Enhanced overlay for better content readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-slate-100/45 to-cyan-50/50"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 backdrop-blur-sm bg-white/25 p-6 rounded-xl border border-black shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800 drop-shadow-lg [text-shadow:_1px_1px_2px_rgb(255_255_255_/_50%)]">
              Community Water Map
            </h1>
            <p className="text-slate-700 mt-2 drop-shadow-md [text-shadow:_1px_1px_1px_rgb(255_255_255_/_40%)]">
              Interactive map of borewells, recharge zones, and water quality
              indicators
            </p>
          </header>

          <Card className="h-[500px] flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <MapPin className="h-16 w-16 mx-auto text-slate-400 mb-4" />
              <CardTitle className="text-xl text-slate-600 mb-2">
                Map Integration
              </CardTitle>
              <CardDescription className="max-w-md">
                Integrate Leaflet.js or Google Maps here to show interactive
                community water resource locations. Add markers for borewells,
                recharge zones, and water quality data points.
              </CardDescription>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Borewells</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-cyan-600">84</p>
                <p className="text-sm text-slate-600 mt-2">In your community</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recharge Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">12</p>
                <p className="text-sm text-slate-600 mt-2">
                  Recommended locations
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quality Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">156</p>
                <p className="text-sm text-slate-600 mt-2">
                  Tests conducted this year
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
