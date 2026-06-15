import { useState } from "react";
import {
  Leaf, Shield, CheckCircle, XCircle, AlertCircle, ChevronDown,
  Dog, Package, FileText, Search, AlertTriangle, Info
} from "lucide-react";

type CheckStatus = "pending" | "clear" | "flagged";

interface CheckItem {
  id: string;
  label: string;
  desc: string;
  status: CheckStatus;
}

const initialSAGChecks: CheckItem[] = [
  { id: "carne", label: "Carnes y embutidos frescos", desc: "Prohibido sin certificado sanitario", status: "pending" },
  { id: "frutas", label: "Frutas, verduras y semillas", desc: "Sujeto a inspección fitosanitaria", status: "pending" },
  { id: "lacteos", label: "Productos lácteos no industriales", desc: "Prohibido sin certificado origen", status: "pending" },
  { id: "plantas", label: "Plantas vivas / material vegetal", desc: "Requiere permiso SENASAG", status: "pending" },
  { id: "suelo", label: "Tierra, compost o abono", desc: "Completamente prohibido", status: "pending" },
  { id: "animales_vivos", label: "Animales vivos (no mascotas)", desc: "Requiere guía de libre tránsito", status: "pending" },
];

const initialPDIChecks: CheckItem[] = [
  { id: "interpol", label: "Verificación Interpol", desc: "Búsqueda internacional de personas", status: "pending" },
  { id: "spo", label: "Sistema de Personas Observadas (SPO)", desc: "Base interna PDI Chile", status: "pending" },
  { id: "cautelar", label: "Medidas Cautelares Vigentes", desc: "Restricción de salida del país", status: "pending" },
  { id: "fraude", label: "Documentos Fraudulentos (SICOFRADE)", status: "pending", desc: "Detección de documentos falsificados" },
  { id: "condena", label: "Condenas Penales Internacionales", status: "pending", desc: "UNODC · Red RAAM" },
];

function StatusBadge({ status }: { status: CheckStatus }) {
  if (status === "clear") return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: "#F0FDF4", border: "1px solid #86EFAC" }}>
      <CheckCircle size={11} color="#16A34A" />
      <span style={{ fontSize: "10px", fontWeight: 700, color: "#15803D" }}>LIMPIO</span>
    </div>
  );
  if (status === "flagged") return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
      <AlertCircle size={11} color="#C8102E" />
      <span style={{ fontSize: "10px", fontWeight: 700, color: "#C8102E" }}>ALERTA</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
      <AlertCircle size={11} color="#D97706" />
      <span style={{ fontSize: "10px", fontWeight: 700, color: "#92400E" }}>PENDIENTE</span>
    </div>
  );
}

