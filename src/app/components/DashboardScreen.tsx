import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Users, Car, Clock, TrendingUp, TrendingDown, FileText, Download, Printer,
  AlertCircle, CheckCircle, RefreshCw, ArrowUp, ArrowDown
} from "lucide-react";

const hourlyData = [
  { hora: "06:00", personas: 142, vehiculos: 38 },
  { hora: "07:00", personas: 310, vehiculos: 87 },
  { hora: "08:00", personas: 487, vehiculos: 132 },
  { hora: "09:00", personas: 521, vehiculos: 158 },
  { hora: "10:00", personas: 398, vehiculos: 121 },
  { hora: "11:00", personas: 356, vehiculos: 104 },
  { hora: "12:00", personas: 412, vehiculos: 143 },
  { hora: "13:00", personas: 489, vehiculos: 162 },
  { hora: "14:00", personas: 534, vehiculos: 178 },
  { hora: "15:00", personas: 487, vehiculos: 151 },
  { hora: "16:00", personas: 441, vehiculos: 138 },
  { hora: "17:00", personas: 503, vehiculos: 165 },
];

const weeklyData = [
  { dia: "Lun", entradas: 3240, salidas: 3100 },
  { dia: "Mar", entradas: 2980, salidas: 2890 },
  { dia: "Mié", entradas: 3510, salidas: 3420 },
  { dia: "Jue", entradas: 4120, salidas: 3980 },
  { dia: "Vie", entradas: 4890, salidas: 4720 },
  { dia: "Sáb", entradas: 5640, salidas: 5380 },
  { dia: "Dom", entradas: 4210, salidas: 4080 },
];

const queue = [
  { carril: "A-1", tipo: "Particular", espera: "4 min", estado: "ok" },
  { carril: "A-2", tipo: "Particular", espera: "7 min", estado: "ok" },
  { carril: "B-1", tipo: "Bus Internacional", espera: "18 min", estado: "alert" },
  { carril: "B-2", tipo: "Carga Pesada", espera: "32 min", estado: "critical" },
  { carril: "C-1", tipo: "Diplomático", espera: "2 min", estado: "ok" },
  { carril: "C-2", tipo: "VIP / Preferencial", espera: "3 min", estado: "ok" },
];

const alerts = [
  { id: 1, tipo: "Vehículo Alertado", detalle: "PPU: BFKJ-21 — Coincidencia Interpol", nivel: "critical", hora: "17:42" },
  { id: 2, tipo: "Menor Sin Autorización", detalle: "Pasajero 14 años sin tutor", nivel: "alert", hora: "17:38" },
  { id: 3, tipo: "Documentos Vencidos", detalle: "Pasaporte CL-4421 — exp. 2024", nivel: "alert", hora: "17:31" },
  { id: 4, tipo: "SAG: Producto Prohibido", detalle: "Carne fresca declarada en equipaje", nivel: "alert", hora: "17:20" },
  { id: 5, tipo: "Tránsito Normalizado", detalle: "Carril A-1 despejado", nivel: "ok", hora: "17:15" },
];

