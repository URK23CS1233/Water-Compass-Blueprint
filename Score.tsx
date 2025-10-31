import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Activity } from "lucide-react";

export default function Score() {
  const scoreBreakdown = [
    { category: "Water Quality", score: 78, color: "bg-green-500" },
    { category: "Groundwater Level", score: 65, color: "bg-yellow-500" },
    { category: "Recharge Activity", score: 82, color: "bg-green-500" },
    { category: "Usage Efficiency", score: 70, color: "bg-yellow-500" },
  ];

  const overallScore = Math.round(
    scoreBreakdown.reduce((sum, item) => sum + item.score, 0) /
      scoreBreakdown.length
  );

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
              Water Health Score
            </h1>
            <p className="text-slate-700 mt-2 drop-shadow-md [text-shadow:_1px_1px_1px_rgb(255_255_255_/_40%)]">
              Comprehensive sustainability index for your community's water
              resources
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 flex flex-col items-center justify-center p-8">
              <Activity className="h-12 w-12 text-cyan-600 mb-4" />
              <div className="text-6xl font-bold text-cyan-600 mb-2">
                {overallScore}
              </div>
              <div className="text-xl text-slate-600">Overall Score</div>
              <p className="text-sm text-slate-500 mt-2 text-center">
                {overallScore >= 75
                  ? "Excellent"
                  : overallScore >= 60
                  ? "Good"
                  : "Needs Improvement"}
              </p>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              {scoreBreakdown.map((item, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.category}</CardTitle>
                    <CardDescription>Score: {item.score}/100</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full bg-slate-200 rounded-full h-4">
                      <div
                        className={`${item.color} h-4 rounded-full transition-all`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How to Improve Your Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start space-x-3">
                <span className="text-cyan-600">•</span>
                <p>
                  Increase rainwater harvesting in identified recharge zones
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-cyan-600">•</span>
                <p>
                  Monitor and reduce water consumption during peak usage hours
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-cyan-600">•</span>
                <p>Participate in community water quality testing programs</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
