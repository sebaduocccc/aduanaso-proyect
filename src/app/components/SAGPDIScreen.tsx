import { useState } from "react";
import {
  Leaf, Shield, CheckCircle, XCircle, AlertCircle,
  Dog, FileText, Search, AlertTriangle, Info,
} from "lucide-react";

type CheckStatus = "pending" | "clear" | "flagged";

interface CheckItem {
  id: string;
  label: string;
  desc: string;
  status: CheckStatus;
}

const initialSAGChecks: CheckItem[] = [
  { id: "carne",       label: "Carnes y embutidos frescos",         desc: "Prohibido sin certificado sanitario",    status: "pending" },
  { id: "frutas",      label: "Frutas, verduras y semillas",        desc: "Sujeto a inspección fitosanitaria",      status: "pending" },
  { id: "lacteos",     label: "Productos lácteos no industriales",  desc: "Prohibido sin certificado origen",       status: "pending" },
  { id: "plantas",     label: "Plantas vivas / material vegetal",   desc: "Requiere permiso SENASAG",               status: "pending" },
  { id: "suelo",       label: "Tierra, compost o abono",            desc: "Completamente prohibido",                status: "pending" },
  { id: "animales",    label: "Animales vivos (no mascotas)",        desc: "Requiere guía de libre tránsito",        status: "pending" },
];

const initialPDIChecks: CheckItem[] = [
  { id: "interpol",   label: "Verificación Interpol",                  desc: "Búsqueda internacional de personas",       status: "pending" },
  { id: "spo",        label: "Sistema de Personas Observadas (SPO)",   desc: "Base interna PDI Chile",                   status: "pending" },
  { id: "cautelar",   label: "Medidas Cautelares Vigentes",            desc: "Restricción de salida del país",           status: "pending" },
  { id: "fraude",     label: "Documentos Fraudulentos (SICOFRADE)",    desc: "Detección de documentos falsificados",     status: "pending" },
  { id: "condena",    label: "Condenas Penales Internacionales",       desc: "UNODC · Red RAAM",                         status: "pending" },
];

function StatusBadge({ status }: { status: CheckStatus }) {
  if (status === "clear")   return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.35)" }}><CheckCircle size={11} color="#16A34A" /><span style={{ fontSize: "10px", fontWeight: 700, color: "#16A34A" }}>LIMPIO</span></div>;
  if (status === "flagged") return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: "rgba(200,16,46,0.1)", border: "1px solid rgba(200,16,46,0.35)" }}><AlertCircle size={11} color="#C8102E" /><span style={{ fontSize: "10px", fontWeight: 700, color: "#C8102E" }}>ALERTA</span></div>;
  return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.35)" }}><AlertCircle size={11} color="#D97706" /><span style={{ fontSize: "10px", fontWeight: 700, color: "#D97706" }}>PENDIENTE</span></div>;
}

