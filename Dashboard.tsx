import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuth } from "../utils/auth";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Droplets,
  Map,
  Battery,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const dashboardCards = [
    {
      title: "Water Health Score",
      description: "Current water sustainability index",
      value: "72/100",
      icon: Activity,
      link: "/score",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "30-Day Forecast",
      description: "Predicted groundwater levels",
      value: "Stable",
      icon: TrendingUp,
      link: "/forecast",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Recharge Zones",
      description: "Recommended locations",
      value: "12 nearby",
      icon: Droplets,
      link: "/recharge",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Borewell Alerts",
      description: "Failure risk warnings",
      value: "2 high-risk",
      icon: AlertTriangle,
      link: "/alerts",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Community Map",
      description: "Interactive water resource map",
      value: "84 wells",
      icon: Map,
      link: "/map",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Usage Tracker",
      description: "Water consumption insights",
      value: "24.5 kL",
      icon: Battery,
      link: "/score",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
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
          <div className="mb-8 backdrop-blur-sm bg-white/20 p-6 rounded-xl border border-black shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800 drop-shadow-lg [text-shadow:_1px_1px_2px_rgb(255_255_255_/_50%)]">
              Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
            </h1>
            <p className="text-slate-700 mt-2 drop-shadow-md bg-white/30 inline-block px-4 py-2 rounded-lg backdrop-blur-sm [text-shadow:_1px_1px_2px_rgb(255_255_255_/_40%)]">
              Here's your water resource overview for today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} to={card.link}>
                  <Card className="hover:shadow-lg transition cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {card.title}
                          </CardTitle>
                          <CardDescription>{card.description}</CardDescription>
                        </div>
                        <div className={`p-2 rounded-lg ${card.bgColor}`}>
                          <Icon className={`h-6 w-6 ${card.color}`} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-2xl font-bold ${card.color}`}>
                        {card.value}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-6 text-white backdrop-blur-sm bg-white/10 border border-black">
            <h2 className="text-xl font-semibold mb-2">💡 Today's Water Tip</h2>
            <p>
              Consider collecting rainwater during the upcoming monsoon season.
              Even a small 500 sq ft roof can harvest 300+ liters per inch of
              rainfall!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
