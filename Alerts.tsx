import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AlertTriangle, Bell } from "lucide-react";

export default function Alerts() {
  const alerts = [
    {
      type: "critical",
      title: "Borewell Failure Risk",
      location: "Sector 12, Well #45",
      message: "Water level critically low. Immediate action recommended.",
      time: "2 hours ago",
    },
    {
      type: "warning",
      title: "Water Quality Alert",
      location: "Community Park Well",
      message: "pH levels outside safe range. Testing recommended.",
      time: "5 hours ago",
    },
    {
      type: "info",
      title: "Monsoon Forecast",
      location: "Your Area",
      message: "Heavy rainfall expected next week. Prepare recharge systems.",
      time: "1 day ago",
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 drop-shadow-lg [text-shadow:_1px_1px_2px_rgb(255_255_255_/_50%)]">
                  Alerts & Notifications
                </h1>
                <p className="text-slate-700 mt-2 drop-shadow-sm">
                  Real-time warnings and updates about water resources
                </p>
              </div>
              <Bell className="h-8 w-8 text-cyan-600" />
            </div>
          </header>

          <div className="space-y-4">
            {alerts.map((alert, idx) => (
              <Card
                key={idx}
                className={`border-l-4 ${
                  alert.type === "critical"
                    ? "border-l-red-500 bg-red-50"
                    : alert.type === "warning"
                    ? "border-l-amber-500 bg-amber-50"
                    : "border-l-blue-500 bg-blue-50"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {alert.type !== "info" && (
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              alert.type === "critical"
                                ? "text-red-600"
                                : "text-amber-600"
                            }`}
                          />
                        )}
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                      </div>
                      <CardDescription className="text-slate-700">
                        {alert.location}
                      </CardDescription>
                    </div>
                    <span className="text-sm text-slate-500">{alert.time}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{alert.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications (coming soon)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <span className="text-green-600 font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Alerts</span>
                  <span className="text-slate-400">Disabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Voice Alerts (Tamil)</span>
                  <span className="text-slate-400">Coming Soon</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