function CheckRow({ item, onUpdate }: { item: CheckItem; onUpdate: (status: CheckStatus) => void }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded transition-all"
      style={{
        border: `1px solid ${item.status === "clear" ? "#BBF7D0" : item.status === "flagged" ? "#FECACA" : "#E4EAF3"}`,
        background: item.status === "clear" ? "#F0FDF4" : item.status === "flagged" ? "#FEF2F2" : "#F8FAFC",
        marginBottom: "6px",
      }}
    >
      <div className="flex-1">
        <div style={{ fontSize: "12px", fontWeight: 600, color: "#0D1B2A" }}>{item.label}</div>
        <div style={{ fontSize: "10px", color: "#5A6A82", marginTop: "1px" }}>{item.desc}</div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={item.status} />
        <div className="flex gap-1">
          <button
            onClick={() => onUpdate("clear")}
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: item.status === "clear" ? "#16A34A" : "#E4EAF3", border: "none", cursor: "pointer" }}
            title="Marcar limpio"
          >
            <CheckCircle size={13} color={item.status === "clear" ? "#fff" : "#5A6A82"} />
          </button>
          <button
            onClick={() => onUpdate("flagged")}
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: item.status === "flagged" ? "#C8102E" : "#E4EAF3", border: "none", cursor: "pointer" }}
            title="Marcar alerta"
          >
            <AlertCircle size={13} color={item.status === "flagged" ? "#fff" : "#5A6A82"} />
          </button>
          <button
            onClick={() => onUpdate("pending")}
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: "#E4EAF3", border: "none", cursor: "pointer" }}
            title="Restablecer"
          >
            <XCircle size={13} color="#9AAFCA" />
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

  const sagClearCount = sagChecks.filter(c => c.status === "clear").length;
  const pdiClearCount = pdiChecks.filter(c => c.status === "clear").length;
  const hasFlagSAG = sagChecks.some(c => c.status === "flagged");
  const hasFlagPDI = pdiChecks.some(c => c.status === "flagged");

  function handlePDISearch() {
    if (!personSearch) return;
    setPdiResult(personSearch.toLowerCase().includes("ramos") ? "hit" : "clear");
  }

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ background: "#EEF1F6" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 style={{ color: "#0D1B2A", fontSize: "18px", fontWeight: 700 }}>Panel Unificado SAG / PDI</h1>
          <p style={{ color: "#5A6A82", fontSize: "12px", marginTop: "2px" }}>
            Módulo de revisión integrada · Control fitosanitario y verificación policial internacional
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ background: hasFlagSAG || hasFlagPDI ? "#FEF2F2" : "#F0FDF4", border: `1px solid ${hasFlagSAG || hasFlagPDI ? "#FECACA" : "#86EFAC"}` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: hasFlagSAG || hasFlagPDI ? "#C8102E" : "#16A34A" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: hasFlagSAG || hasFlagPDI ? "#C8102E" : "#15803D" }}>
              {hasFlagSAG || hasFlagPDI ? "ALERTAS ACTIVAS" : "SIN ALERTAS"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* SAG Section */}
        <div>
          {/* SAG header badge */}
          <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded" style={{ background: "#0D1B2A", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Leaf size={18} color="#4ADE80" />
            <div className="flex-1">
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}>
                SECCIÓN A — Servicio Agrícola y Ganadero (SAG)
              </div>
              <div style={{ fontSize: "10px", color: "#5A6A82" }}>Control fitosanitario y zoosanitario de frontera</div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#4ADE80" }}>
              {sagClearCount}/{sagChecks.length}
            </div>
          </div>

          {/* Declaración Jurada */}
          <div className="rounded p-5 mb-4" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={14} color="#1B3A6B" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A" }}>Declaración Jurada (DJ)</span>
              </div>
              <div className="flex gap-1.5">
                {[
                  { val: "signed", label: "Firmada", color: "#16A34A", bg: "#F0FDF4" },
                  { val: "refused", label: "Se Niega", color: "#C8102E", bg: "#FEF2F2" },
                  { val: "pending", label: "Pendiente", color: "#D97706", bg: "#FFFBEB" },
                ].map(b => (
                  <button
                    key={b.val}
                    onClick={() => setDjStatus(b.val as any)}
                    className="px-2.5 py-1 rounded"
                    style={{
                      background: djStatus === b.val ? b.bg : "#F8FAFC",
                      border: `1.5px solid ${djStatus === b.val ? b.color : "#E4EAF3"}`,
                      color: djStatus === b.val ? b.color : "#9AAFCA",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            <p style={{ fontSize: "11px", color: "#5A6A82" }}>
              El pasajero declara bajo juramento no transportar productos de origen animal o vegetal prohibidos por la normativa SAG vigente.
            </p>
            {djStatus === "refused" && (
              <div className="mt-2 px-3 py-2 rounded flex items-center gap-2" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                <AlertTriangle size={12} color="#C8102E" />
                <span style={{ fontSize: "11px", color: "#C8102E", fontWeight: 600 }}>Requiere inspección física obligatoria de equipaje.</span>
              </div>
            )}
          </div>

          {/* SAG checklist */}
          <div className="rounded p-5 mb-4" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A", marginBottom: "12px" }}>
              LISTADO DE PRODUCTOS PROHIBIDOS
            </div>
            {sagChecks.map((item, i) => (
              <CheckRow
                key={item.id}
                item={item}
                onUpdate={s => setSagChecks(prev => prev.map((c, idx) => idx === i ? { ...c, status: s } : c))}
              />
            ))}
          </div>

          {/* Pet module */}
          <div className="rounded p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Dog size={14} color="#1B3A6B" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A" }}>Ingreso de Mascotas</span>
              </div>
              <button
                onClick={() => setPetPresent(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded"
                style={{
                  background: petPresent ? "#1B3A6B" : "#F8FAFC",
                  border: `1.5px solid ${petPresent ? "#1B3A6B" : "#D0D8E8"}`,
                  color: petPresent ? "#fff" : "#5A6A82",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {petPresent ? "✓ Declarada" : "Sin Mascota"}
              </button>
            </div>

            {petPresent && (
              <div>
                <div className="mb-3">
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A82", marginBottom: "5px" }}>EDAD DEL ANIMAL (meses)</div>
                  <input
                    type="number"
                    value={petAge}
                    onChange={e => setPetAge(e.target.value)}
                    placeholder="Ej: 18 (min. 3 meses para ingreso)"
                    className="w-full px-3 py-2 rounded outline-none"
                    style={{ border: "1px solid #D0D8E8", background: "#F8FAFC", fontSize: "12px" }}
                  />
                  {petAge && parseInt(petAge) < 3 && (
                    <div className="mt-1 flex items-center gap-1" style={{ color: "#C8102E", fontSize: "10px" }}>
                      <AlertTriangle size={10} /> Animal menor a 3 meses — INGRESO NO PERMITIDO
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A82", marginBottom: "5px" }}>RESPONSABLE LEGAL</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPetOwnerAdult(true)}
                      className="flex-1 py-2 rounded"
                      style={{ background: petOwnerAdult ? "#EEF4FF" : "#F8FAFC", border: `1.5px solid ${petOwnerAdult ? "#2563EB" : "#E4EAF3"}`, color: petOwnerAdult ? "#1B3A6B" : "#5A6A82", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                    >
                      Adulto ≥18 años
                    </button>
                    <button
                      onClick={() => setPetOwnerAdult(false)}
                      className="flex-1 py-2 rounded"
                      style={{ background: !petOwnerAdult ? "#FFF7ED" : "#F8FAFC", border: `1.5px solid ${!petOwnerAdult ? "#D97706" : "#E4EAF3"}`, color: !petOwnerAdult ? "#92400E" : "#5A6A82", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                    >
                      Representante Legal (Menor)
                    </button>
                  </div>
                  {!petOwnerAdult && (
                    <div className="mt-2 px-3 py-2 rounded flex items-center gap-2" style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}>
                      <Info size={12} color="#D97706" />
                      <span style={{ fontSize: "10px", color: "#92400E" }}>Completar por representante legal. Adjuntar poder notarial de tutor.</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  {[
                    { label: "Vacuna antirrábica vigente", val: petVacuna, setter: setPetVacuna },
                    { label: "Microchip ISO 11784/11785", val: petChip, setter: setPetChip },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => item.setter(v => !v)}
                      className="flex-1 flex items-center gap-2 px-3 py-2 rounded"
                      style={{
                        background: item.val ? "#F0FDF4" : "#F8FAFC",
                        border: `1.5px solid ${item.val ? "#86EFAC" : "#E4EAF3"}`,
                        cursor: "pointer",
                      }}
                    >
                      <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: item.val ? "#16A34A" : "#E4EAF3" }}>
                        {item.val && <CheckCircle size={12} color="#fff" />}
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: 600, color: item.val ? "#15803D" : "#5A6A82" }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PDI Section */}
        <div>
          {/* PDI header badge */}
          <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded" style={{ background: "#1B3A6B", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Shield size={18} color="#A8C4E0" />
            <div className="flex-1">
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}>
                SECCIÓN B — Policía de Investigaciones de Chile (PDI)
              </div>
              <div style={{ fontSize: "10px", color: "#7BA7CC" }}>Control migratorio e internacional de personas</div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#A8C4E0" }}>
              {pdiClearCount}/{pdiChecks.length}
            </div>
          </div>

          {/* Quick search */}
          <div className="rounded p-5 mb-4" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A", marginBottom: "10px" }}>
              CONSULTA RÁPIDA — BASES POLICIALES
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="RUT, pasaporte o nombre completo..."
                value={personSearch}
                onChange={e => setPersonSearch(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded outline-none"
                style={{ border: "1.5px solid #D0D8E8", background: "#F8FAFC", fontSize: "12px" }}
              />
              <button
                onClick={handlePDISearch}
                className="flex items-center gap-2 px-4 py-2 rounded"
                style={{ background: "#1B3A6B", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", border: "none" }}
              >
                <Search size={13} /> Consultar
              </button>
            </div>
            {pdiResult && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded"
                style={{
                  background: pdiResult === "clear" ? "#F0FDF4" : "#FEF2F2",
                  border: `1px solid ${pdiResult === "clear" ? "#86EFAC" : "#FECACA"}`,
                }}
              >
                {pdiResult === "clear" ? (
                  <><CheckCircle size={18} color="#16A34A" />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#15803D" }}>SIN REGISTROS POLICIALES</div>
                      <div style={{ fontSize: "10px", color: "#166534" }}>Verificado en: Interpol · SPO · SICOFRADE · UNODC</div>
                    </div></>
                ) : (
                  <><AlertCircle size={18} color="#C8102E" />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#C8102E" }}>COINCIDENCIA DETECTADA</div>
                      <div style={{ fontSize: "10px", color: "#991B1B" }}>Notificar a Jefatura de Turno inmediatamente · Ref: PDI-{Date.now().toString().slice(-5)}</div>
                    </div></>
                )}
              </div>
            )}
          </div>

          {/* PDI checklist */}
          <div className="rounded p-5 mb-4" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A", marginBottom: "12px" }}>
              VERIFICACIÓN POLICIAL INTERNACIONAL
            </div>
            {pdiChecks.map((item, i) => (
              <CheckRow
                key={item.id}
                item={item}
                onUpdate={s => setPDIChecks(prev => prev.map((c, idx) => idx === i ? { ...c, status: s } : c))}
              />
            ))}
          </div>

          {/* Final clearance */}
          <div className="rounded p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A", marginBottom: "12px" }}>
              HABILITACIÓN DE PASO — RESOLUCIÓN CONJUNTA SAG/PDI
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="px-3 py-3 rounded" style={{ background: hasFlagSAG ? "#FEF2F2" : sagClearCount === sagChecks.length ? "#F0FDF4" : "#FFFBEB", border: `1px solid ${hasFlagSAG ? "#FECACA" : sagClearCount === sagChecks.length ? "#BBF7D0" : "#FDE68A"}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <Leaf size={13} color={hasFlagSAG ? "#C8102E" : sagClearCount === sagChecks.length ? "#16A34A" : "#D97706"} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#0D1B2A" }}>SAG</span>
                </div>
                <div style={{ fontSize: "10px", color: "#5A6A82" }}>
                  {hasFlagSAG ? "Alerta detectada" : sagClearCount === sagChecks.length ? "Control aprobado" : `${sagClearCount}/${sagChecks.length} revisados`}
                </div>
              </div>
              <div className="px-3 py-3 rounded" style={{ background: hasFlagPDI ? "#FEF2F2" : pdiClearCount === pdiChecks.length ? "#F0FDF4" : "#FFFBEB", border: `1px solid ${hasFlagPDI ? "#FECACA" : pdiClearCount === pdiChecks.length ? "#BBF7D0" : "#FDE68A"}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={13} color={hasFlagPDI ? "#C8102E" : pdiClearCount === pdiChecks.length ? "#16A34A" : "#D97706"} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#0D1B2A" }}>PDI</span>
                </div>
                <div style={{ fontSize: "10px", color: "#5A6A82" }}>
                  {hasFlagPDI ? "Alerta detectada" : pdiClearCount === pdiChecks.length ? "Control aprobado" : `${pdiClearCount}/${pdiChecks.length} verificados`}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                disabled={hasFlagSAG || hasFlagPDI}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded"
                style={{
                  background: hasFlagSAG || hasFlagPDI ? "#9CA3AF" : "#16A34A",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: hasFlagSAG || hasFlagPDI ? "not-allowed" : "pointer",
                  border: "none",
                }}
              >
                <CheckCircle size={14} />
                HABILITAR PASO
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded"
                style={{ background: "#C8102E", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", border: "none" }}
              >
                <AlertTriangle size={14} />
                RETENER / DERIVAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
