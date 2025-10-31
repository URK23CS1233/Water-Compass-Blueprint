import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/auth";
import Navbar from "./components/Navbar";
import ChatbotWidget from "./components/ChatbotWidget";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import Map from "./pages/Map";
import Recharge from "./pages/Recharge";
import Score from "./pages/Score";
import Alerts from "./pages/Alerts";

// Layout with Navbar and Chatbot
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <ChatbotWidget />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes without Navbar */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public demo routes - no authentication required */}
          <Route
            path="/dashboard"
            element={
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/forecast"
            element={
              <AuthenticatedLayout>
                <Forecast />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/map"
            element={
              <AuthenticatedLayout>
                <Map />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/recharge"
            element={
              <AuthenticatedLayout>
                <Recharge />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/score"
            element={
              <AuthenticatedLayout>
                <Score />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/alerts"
            element={
              <AuthenticatedLayout>
                <Alerts />
              </AuthenticatedLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
