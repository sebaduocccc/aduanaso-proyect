import { useState, useEffect } from "react";
import { Car, Printer, CheckCircle, AlertCircle, Globe, RefreshCw, Search, Calendar, Clock } from "lucide-react";

type VehicleType = "particular" | "diplomatico" | "";
type PlateType = "CD" | "CC" | "OI" | "PAT" | "REGULAR";

const DAYS_PARTICULAR = 180;
const DAYS_DIPLOMATICO = 90;

const dbStatus = [
  { label: "Aduana Argentina (AFIP)", status: "connected", latency: "42ms" },
  { label: "PDI — Vehículos Alertados", status: "connected", latency: "18ms" },
  { label: "Registro Civil Chile (SRCeI)", status: "connected", latency: "31ms" },
  { label: "Interpol — Vehículos Robados", status: "degraded", latency: "312ms" },
];

const recentVehicles = [
  { ppu: "RFKB-21", tipo: "Particular", pais: "AR", estado: "ok", hora: "17:51" },
  { ppu: "CC-0042", tipo: "Diplomático", pais: "US", estado: "ok", hora: "17:48" },
  { ppu: "BFKJ-21", tipo: "Particular", pais: "CL", estado: "alerta", hora: "17:42" },
  { ppu: "JKM-993", tipo: "Particular", pais: "AR", estado: "ok", hora: "17:39" },
  { ppu: "CD-0091", tipo: "Diplomático", pais: "BR", estado: "ok", hora: "17:35" },
];

