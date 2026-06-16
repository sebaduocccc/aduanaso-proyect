import { useState, useRef, useEffect } from "react";
import { Accessibility, Volume2, VolumeX, ZoomIn, ZoomOut, Contrast, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

type FontSize = 12 | 14 | 17;

export function AccessibilityPanel() {
  const { highContrast, toggleHighContrast, screenReader, toggleScreenReader, fontSize, setFontSize } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onClickOut(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOut);
    return () => document.removeEventListener("mousedown", onClickOut);
  }, []);

  const fontOptions: { value: FontSize; label: string }[] = [
    { value: 12, label: "A−" },
    { value: 14, label: "A" },
    { value: 17, label: "A+" },
  ];

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        title="Opciones de Accesibilidad"
        className="flex items-center justify-center w-8 h-8 rounded transition-all"
        style={{
          background: open ? "rgba(37,99,235,0.12)" : "transparent",
          border: `1px solid ${open ? "#2563EB" : "rgba(27,58,107,0.18)"}`,
          color: open ? "#2563EB" : "var(--muted-foreground)",
          cursor: "pointer",
        }}
        onMouseEnter={e => { if (!open) (e.currentTarget as HTMLButtonElement).style.background = "rgba(27,58,107,0.07)"; }}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        aria-label="Abrir panel de accesibilidad"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Accessibility size={15} />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Opciones de accesibilidad"
          className="absolute right-0 top-full mt-2 rounded"
          style={{
            width: "252px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <Accessibility size={13} style={{ color: "#2563EB" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "0.06em" }}>
                ACCESIBILIDAD
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-5 h-5 flex items-center justify-center rounded"
              style={{ background: "transparent", border: "none", color: "var(--muted-foreground)", cursor: "pointer" }}
              aria-label="Cerrar panel"
            >
              <X size={12} />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {/* Font size */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <ZoomIn size={12} style={{ color: "var(--muted-foreground)" }} />
                <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em" }}>
                  TAMAÑO DE TEXTO
                </span>
              </div>
              <div
                className="flex rounded overflow-hidden"
                style={{ border: "1px solid var(--border)" }}
              >
                {fontOptions.map((opt, i) => (
                  <button
                    key={opt.value}
                    onClick={() => setFontSize(opt.value)}
                    className="flex-1 py-2 transition-all"
                    style={{
                      background: fontSize === opt.value ? "#1B3A6B" : "var(--card)",
                      color: fontSize === opt.value ? "#FFFFFF" : "var(--muted-foreground)",
                      fontSize: opt.value === 12 ? "11px" : opt.value === 14 ? "13px" : "16px",
                      fontWeight: fontSize === opt.value ? 700 : 500,
                      border: "none",
                      borderRight: i < fontOptions.length - 1 ? "1px solid var(--border)" : "none",
                      cursor: "pointer",
                      letterSpacing: "0.02em",
                    }}
                    aria-pressed={fontSize === opt.value}
                    aria-label={`Tamaño de fuente ${opt.label}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* High contrast */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Contrast size={12} style={{ color: "var(--muted-foreground)" }} />
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em" }}>
                    ALTO CONTRASTE
                  </span>
                </div>
                <button
                  onClick={toggleHighContrast}
                  role="switch"
                  aria-checked={highContrast}
                  aria-label="Activar alto contraste"
                  className="relative rounded-full transition-all"
                  style={{
                    width: "36px",
                    height: "20px",
                    background: highContrast ? "#1B3A6B" : "var(--muted)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <span
                    className="absolute rounded-full transition-all"
                    style={{
                      width: "14px",
                      height: "14px",
                      top: "3px",
                      left: highContrast ? "19px" : "3px",
                      background: highContrast ? "#FFFFFF" : "var(--muted-foreground)",
                    }}
                  />
                </button>
              </div>
              {highContrast && (
                <div
                  className="mt-1.5 px-2 py-1 rounded"
                  style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.18)" }}
                >
                  <span style={{ fontSize: "9px", color: "#2563EB" }}>Alto contraste activado — WCAG AAA</span>
                </div>
              )}
            </div>

            {/* Screen reader */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  {screenReader ? <Volume2 size={12} style={{ color: "#2563EB" }} /> : <VolumeX size={12} style={{ color: "var(--muted-foreground)" }} />}
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.07em" }}>
                    LECTOR DE PANTALLA
                  </span>
                </div>
                <button
                  onClick={toggleScreenReader}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded transition-all"
                  style={{
                    background: screenReader ? "rgba(37,99,235,0.12)" : "var(--muted)",
                    border: `1px solid ${screenReader ? "#2563EB" : "var(--border)"}`,
                    color: screenReader ? "#2563EB" : "var(--muted-foreground)",
                    fontSize: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  aria-pressed={screenReader}
                  aria-label="Activar lectura de pantalla"
                >
                  {screenReader ? "ACTIVO" : "INACTIVO"}
                </button>
              </div>
              <p style={{ fontSize: "9px", color: "var(--muted-foreground)", lineHeight: 1.4 }}>
                {screenReader
                  ? "Modo de lectura habilitado. Compatible con NVDA y JAWS."
                  : "Activa para compatibilidad con tecnologías asistivas NVDA / JAWS."}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2"
            style={{ borderTop: "1px solid var(--border)", background: "var(--muted)" }}
          >
            <span style={{ fontSize: "9px", color: "var(--muted-foreground)" }}>
              Norma WCAG 2.1 · Ley 20.422 (Discapacidad) · Accesibilidad Digital Chile
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
