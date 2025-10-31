import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Droplets } from "lucide-react";

export default function Recharge() {
  const rechargeZones = [
    {
      name: "Community Park",
      location: "Zone A",
      potential: "High",
      area: "2.5 acres",
    },
    {
      name: "School Ground",
      location: "Zone B",
      potential: "Medium",
      area: "1.8 acres",
    },
    {
      name: "Temple Pond",
      location: "Zone C",
      potential: "High",
      area: "0.8 acres",
    },
  ];

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
              Recharge Zones
            </h1>
            <p className="text-slate-700 mt-2 drop-shadow-md [text-shadow:_1px_1px_1px_rgb(255_255_255_/_40%)]">
              Recommended locations for groundwater recharge and rainwater
              harvesting
            </p>
          </header>

          <div className="grid gap-6">
            {rechargeZones.map((zone, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{zone.name}</CardTitle>
                      <CardDescription>{zone.location}</CardDescription>
                    </div>
                    <Droplets className="h-8 w-8 text-cyan-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">
                        Recharge Potential
                      </p>
                      <p
                        className={`font-semibold ${
                          zone.potential === "High"
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {zone.potential}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Area</p>
                      <p className="font-semibold text-slate-900">
                        {zone.area}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-cyan-50 border-black backdrop-blur-sm bg-white/80">
            <CardHeader>
              <CardTitle>💡 About Recharge Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                Recharge zones are areas where rainwater can be collected and
                allowed to percolate into the ground, replenishing groundwater
                levels. These locations are identified based on soil type,
                permeability, and existing infrastructure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
