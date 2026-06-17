import { useState } from "react";
import {
  User, Upload, CheckCircle, XCircle, AlertTriangle,
  FileText, Shield, AlertCircle, Info, Search,
} from "lucide-react";

type TravelScenario = "solo" | "third_party" | "one_parent" | "both_parents" | "";
type AuthStatus = "verified" | "missing" | "pending" | "override";

interface DocStatus {
  label: string;
  status: AuthStatus;
}

const initialDocs: DocStatus[] = [
  { label: "Cédula de Identidad / Pasaporte Vigente", status: "pending" },
  { label: "Autorización Notarial (si aplica)", status: "pending" },
  { label: "Resolución Juzgado de Familia (si aplica)", status: "pending" },
];

const scenarioMap: Record<string, string> = {
  solo: "Viaja Solo / Con Tercero — Requiere Autorización Notarial de ambos padres o tutor legal",
  third_party: "Viaja con Tercero — Requiere Autorización Notarial de ambos padres o tutor legal",
  one_parent: "Viaja con Un Solo Progenitor — Requiere Autorización Notarial del progenitor ausente",
  both_parents: "Viaja con Ambos Progenitores — Sin requisito adicional de autorización",
};

const statusColors: Record<AuthStatus, { bg: string; border: string }> = {
  verified:  { bg: "rgba(22,163,74,0.08)",  border: "rgba(22,163,74,0.3)"  },
  missing:   { bg: "rgba(200,16,46,0.08)",  border: "rgba(200,16,46,0.3)"  },
  pending:   { bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.3)"  },
  override:  { bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.3)" },
};

function DocRow({ doc, onChange }: { doc: DocStatus; onChange: (s: AuthStatus) => void }) {
  const { bg, border } = statusColors[doc.status];
  const icons = {
    verified: <CheckCircle size={14} color="#16A34A" />,
    missing:  <XCircle size={14} color="#C8102E" />,
    pending:  <AlertCircle size={14} color="#D97706" />,
    override: <Shield size={14} color="#7C3AED" />,
  };
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded mb-2" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="flex items-center gap-2.5">
        {icons[doc.status]}
        <span style={{ fontSize: "12px", color: "var(--card-foreground)" }}>{doc.label}</span>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={doc.status}
          onChange={e => onChange(e.target.value as AuthStatus)}
          className="px-2 py-1 rounded outline-none"
          style={{ border: "1px solid var(--border)", fontSize: "11px", color: "var(--foreground)", background: "var(--input-background)" }}
        >
          <option value="pending">Pendiente</option>
          <option value="verified">Verificado</option>
          <option value="missing">Faltante</option>
          <option value="override">Autorización Juzgado</option>
        </select>
        <button className="flex items-center gap-1 px-2 py-1 rounded" style={{ background: "var(--muted)", border: "none", cursor: "pointer", fontSize: "10px", color: "var(--foreground)" }}>
          <Upload size={10} /> Ver
        </button>
      </div>
    </div>
  );
}