function StatCard({ label, value, sub, icon: Icon, trend, trendVal, color }: any) {
  return (
    <div className="rounded p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center justify-center w-9 h-9 rounded" style={{ background: color + "15" }}>
          <Icon size={18} color={color} />
        </div>
        <div className="flex items-center gap-1" style={{ color: trend === "up" ? "#16A34A" : "#C8102E", fontSize: "11px", fontWeight: 600 }}>
          {trend === "up" ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
          {trendVal}
        </div>
      </div>
      <div style={{ fontSize: "26px", fontWeight: 700, color: "#0D1B2A", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "11px", fontWeight: 700, color: "#5A6A82", marginTop: "4px", letterSpacing: "0.04em" }}>{label}</div>
      <div style={{ fontSize: "10px", color: "#9AAFCA", marginTop: "2px" }}>{sub}</div>
    </div>
  );
}

export function DashboardScreen() {
  const [reportType, setReportType] = useState("diario");

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ background: "#EEF1F6" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: "#0D1B2A", fontSize: "18px", fontWeight: 700 }}>Panel de Control — Complejo Los Libertadores</h1>
          <p style={{ color: "#5A6A82", fontSize: "12px", marginTop: "2px" }}>
            Martes 10 de junio de 2026 · Turno 14:00–22:00 · Jefatura: Subcomisario R. Morales
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ background: "#DCFCE7", border: "1px solid #86EFAC" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#16A34A" }} />
            <span style={{ fontSize: "11px", color: "#15803D", fontWeight: 600 }}>OPERACIONAL</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ background: "#1B3A6B", color: "#fff", fontSize: "11px", fontWeight: 600, cursor: "pointer", border: "none" }}>
            <RefreshCw size={11} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="PERSONAS HOY" value="4,892" sub="Entradas + Salidas" icon={Users} trend="up" trendVal="+12%" color="#2563EB" />
        <StatCard label="VEHÍCULOS HOY" value="1,347" sub="Total cruces registrados" icon={Car} trend="up" trendVal="+8%" color="#7C3AED" />
        <StatCard label="TIEMPO PROMEDIO" value="6.2 min" sub="Espera actual en carril" icon={Clock} trend="down" trendVal="-34%" color="#16A34A" />
        <StatCard label="ALERTAS ACTIVAS" value="3" sub="Requieren atención inmediata" icon={AlertCircle} trend="up" trendVal="+2" color="#C8102E" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Hourly chart */}
        <div className="col-span-2 rounded p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A" }}>Tránsito por Hora — Hoy</div>
              <div style={{ fontSize: "10px", color: "#5A6A82" }}>Personas y vehículos procesados</div>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#2563EB" }} /><span style={{ fontSize: "10px", color: "#5A6A82" }}>Personas</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#7C3AED" }} /><span style={{ fontSize: "10px", color: "#5A6A82" }}>Vehículos</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="gradP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="hora" tick={{ fontSize: 9, fill: "#9AAFCA" }} />
              <YAxis tick={{ fontSize: 9, fill: "#9AAFCA" }} />
              <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "4px", border: "1px solid #E4EAF3" }} />
              <Area type="monotone" dataKey="personas" stroke="#2563EB" strokeWidth={2} fill="url(#gradP)" />
              <Area type="monotone" dataKey="vehiculos" stroke="#7C3AED" strokeWidth={2} fill="url(#gradV)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Queue status */}
        <div className="rounded p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A", marginBottom: "4px" }}>Estado de Carriles</div>
          <div style={{ fontSize: "10px", color: "#5A6A82", marginBottom: "14px" }}>Tiempo de espera en tiempo real</div>
          <div className="flex flex-col gap-2">
            {queue.map(q => (
              <div key={q.carril} className="flex items-center justify-between px-3 py-2 rounded" style={{ background: "#F8FAFC", border: "1px solid #E4EAF3" }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: q.estado === "ok" ? "#16A34A" : q.estado === "alert" ? "#D97706" : "#C8102E" }}
                  />
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#1B3A6B", fontFamily: "JetBrains Mono, monospace" }}>{q.carril}</span>
                  <span style={{ fontSize: "10px", color: "#5A6A82" }}>{q.tipo}</span>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono, monospace",
                    color: q.estado === "ok" ? "#16A34A" : q.estado === "alert" ? "#D97706" : "#C8102E",
                  }}
                >
                  {q.espera}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Weekly bar */}
        <div className="col-span-2 rounded p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D1B2A" }}>Entradas / Salidas — Semana Actual</div>
              <div style={{ fontSize: "10px", color: "#5A6A82" }}>Total de personas procesadas por día</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weeklyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 9, fill: "#9AAFCA" }} />
              <YAxis tick={{ fontSize: 9, fill: "#9AAFCA" }} />
              <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "4px" }} />
              <Bar dataKey="entradas" fill="#2563EB" radius={[2, 2, 0, 0]} name="Entradas" />
              <Bar dataKey="salidas" fill="#A8C4E0" radius={[2, 2, 0, 0]} name="Salidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts + Reports */}
        <div className="flex flex-col gap-4">
          {/* Alerts */}
          <div className="rounded p-4 flex-1" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#0D1B2A", marginBottom: "10px" }}>Alertas Recientes</div>
            <div className="flex flex-col gap-1.5">
              {alerts.map(a => (
                <div key={a.id} className="flex items-start gap-2 px-2 py-1.5 rounded" style={{ background: a.nivel === "critical" ? "#FEF2F2" : a.nivel === "alert" ? "#FFFBEB" : "#F0FDF4", border: `1px solid ${a.nivel === "critical" ? "#FECACA" : a.nivel === "alert" ? "#FDE68A" : "#BBF7D0"}` }}>
                  <div className="mt-0.5">
                    {a.nivel === "ok" ? <CheckCircle size={11} color="#16A34A" /> : <AlertCircle size={11} color={a.nivel === "critical" ? "#C8102E" : "#D97706"} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: "10px", fontWeight: 700, color: a.nivel === "critical" ? "#C8102E" : a.nivel === "alert" ? "#92400E" : "#15803D" }}>{a.tipo}</div>
                    <div style={{ fontSize: "9px", color: "#5A6A82", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.detalle}</div>
                  </div>
                  <span style={{ fontSize: "9px", color: "#9AAFCA", fontFamily: "JetBrains Mono, monospace", whiteSpace: "nowrap" }}>{a.hora}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reports */}
          <div className="rounded p-4" style={{ background: "#FFFFFF", border: "1px solid rgba(27,58,107,0.1)" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#0D1B2A", marginBottom: "10px" }}>Generar Reporte</div>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="w-full px-2 py-1.5 rounded mb-3 outline-none"
              style={{ border: "1px solid #D0D8E8", fontSize: "11px", color: "#0D1B2A", background: "#F8FAFC" }}
            >
              <option value="diario">Reporte Diario</option>
              <option value="semanal">Reporte Semanal</option>
              <option value="mensual">Reporte Mensual</option>
              <option value="incidencias">Incidencias</option>
            </select>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded" style={{ background: "#C8102E", color: "#fff", fontSize: "10px", fontWeight: 700, cursor: "pointer", border: "none" }}>
                <Download size={11} />
                PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded" style={{ background: "#16A34A", color: "#fff", fontSize: "10px", fontWeight: 700, cursor: "pointer", border: "none" }}>
                <FileText size={11} />
                Excel
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded" style={{ background: "#1B3A6B", color: "#fff", fontSize: "10px", fontWeight: 700, cursor: "pointer", border: "none" }}>
                <Printer size={11} />
                Imp.
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