function CheckRow({ item, onUpdate }: { item: CheckItem; onUpdate: (s: CheckStatus) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded mb-1.5 transition-all"
      style={{
        border: `1px solid ${item.status === "clear" ? "rgba(22,163,74,0.3)" : item.status === "flagged" ? "rgba(200,16,46,0.3)" : "var(--border)"}`,
        background: item.status === "clear" ? "rgba(22,163,74,0.05)" : item.status === "flagged" ? "rgba(200,16,46,0.05)" : "var(--muted)",
      }}
    >
      <div className="flex-1">
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>{item.label}</div>
        <div style={{ fontSize: "10px", color: "var(--muted-foreground)", marginTop: "1px" }}>{item.desc}</div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={item.status} />
        <div className="flex gap-1">
          <button onClick={() => onUpdate("clear")} className="w-7 h-7 rounded flex items-center justify-center" title="Marcar limpio"
            style={{ background: item.status === "clear" ? "#16A34A" : "var(--muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
            <CheckCircle size={13} color={item.status === "clear" ? "#fff" : "var(--muted-foreground)"} />
          </button>
          <button onClick={() => onUpdate("flagged")} className="w-7 h-7 rounded flex items-center justify-center" title="Marcar alerta"
            style={{ background: item.status === "flagged" ? "#C8102E" : "var(--muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
            <AlertCircle size={13} color={item.status === "flagged" ? "#fff" : "var(--muted-foreground)"} />
          </button>
          <button onClick={() => onUpdate("pending")} className="w-7 h-7 rounded flex items-center justify-center" title="Restablecer"
            style={{ background: "var(--muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
            <XCircle size={13} color="var(--muted-foreground)" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SAGPDIScreen() {
  const [sagChecks, setSagChecks] = useState<CheckItem[]>(initialSAGChecks);
  const [pdiChecks, setPDIChecks] = useState<CheckItem[]>(initialPDIChecks);
  const [djStatus, setDjStatus] = useState<"pending" | "signed" | "refused">("pending");
  const [petPresent, setPetPresent] = useState(false);
  const [petAge, setPetAge] = useState("");
  const [petVacuna, setPetVacuna] = useState(false);
  const [petChip, setPetChip] = useState(false);
  const [petOwnerAdult, setPetOwnerAdult] = useState(true);
  const [personSearch, setPersonSearch] = useState("");
  const [pdiResult, setPdiResult] = useState<null | "clear" | "hit">(null);

  const sagClearCount  = sagChecks.filter(c => c.status === "clear").length;
  const pdiClearCount  = pdiChecks.filter(c => c.status === "clear").length;
  const hasFlagSAG = sagChecks.some(c => c.status === "flagged");
  const hasFlagPDI = pdiChecks.some(c => c.status === "flagged");
  const anyFlag    = hasFlagSAG || hasFlagPDI;

  function handlePDISearch() {
    if (!personSearch) return;
    setPdiResult(personSearch.toLowerCase().includes("ramos") ? "hit" : "clear");
  }

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 700 }}>Panel Unificado SAG / PDI</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginTop: "2px" }}>
            Módulo de revisión integrada · Control fitosanitario y verificación policial internacional
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded"
          style={{ background: anyFlag ? "rgba(200,16,46,0.1)" : "rgba(22,163,74,0.1)", border: `1px solid ${anyFlag ? "rgba(200,16,46,0.35)" : "rgba(22,163,74,0.35)"}` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: anyFlag ? "#C8102E" : "#16A34A" }} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: anyFlag ? "#C8102E" : "#16A34A" }}>
            {anyFlag ? "ALERTAS ACTIVAS" : "SIN ALERTAS"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* SAG Section */}
        <div>
          <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded" style={{ background: "var(--sidebar)", border: "1px solid var(--sidebar-border)" }}>
            <Leaf size={18} color="#4ADE80" />
            <div className="flex-1">
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}>SECCIÓN A — Servicio Agrícola y Ganadero (SAG)</div>
              <div style={{ fontSize: "10px", color: "var(--sidebar-foreground)" }}>Control fitosanitario y zoosanitario de frontera</div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#4ADE80" }}>{sagClearCount}/{sagChecks.length}</div>
          </div>

          {/* DJ */}
          <div className="rounded p-5 mb-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={14} color="#2563EB" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)" }}>Declaración Jurada (DJ)</span>
              </div>
              <div className="flex gap-1.5">
                {[
                  { val: "signed",  label: "Firmada",  color: "#16A34A", bg: "rgba(22,163,74,0.1)"  },
                  { val: "refused", label: "Se Niega", color: "#C8102E", bg: "rgba(200,16,46,0.1)"  },
                  { val: "pending", label: "Pendiente",color: "#D97706", bg: "rgba(217,119,6,0.1)"  },
                ].map(b => (
                  <button key={b.val} onClick={() => setDjStatus(b.val as any)} className="px-2.5 py-1 rounded"
                    style={{ background: djStatus === b.val ? b.bg : "var(--muted)", border: `1.5px solid ${djStatus === b.val ? b.color : "var(--border)"}`, color: djStatus === b.val ? b.color : "var(--muted-foreground)", fontSize: "10px", fontWeight: 700, cursor: "pointer" }}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
              El pasajero declara bajo juramento no transportar productos de origen animal o vegetal prohibidos por la normativa SAG vigente.
            </p>
            {djStatus === "refused" && (
              <div className="mt-2 px-3 py-2 rounded flex items-center gap-2" style={{ background: "rgba(200,16,46,0.08)", border: "1px solid rgba(200,16,46,0.3)" }}>
                <AlertTriangle size={12} color="#C8102E" />
                <span style={{ fontSize: "11px", color: "#C8102E", fontWeight: 600 }}>Requiere inspección física obligatoria de equipaje.</span>
              </div>
            )}
          </div>

          {/* SAG checklist */}
          <div className="rounded p-5 mb-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px" }}>LISTADO DE PRODUCTOS PROHIBIDOS</div>
            {sagChecks.map((item, i) => (
              <CheckRow key={item.id} item={item} onUpdate={s => setSagChecks(prev => prev.map((c, idx) => idx === i ? { ...c, status: s } : c))} />
            ))}
          </div>

          {/* Pet module */}
          <div className="rounded p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Dog size={14} color="#2563EB" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)" }}>Ingreso de Mascotas</span>
              </div>
              <button onClick={() => setPetPresent(v => !v)} className="flex items-center gap-2 px-3 py-1.5 rounded"
                style={{ background: petPresent ? "#1B3A6B" : "var(--muted)", border: `1.5px solid ${petPresent ? "#1B3A6B" : "var(--border)"}`, color: petPresent ? "#fff" : "var(--muted-foreground)", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                {petPresent ? "✓ Declarada" : "Sin Mascota"}
              </button>
            </div>
            {petPresent && (
              <div>
                <div className="mb-3">
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", marginBottom: "5px" }}>EDAD DEL ANIMAL (meses)</div>
                  <input type="number" value={petAge} onChange={e => setPetAge(e.target.value)} placeholder="Mín. 3 meses para ingreso"
                    className="w-full px-3 py-2 rounded outline-none"
                    style={{ border: "1px solid var(--border)", background: "var(--input-background)", fontSize: "12px", color: "var(--foreground)" }} />
                  {petAge && parseInt(petAge) < 3 && (
                    <div className="mt-1 flex items-center gap-1" style={{ color: "#C8102E", fontSize: "10px" }}>
                      <AlertTriangle size={10} /> Animal menor a 3 meses — INGRESO NO PERMITIDO
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", marginBottom: "5px" }}>RESPONSABLE LEGAL</div>
                  <div className="flex gap-2">
                    {[
                      { val: true,  label: "Adulto ≥18 años",         color: "#2563EB", bg: "rgba(37,99,235,0.08)"  },
                      { val: false, label: "Representante (Menor)",    color: "#D97706", bg: "rgba(217,119,6,0.08)"  },
                    ].map(opt => (
                      <button key={String(opt.val)} onClick={() => setPetOwnerAdult(opt.val)} className="flex-1 py-2 rounded"
                        style={{ background: petOwnerAdult === opt.val ? opt.bg : "var(--muted)", border: `1.5px solid ${petOwnerAdult === opt.val ? opt.color : "var(--border)"}`, color: petOwnerAdult === opt.val ? opt.color : "var(--muted-foreground)", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {!petOwnerAdult && (
                    <div className="mt-2 px-3 py-2 rounded flex items-center gap-2" style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.3)" }}>
                      <Info size={12} color="#D97706" />
                      <span style={{ fontSize: "10px", color: "#D97706" }}>Completar por representante legal. Adjuntar poder notarial de tutor.</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  {[
                    { label: "Vacuna antirrábica vigente",    val: petVacuna, setter: setPetVacuna },
                    { label: "Microchip ISO 11784/11785",     val: petChip,   setter: setPetChip   },
                  ].map(item => (
                    <button key={item.label} onClick={() => item.setter(v => !v)} className="flex-1 flex items-center gap-2 px-3 py-2 rounded"
                      style={{ background: item.val ? "rgba(22,163,74,0.08)" : "var(--muted)", border: `1.5px solid ${item.val ? "rgba(22,163,74,0.35)" : "var(--border)"}`, cursor: "pointer" }}>
                      <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: item.val ? "#16A34A" : "var(--muted)" }}>
                        {item.val && <CheckCircle size={12} color="#fff" />}
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: item.val ? "#16A34A" : "var(--muted-foreground)" }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PDI Section */}
        <div>
          <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded" style={{ background: "#1B3A6B", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Shield size={18} color="#A8C4E0" />
            <div className="flex-1">
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}>SECCIÓN B — Policía de Investigaciones (PDI)</div>
              <div style={{ fontSize: "10px", color: "#7BA7CC" }}>Control migratorio e internacional de personas</div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#A8C4E0" }}>{pdiClearCount}/{pdiChecks.length}</div>
          </div>

          {/* Quick search */}
          <div className="rounded p-5 mb-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)", marginBottom: "10px" }}>CONSULTA RÁPIDA — BASES POLICIALES</div>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="RUT, pasaporte o nombre completo..." value={personSearch} onChange={e => setPersonSearch(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded outline-none"
                style={{ border: "1px solid var(--border)", background: "var(--input-background)", fontSize: "12px", color: "var(--foreground)" }} />
              <button onClick={handlePDISearch} className="flex items-center gap-2 px-4 py-2 rounded"
                style={{ background: "#1B3A6B", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", border: "none" }}>
                <Search size={13} /> Consultar
              </button>
            </div>
            {pdiResult && (
              <div className="flex items-center gap-3 px-4 py-3 rounded"
                style={{ background: pdiResult === "clear" ? "rgba(22,163,74,0.08)" : "rgba(200,16,46,0.08)", border: `1px solid ${pdiResult === "clear" ? "rgba(22,163,74,0.35)" : "rgba(200,16,46,0.35)"}` }}>
                {pdiResult === "clear"
                  ? <><CheckCircle size={18} color="#16A34A" /><div><div style={{ fontSize: "13px", fontWeight: 700, color: "#16A34A" }}>SIN REGISTROS POLICIALES</div><div style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>Verificado: Interpol · SPO · SICOFRADE · UNODC</div></div></>
                  : <><AlertCircle size={18} color="#C8102E" /><div><div style={{ fontSize: "13px", fontWeight: 700, color: "#C8102E" }}>COINCIDENCIA DETECTADA</div><div style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>Notificar Jefatura · Ref: PDI-{Date.now().toString().slice(-5)}</div></div></>
                }
              </div>
            )}
          </div>

          {/* PDI checklist */}
          <div className="rounded p-5 mb-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px" }}>VERIFICACIÓN POLICIAL INTERNACIONAL</div>
            {pdiChecks.map((item, i) => (
              <CheckRow key={item.id} item={item} onUpdate={s => setPDIChecks(prev => prev.map((c, idx) => idx === i ? { ...c, status: s } : c))} />
            ))}
          </div>

          {/* Final clearance */}
          <div className="rounded p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)", marginBottom: "12px" }}>HABILITACIÓN DE PASO — RESOLUCIÓN CONJUNTA SAG/PDI</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "SAG", icon: Leaf,   flag: hasFlagSAG, count: sagClearCount, total: sagChecks.length },
                { label: "PDI", icon: Shield, flag: hasFlagPDI, count: pdiClearCount, total: pdiChecks.length },
              ].map(({ label, icon: Icon, flag, count, total }) => (
                <div key={label} className="px-3 py-3 rounded"
                  style={{ background: flag ? "rgba(200,16,46,0.07)" : count === total ? "rgba(22,163,74,0.07)" : "rgba(217,119,6,0.07)", border: `1px solid ${flag ? "rgba(200,16,46,0.3)" : count === total ? "rgba(22,163,74,0.3)" : "rgba(217,119,6,0.3)"}` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={13} color={flag ? "#C8102E" : count === total ? "#16A34A" : "#D97706"} />
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--foreground)" }}>{label}</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>
                    {flag ? "Alerta detectada" : count === total ? "Control aprobado" : `${count}/${total} revisados`}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button disabled={anyFlag} className="flex-1 flex items-center justify-center gap-2 py-3 rounded"
                style={{ background: anyFlag ? "#9CA3AF" : "#16A34A", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: anyFlag ? "not-allowed" : "pointer", border: "none" }}>
                <CheckCircle size={14} /> HABILITAR PASO
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded"
                style={{ background: "#C8102E", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", border: "none" }}>
                <AlertTriangle size={14} /> RETENER / DERIVAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