function Countdown({ days, startDate }: { days: number; startDate: string }) {
  const start = new Date(startDate);
  const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
  const now = new Date();
  const remaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const pct = Math.max(0, (remaining / days) * 100);
  const color = remaining > 30 ? "#16A34A" : remaining > 7 ? "#D97706" : "#C8102E";

  return (
    <div className="rounded p-4" style={{ background: "#F8FAFC", border: "1px solid #E4EAF3" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock size={13} color="#5A6A82" />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#0D1B2A" }}>Contador de Validez Automático</span>
        </div>
        <span style={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color }}>
          {remaining} días restantes
        </span>
      </div>
      <div className="h-2 rounded-full mb-2" style={{ background: "#E4EAF3" }}>
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex justify-between">
        <span style={{ fontSize: "9px", color: "#9AAFCA", fontFamily: "JetBrains Mono, monospace" }}>
          Ingreso: {start.toLocaleDateString("es-CL")}
        </span>
        <span style={{ fontSize: "9px", color: "#9AAFCA", fontFamily: "JetBrains Mono, monospace" }}>
          Vence: {end.toLocaleDateString("es-CL")}
        </span>
      </div>
    </div>
  );
}

export function VehicleControlScreen() {
  const [vehicleType, setVehicleType] = useState<VehicleType>("");
  const [plateType, setPlateType] = useState<PlateType>("REGULAR");
  const [ppu, setPpu] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [pais, setPais] = useState("AR");
  const [year, setYear] = useState("");
  const [entryDate] = useState("2026-06-10");
  const [searched, setSearched] = useState(false);
  const [printed, setPrinted] = useState(false);

  const validity = vehicleType === "particular" ? DAYS_PARTICULAR : vehicleType === "diplomatico" ? DAYS_DIPLOMATICO : null;
  const isDiplomatico = vehicleType === "diplomatico";

  function handleSearch() {
    if (!ppu) return;
    setSearched(true);
    setMarca("Toyota");
    setModelo("Hilux 4x4");
    setColor("Blanco");
    setYear("2022");
    setPais("AR");
  }

  function handlePrint() {
    setPrinted(true);
    setTimeout(() => setPrinted(false), 3000);
  }

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ background: "#EEF1F6" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 style={{ color: "#0D1B2A", fontSize: "18px", fontWeight: 700 }}>Control de Vehículos Internacionales</h1>
          <p style={{ color: "#5A6A82", fontSize: "12px", marginTop: "2px" }}>
            Acuerdo Chile–Argentina de Libre Tránsito Vehicular · D.S. 531/2001
          </p>
        </div>
      </div>

      {/* DB Integration Bar */}
      <div className="rounded p-4 mb-5" style={{ background: "#0D1B2A", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3 mb-3">
          <Globe size={14} color="#A8C4E0" />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#A8C4E0", letterSpacing: "0.06em" }}>
            ESTADO DE INTEGRACIÓN CON BASES DE DATOS EXTERNAS
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {dbStatus.map(db => (
            <div key={db.label} className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: db.status === "connected" ? "#16A34A" : "#D97706" }} />
              <div>
                <div style={{ fontSize: "10px", color: "#CBD5E1", fontWeight: 600, lineHeight: 1.2 }}>{db.label}</div>
                <div style={{ fontSize: "9px", color: "#5A6A82", fontFamily: "JetBrains Mono, monospace" }}>
                  {db.status === "connected" ? "● Online" : "⚠ Degradado"} · {db.latency}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Main form */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Vehicle type selection */}
          <div className="rounded p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A", marginBottom: "12px" }}>
              TIPO DE VEHÍCULO
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { value: "particular", label: "Vehículo Particular", desc: `Validez: ${DAYS_PARTICULAR} días corridos`, icon: "🚗" },
                { value: "diplomatico", label: "Vehículo Diplomático", desc: `Validez: ${DAYS_DIPLOMATICO} días corridos`, icon: "🏛️" },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => { setVehicleType(t.value as VehicleType); if (t.value === "diplomatico") setPlateType("CD"); else setPlateType("REGULAR"); }}
                  className="flex items-start gap-3 px-4 py-4 rounded text-left transition-all"
                  style={{
                    border: `2px solid ${vehicleType === t.value ? "#2563EB" : "#E4EAF3"}`,
                    background: vehicleType === t.value ? "#EEF4FF" : "#F8FAFC",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>{t.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0D1B2A" }}>{t.label}</div>
                    <div style={{ fontSize: "10px", color: "#5A6A82" }}>{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {isDiplomatico && (
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#5A6A82", marginBottom: "8px", letterSpacing: "0.05em" }}>
                  TIPO DE PLACA DIPLOMÁTICA
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["CD", "CC", "OI", "PAT"] as PlateType[]).map(p => (
                    <button
                      key={p}
                      onClick={() => setPlateType(p)}
                      className="px-4 py-2 rounded"
                      style={{
                        border: `1.5px solid ${plateType === p ? "#7C3AED" : "#E4EAF3"}`,
                        background: plateType === p ? "#FAF5FF" : "#F8FAFC",
                        color: plateType === p ? "#5B21B6" : "#5A6A82",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="mt-2" style={{ fontSize: "10px", color: "#5A6A82" }}>
                  CD: Cuerpo Diplomático · CC: Cuerpo Consular · OI: Organismo Internacional · PAT: Particular Acreditado
                </div>
              </div>
            )}
          </div>

          {/* Vehicle data */}
          <div className="rounded p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A", marginBottom: "12px" }}>
              DATOS DEL VEHÍCULO
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="PPU / Patente del vehículo..."
                value={ppu}
                onChange={e => setPpu(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2.5 rounded outline-none"
                style={{ border: "1.5px solid #D0D8E8", background: "#F8FAFC", fontSize: "13px", fontFamily: "JetBrains Mono, monospace", color: "#0D1B2A", letterSpacing: "0.08em" }}
              />
              <select
                value={pais}
                onChange={e => setPais(e.target.value)}
                className="px-3 py-2.5 rounded outline-none"
                style={{ border: "1.5px solid #D0D8E8", background: "#F8FAFC", fontSize: "12px", color: "#0D1B2A" }}
              >
                <option value="AR">🇦🇷 Argentina</option>
                <option value="CL">🇨🇱 Chile</option>
                <option value="BR">🇧🇷 Brasil</option>
                <option value="UY">🇺🇾 Uruguay</option>
                <option value="PE">🇵🇪 Perú</option>
              </select>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-4 py-2 rounded"
                style={{ background: "#1B3A6B", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", border: "none" }}
              >
                <Search size={13} /> Buscar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Marca", marca, setMarca, "Toyota, Ford, Renault..."],
                ["Modelo", modelo, setModelo, "Hilux, Ranger, Logan..."],
                ["Color", color, setColor, "Blanco, Negro, Rojo..."],
                ["Año", year, setYear, "2022"],
              ].map(([label, val, setter, ph]) => (
                <div key={label as string}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#5A6A82", marginBottom: "5px", letterSpacing: "0.06em" }}>{label as string}</div>
                  <input
                    type="text"
                    value={val as string}
                    onChange={e => (setter as any)(e.target.value)}
                    placeholder={ph as string}
                    className="w-full px-3 py-2 rounded outline-none"
                    style={{ border: "1px solid #D0D8E8", background: "#F8FAFC", fontSize: "12px", color: "#0D1B2A" }}
                  />
                </div>
              ))}
            </div>

            {searched && (
              <div className="mt-3 px-3 py-2 rounded flex items-center gap-2" style={{ background: "#F0FDF4", border: "1px solid #86EFAC" }}>
                <CheckCircle size={13} color="#16A34A" />
                <span style={{ fontSize: "11px", color: "#15803D", fontWeight: 600 }}>
                  Vehículo encontrado en registros — sin alertas activas
                </span>
              </div>
            )}
          </div>

          {/* Validity counter */}
          {vehicleType && (
            <div className="rounded p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A", marginBottom: "12px" }}>
                CONTADOR DE VIGENCIA — {vehicleType === "particular" ? "VEHÍCULO PARTICULAR" : "VEHÍCULO DIPLOMÁTICO"}
              </div>
              <Countdown days={validity!} startDate={entryDate} />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="px-3 py-2 rounded" style={{ background: "#EEF4FF", border: "1px solid #BFCFEF" }}>
                  <div style={{ fontSize: "9px", color: "#5A6A82", fontWeight: 700 }}>FECHA INGRESO</div>
                  <div style={{ fontSize: "12px", fontFamily: "JetBrains Mono, monospace", color: "#1B3A6B" }}>
                    {new Date(entryDate).toLocaleDateString("es-CL")}
                  </div>
                </div>
                <div className="px-3 py-2 rounded" style={{ background: "#EEF4FF", border: "1px solid #BFCFEF" }}>
                  <div style={{ fontSize: "9px", color: "#5A6A82", fontWeight: 700 }}>DÍAS AUTORIZADOS</div>
                  <div style={{ fontSize: "12px", fontFamily: "JetBrains Mono, monospace", color: "#1B3A6B" }}>
                    {validity} días corridos
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Print action */}
          <div className="rounded p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A", marginBottom: "12px" }}>
              PROCESAMIENTO FÍSICO
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex items-center justify-between px-3 py-2 rounded" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <div className="flex items-center gap-2">
                  <CheckCircle size={12} color="#16A34A" />
                  <span style={{ fontSize: "11px", color: "#15803D" }}>Copia Oficial (Aduana)</span>
                </div>
                <span style={{ fontSize: "10px", color: "#16A34A", fontFamily: "JetBrains Mono, monospace" }}>1 copia</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <div className="flex items-center gap-2">
                  <CheckCircle size={12} color="#16A34A" />
                  <span style={{ fontSize: "11px", color: "#15803D" }}>Copia Titular (Conductor)</span>
                </div>
                <span style={{ fontSize: "10px", color: "#16A34A", fontFamily: "JetBrains Mono, monospace" }}>1 copia</span>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 py-3 rounded transition-all"
              style={{
                background: printed ? "#16A34A" : "#1B3A6B",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                letterSpacing: "0.04em",
              }}
            >
              <Printer size={15} />
              {printed ? "✓ IMPRESO (2 COPIAS)" : "IMPRIMIR COMPROBANTE DUAL"}
            </button>
            <p style={{ fontSize: "10px", color: "#9AAFCA", textAlign: "center", marginTop: "8px" }}>
              Genera 2 copias automáticamente según protocolo bilateral
            </p>
          </div>

          {/* Recent vehicles */}
          <div className="rounded p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A", marginBottom: "12px" }}>
              ÚLTIMOS VEHÍCULOS PROCESADOS
            </div>
            <div className="flex flex-col gap-1.5">
              {recentVehicles.map(v => (
                <div key={v.ppu} className="flex items-center justify-between px-3 py-2 rounded" style={{ background: "#F8FAFC", border: "1px solid #E4EAF3" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: v.estado === "ok" ? "#16A34A" : "#C8102E" }} />
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#1B3A6B", fontFamily: "JetBrains Mono, monospace" }}>{v.ppu}</span>
                    <span style={{ fontSize: "10px", color: "#5A6A82" }}>{v.pais} · {v.tipo}</span>
                  </div>
                  <span style={{ fontSize: "9px", color: "#9AAFCA", fontFamily: "JetBrains Mono, monospace" }}>{v.hora}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
