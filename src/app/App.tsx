import "../styles/fonts.css";
import { useState } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { LoginScreen } from "./components/LoginScreen";
import { Sidebar } from "./components/Sidebar";
import { DashboardScreen } from "./components/DashboardScreen";
import { MinorAuthScreen } from "./components/MinorAuthScreen";
import { VehicleControlScreen } from "./components/VehicleControlScreen";
import { SAGPDIScreen } from "./components/SAGPDIScreen";
import { AccessibilityPanel } from "./components/AccessibilityPanel";

type Screen = "dashboard" | "menores" | "vehiculos" | "sagpdi";

const screenTitles: Record<Screen, string> = {
  dashboard: "Panel Principal",
  menores: "Tramitación de Menores",
  vehiculos: "Control Vehicular Internacional",
  sagpdi: "Revisión SAG / PDI",
};

function AppInner() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("aduana");
  const [screen, setScreen] = useState<Screen>("dashboard");
  const { isDark } = useTheme();

  function handleLogin(selectedRole: string) {
    setRole(selectedRole);
    setLoggedIn(true);
    setScreen("dashboard");
  }

  if (!loggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--background)", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <Sidebar
        activeScreen={screen}
        onNavigate={s => setScreen(s as Screen)}
        role={role}
        onLogout={() => setLoggedIn(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{
            background: "var(--card)",
            borderBottom: "1px solid var(--border)",
            minHeight: "48px",
          }}
        >
          {/* Left: breadcrumb */}
          <div className="flex items-center gap-3">
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>
              {screenTitles[screen]}
            </div>
            <div className="h-3 w-px" style={{ background: "var(--border)" }} />
            <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
              Complejo Fronterizo Los Libertadores · Región de Valparaíso
            </span>
          </div>

          {/* Right: status + controls */}
          <div className="flex items-center gap-3">
            {/* System status indicators */}
            <div className="flex items-center gap-3 mr-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#16A34A" }} />
                <span style={{ fontSize: "10px", color: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}>
                  ADUANA-AR: OK
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#16A34A" }} />
                <span style={{ fontSize: "10px", color: "var(--muted-foreground)", fontFamily: "JetBrains Mono, monospace" }}>
                  INTERPOL: OK
                </span>
              </div>
              <div
                className="px-2.5 py-1 rounded"
                style={{ background: isDark ? "rgba(251,191,36,0.12)" : "#FEF3C7", border: "1px solid #FCD34D" }}
              >
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#92400E" }}>
                  Turno: 14:00–22:00
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-5 w-px" style={{ background: "var(--border)" }} />

            {/* Accessibility button */}
            <AccessibilityPanel />
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-hidden flex">
          {screen === "dashboard" && <DashboardScreen />}
          {screen === "menores" && <MinorAuthScreen />}
          {screen === "vehiculos" && <VehicleControlScreen />}
          {screen === "sagpdi" && <SAGPDIScreen />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
