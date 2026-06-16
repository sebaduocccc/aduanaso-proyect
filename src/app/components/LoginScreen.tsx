import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, AlertTriangle, ChevronDown } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface LoginScreenProps {
  onLogin: (role: string) => void;
}

const roles = [
  { value: "aduana", label: "Oficial de Aduanas" },
  { value: "sag", label: "Inspector SAG" },
  { value: "pdi", label: "Agente PDI" },
  { value: "superadmin", label: "Super Administrador" },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isDark } = useTheme();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password || !role) {
      setError("Todos los campos son requeridos.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(role);
    }, 1200);
  }

  const bgGradient = isDark
    ? "linear-gradient(160deg, #060D18 0%, #0A1628 60%, #0F2040 100%)"
    : "linear-gradient(160deg, #0D1B2A 0%, #1B3A6B 60%, #1E4D8C 100%)";

  const cardBg = isDark ? "#0F2040" : "#FFFFFF";
  const cardBorder = isDark ? "rgba(59,130,246,0.15)" : "#E4EAF3";
  const inputBg = isDark ? "#162035" : "#F8FAFC";
  const inputBorder = isDark ? "rgba(59,130,246,0.2)" : "#D0D8E8";
  const inputFocusBorder = "#3B82F6";
  const inputColor = isDark ? "#E2E8F0" : "#0D1B2A";
  const labelColor = isDark ? "#7BA7CC" : "#5A6A82";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bgGradient }}>
      {/* Security banner */}
      <div className="w-full py-2 px-6 flex items-center gap-2" style={{ background: "#C8102E" }}>
        <AlertTriangle size={14} color="#fff" />
        <span style={{ color: "#fff", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
          ACCESO RESTRINGIDO — SOLO CUENTAS AUTORIZADAS OFICIALMENTE. EL USO NO AUTORIZADO ES UN DELITO PENAL.
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Institutional header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-5">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-white/30"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <Shield size={32} color="#fff" />
              </div>
            </div>
            <div style={{ color: "#A8C4E0", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em" }}>
              REPÚBLICA DE CHILE
            </div>
            <h1 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 700, lineHeight: 1.3, marginTop: "4px" }}>
              Servicio Nacional de Aduanas
            </h1>
            <p style={{ color: "#7BA7CC", fontSize: "12px", marginTop: "4px" }}>
              Sistema Integrado de Control Fronterizo — Los Libertadores
            </p>
          </div>

          {/* Login card */}
          <div
            className="rounded"
            style={{
              background: cardBg,
              boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.7)" : "0 24px 64px rgba(0,0,0,0.4)",
              border: isDark ? `1px solid ${cardBorder}` : "none",
            }}
          >
            {/* Card header */}
            <div className="px-8 py-5" style={{ borderBottom: `1px solid ${cardBorder}` }}>
              <div className="flex items-center gap-2">
                <Lock size={14} color={isDark ? "#3B82F6" : "#1B3A6B"} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: isDark ? "#3B82F6" : "#1B3A6B", letterSpacing: "0.05em" }}>
                  AUTENTICACIÓN SEGURA
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-7">
              {error && (
                <div className="mb-4 px-3 py-2 rounded flex items-center gap-2" style={{ background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
                  <AlertTriangle size={13} color="#C8102E" />
                  <span style={{ fontSize: "12px", color: "#C8102E" }}>{error}</span>
                </div>
              )}

              <div className="mb-4">
                <label style={{ fontSize: "11px", fontWeight: 700, color: labelColor, letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>
                  USUARIO / CORREO INSTITUCIONAL
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="nombre.apellido@aduana.cl"
                  className="w-full px-3 py-2.5 rounded outline-none transition-all"
                  style={{ border: `1.5px solid ${inputBorder}`, background: inputBg, fontSize: "13px", color: inputColor }}
                  onFocus={e => (e.target.style.borderColor = inputFocusBorder)}
                  onBlur={e => (e.target.style.borderColor = inputBorder)}
                />
              </div>

              <div className="mb-4">
                <label style={{ fontSize: "11px", fontWeight: 700, color: labelColor, letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>
                  CONTRASEÑA
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2.5 rounded outline-none transition-all"
                    style={{ border: `1.5px solid ${inputBorder}`, background: inputBg, fontSize: "13px", color: inputColor, paddingRight: "42px" }}
                    onFocus={e => (e.target.style.borderColor = inputFocusBorder)}
                    onBlur={e => (e.target.style.borderColor = inputBorder)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: labelColor, background: "none", border: "none", cursor: "pointer" }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label style={{ fontSize: "11px", fontWeight: 700, color: labelColor, letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>
                  PERFIL DE ACCESO
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded outline-none appearance-none transition-all"
                    style={{ border: `1.5px solid ${inputBorder}`, background: inputBg, fontSize: "13px", color: role ? inputColor : labelColor }}
                  >
                    <option value="" disabled>Seleccionar perfil...</option>
                    {roles.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: labelColor }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded transition-all"
                style={{
                  background: loading ? "#5A6A82" : (isDark ? "#3B82F6" : "#1B3A6B"),
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  cursor: loading ? "not-allowed" : "pointer",
                  border: "none",
                }}
              >
                {loading ? "VERIFICANDO CREDENCIALES..." : "INGRESAR AL SISTEMA"}
              </button>

              <div className="mt-4 text-center">
                <a href="#" style={{ fontSize: "12px", color: isDark ? "#3B82F6" : "#2563EB", textDecoration: "none" }}>
                  ¿Olvidó su contraseña? Contactar TI
                </a>
              </div>
            </form>

            {/* Footer */}
            <div className="px-8 pb-5">
              <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: cardBorder }}>
                <span style={{ fontSize: "10px", color: "#9AAFCA", fontFamily: "JetBrains Mono, monospace" }}>
                  TLS 1.3 · AES-256 · SICF v3.2.1
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#16A34A" }} />
                  <span style={{ fontSize: "10px", color: labelColor }}>Conexión Segura</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center mt-6" style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
            © 2026 Servicio Nacional de Aduanas de Chile — Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