export function MinorAuthScreen() {
  const [scenario, setScenario] = useState<TravelScenario>("");
  const [docs, setDocs] = useState<DocStatus[]>(initialDocs);
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [passportNum, setPassportNum] = useState("");
  const [override, setOverride] = useState(false);
  const [searched, setSearched] = useState(false);
  const [approved, setApproved] = useState(false);

  const needsNotarial = scenario === "solo" || scenario === "third_party" || scenario === "one_parent";
  const allVerified = docs.every(d => d.status === "verified" || d.status === "override");

  function handleSearch() {
    if (!rut) return;
    setSearched(true);
    setNombre("Martínez Vega, Sofía Isabel");
    setEdad("14");
    setPassportNum("P-CL-4483921");
  }

  function updateDoc(i: number, s: AuthStatus) {
    setDocs(prev => prev.map((d, idx) => idx === i ? { ...d, status: s } : d));
  }

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 700 }}>Tramitación de Menores de Edad</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
            Módulo de autorización para viajeros menores de 18 años · Art. 49 Ley N° 16.618
          </p>
        </div>
        <div className="px-3 py-1.5 rounded" style={{ background: "rgba(217,119,6,0.12)", border: "1px solid rgba(217,119,6,0.4)" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#D97706" }}>⚠ PROTOCOLO MENORES ACTIVO</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Left */}
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="rounded p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px", letterSpacing: "0.03em" }}>
              IDENTIFICACIÓN DEL PASAJERO
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Ingresar RUT o N° Pasaporte..."
                value={rut}
                onChange={e => setRut(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded outline-none"
                style={{ border: "1px solid var(--border)", background: "var(--input-background)", fontSize: "12px", color: "var(--foreground)" }}
              />
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-4 py-2 rounded"
                style={{ background: "#1B3A6B", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", border: "none" }}
              >
                <Search size={13} /> Consultar
              </button>
            </div>

            {searched && (
              <div className="rounded p-4" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: "var(--muted)" }}>
                    <User size={20} color="#1B3A6B" />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{nombre}</div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
                      {[
                        ["RUT", rut.toUpperCase()],
                        ["Edad", `${edad} años`],
                        ["Pasaporte", passportNum],
                        ["Nacionalidad", "Chilena"],
                        ["F. Nacimiento", "12/03/2012"],
                        ["Estado Civil", "Soltero/a (Menor)"],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <span style={{ fontSize: "9px", color: "var(--muted-foreground)", fontWeight: 700 }}>{k}: </span>
                          <span style={{ fontSize: "11px", color: "var(--foreground)", fontFamily: "JetBrains Mono, monospace" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded" style={{ background: "rgba(217,119,6,0.15)", border: "1px solid rgba(217,119,6,0.4)" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#D97706" }}>MENOR</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scenario selector */}
          <div className="rounded p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px" }}>
              ESCENARIO DE VIAJE
            </div>
            <div className="flex flex-col gap-2">
              {[
                { value: "both_parents", label: "Viaja con ambos progenitores", desc: "Padre y madre presentes" },
                { value: "one_parent",   label: "Viaja con un solo progenitor", desc: "Requiere autorización notarial del ausente", alert: true },
                { value: "third_party",  label: "Viaja con tercero (no progenitor)", desc: "Requiere autorización notarial de ambos padres", alert: true },
                { value: "solo",         label: "Viaja sin acompañante adulto", desc: "Requiere autorización notarial + compañía aérea", alert: true },
              ].map(s => (
                <button
                  key={s.value}
                  onClick={() => setScenario(s.value as TravelScenario)}
                  className="flex items-center justify-between px-4 py-3 rounded text-left transition-all"
                  style={{
                    border: `1.5px solid ${scenario === s.value ? "#2563EB" : "var(--border)"}`,
                    background: scenario === s.value ? "rgba(37,99,235,0.08)" : "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>{s.label}</span>
                      {s.alert && <AlertTriangle size={11} color="#D97706" />}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--muted-foreground)", marginTop: "1px" }}>{s.desc}</div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: scenario === s.value ? "#2563EB" : "var(--muted-foreground)" }}>
                    {scenario === s.value && <div className="w-2 h-2 rounded-full" style={{ background: "#2563EB" }} />}
                  </div>
                </button>
              ))}
            </div>

            {scenario && (
              <div className="mt-3 px-3 py-2 rounded flex items-start gap-2" style={{
                background: needsNotarial ? "rgba(217,119,6,0.08)" : "rgba(22,163,74,0.08)",
                border: `1px solid ${needsNotarial ? "rgba(217,119,6,0.3)" : "rgba(22,163,74,0.3)"}`,
              }}>
                <Info size={13} color={needsNotarial ? "#D97706" : "#16A34A"} style={{ marginTop: "1px" }} />
                <span style={{ fontSize: "11px", color: needsNotarial ? "#D97706" : "#16A34A" }}>{scenarioMap[scenario]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <div className="rounded p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px" }}>
              VERIFICACIÓN DOCUMENTAL
            </div>
            {docs.map((doc, i) => (
              <DocRow key={i} doc={doc} onChange={s => updateDoc(i, s)} />
            ))}

            {/* Override */}
            <div className="mt-4 px-4 py-3 rounded" style={{ border: "1.5px dashed rgba(124,58,237,0.4)", background: "rgba(124,58,237,0.05)" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield size={14} color="#7C3AED" />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#7C3AED" }}>Autorización Juzgado de Familia</span>
                </div>
                <button
                  onClick={() => setOverride(v => !v)}
                  className="px-3 py-1 rounded"
                  style={{
                    background: override ? "#7C3AED" : "rgba(124,58,237,0.1)",
                    color: override ? "#fff" : "#7C3AED",
                    fontSize: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1px solid rgba(124,58,237,0.3)",
                  }}
                >
                  {override ? "ACTIVO" : "ACTIVAR"}
                </button>
              </div>
              {override ? (
                <input type="text" placeholder="N° Resolución: RIT F-XXXX-XXXX" className="w-full px-3 py-2 rounded outline-none"
                  style={{ border: "1px solid rgba(124,58,237,0.3)", background: "var(--input-background)", fontSize: "11px", color: "var(--foreground)" }} />
              ) : (
                <p style={{ fontSize: "10px", color: "#8B5CF6" }}>Solo para casos donde existe disputa legal sobre la custodia del menor.</p>
              )}
            </div>
          </div>

          {/* Action panel */}
          <div className="rounded p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px" }}>
              RESOLUCIÓN FINAL
            </div>
            <div className="mb-4">
              <div style={{ fontSize: "10px", color: "var(--muted-foreground)", marginBottom: "4px" }}>Estado de verificación:</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full" style={{ background: "var(--muted)" }}>
                  <div className="h-2 rounded-full transition-all"
                    style={{
                      background: allVerified ? "#16A34A" : "#D97706",
                      width: `${(docs.filter(d => d.status === "verified" || d.status === "override").length / docs.length) * 100}%`,
                    }}
                  />
                </div>
                <span style={{ fontSize: "10px", fontFamily: "JetBrains Mono, monospace", color: "var(--muted-foreground)" }}>
                  {docs.filter(d => d.status === "verified" || d.status === "override").length}/{docs.length}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setApproved(true)}
                disabled={!allVerified}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded"
                style={{ background: allVerified ? "#16A34A" : "#9CA3AF", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: allVerified ? "pointer" : "not-allowed", border: "none" }}
              >
                <CheckCircle size={14} /> AUTORIZAR PASO
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded"
                style={{ background: "#C8102E", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", border: "none" }}>
                <XCircle size={14} /> DENEGAR
              </button>
            </div>
            {approved && (
              <div className="mt-3 px-3 py-2 rounded flex items-center gap-2" style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.35)" }}>
                <CheckCircle size={13} color="#16A34A" />
                <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: 600 }}>Paso autorizado · Folio: MEN-{Date.now().toString().slice(-6)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
