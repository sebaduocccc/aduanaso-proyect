import { LayoutDashboard, Users, Car, Leaf, Search, LogOut, ChevronRight, Shield } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Panel Principal", icon: LayoutDashboard },
  { id: "menores", label: "Tramitación Menores", icon: Users },
  { id: "vehiculos", label: "Control Vehicular", icon: Car },
  { id: "sagpdi", label: "Revisión SAG / PDI", icon: Leaf },
];

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  role: string;
  onLogout: () => void;
}

const roleLabels: Record<string, { label: string; badge: string; color: string }> = {
  aduana: { label: "Oficial de Aduanas", badge: "ADU", color: "#2563EB" },
  sag: { label: "Inspector SAG", badge: "SAG", color: "#16A34A" },
  pdi: { label: "Agente PDI", badge: "PDI", color: "#7C3AED" },
  superadmin: { label: "Super Administrador", badge: "ADM", color: "#C8102E" },
};

export function Sidebar({ activeScreen, onNavigate, role, onLogout }: SidebarProps) {
  const roleInfo = roleLabels[role] || roleLabels["aduana"];
  const now = new Date();
  const timeStr = now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("es-CL", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        background: "#0D1B2A",
        width: "236px",
        minWidth: "236px",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo area */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-9 h-9 rounded" style={{ background: "#1B3A6B" }}>
            <Shield size={18} color="#A8C4E0" />
          </div>
          <div>
            <div style={{ color: "#FFFFFF", fontSize: "11px", fontWeight: 700, lineHeight: 1.2 }}>
              SNA Chile
            </div>
            <div style={{ color: "#5A6A82", fontSize: "9px", letterSpacing: "0.06em" }}>
              LOS LIBERTADORES
            </div>
          </div>
        </div>
        <div
          className="px-2 py-1.5 rounded flex items-center gap-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex items-center justify-center w-5 h-5 rounded"
            style={{ background: roleInfo.color, fontSize: "8px", color: "#fff", fontWeight: 700 }}
          >
            {roleInfo.badge}
          </div>
          <div>
            <div style={{ color: "#CBD5E1", fontSize: "10px", fontWeight: 600 }}>{roleInfo.label}</div>
            <div style={{ color: "#5A6A82", fontSize: "9px", fontFamily: "JetBrains Mono, monospace" }}>
              ID: A-{Math.floor(Math.random() * 9000) + 1000}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <div style={{ color: "#3D5470", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "8px", paddingLeft: "8px" }}>
          MÓDULOS PRINCIPALES
        </div>
        {navItems.map(item => {
          const active = activeScreen === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded mb-0.5 transition-all text-left"
              style={{
                background: active ? "#1B3A6B" : "transparent",
                borderLeft: active ? "2px solid #2563EB" : "2px solid transparent",
                color: active ? "#FFFFFF" : "#7B94B3",
                fontSize: "12px",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <Icon size={14} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {active && <ChevronRight size={12} />}
            </button>
          );
        })}

        <div style={{ color: "#3D5470", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "8px", marginTop: "20px", paddingLeft: "8px" }}>
          HERRAMIENTAS
        </div>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded mb-0.5 transition-all text-left"
          style={{ color: "#7B94B3", fontSize: "12px", cursor: "pointer", background: "transparent", border: "none" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Search size={14} />
          <span>Consulta de Personas</span>
        </button>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-3 py-2 rounded mb-2" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div style={{ color: "#5A6A82", fontSize: "9px", fontFamily: "JetBrains Mono, monospace" }}>
            {dateStr}
          </div>
          <div style={{ color: "#A8C4E0", fontSize: "13px", fontFamily: "JetBrains Mono, monospace", fontWeight: 500 }}>
            {timeStr}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#16A34A" }} />
            <span style={{ fontSize: "9px", color: "#5A6A82" }}>Sistema Operativo</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded transition-all"
          style={{ color: "#7B94B3", fontSize: "12px", cursor: "pointer", background: "transparent", border: "none" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,16,46,0.12)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={14} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
