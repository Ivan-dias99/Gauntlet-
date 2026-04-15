import { useState } from "react";
import { Chamber } from "../spine/types";
import { useSpine } from "../spine/SpineContext";

const CHAMBERS: { id: Chamber; label: string; sub: string }[] = [
  { id: "Lab",      label: "Investigação", sub: "Análise · Evidência · Verdade" },
  { id: "Creation", label: "Construção",   sub: "Arquitetura · Execução · Consequência" },
  { id: "Memory",   label: "Memória",      sub: "Retenção · Inteligência · Continuidade" },
  { id: "School",   label: "Doutrina",     sub: "Formação · Constituição · Princípio" },
];

interface Props {
  onDone?: () => void;
}

export default function RitualEntry({ onDone }: Props) {
  const { createMission } = useSpine();
  const [title, setTitle] = useState("");
  const [chamber, setChamber] = useState<Chamber | null>(null);

  const ready = title.trim().length > 0 && chamber !== null;

  function commit() {
    if (!ready) return;
    createMission(title, chamber!);
    onDone?.();
  }

  return (
    <div style={{
      height: "100vh",
      background: "#0c0c0c",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 520, padding: "0 32px" }}>

        <div style={{
          fontSize: 10, letterSpacing: 3,
          color: "#3a3530", textTransform: "uppercase",
          marginBottom: 48,
        }}>
          RUBERRA · NOVA MISSÃO
        </div>

        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === "Enter" && commit()}
          placeholder="Nome da missão"
          style={{
            width: "100%", background: "none",
            border: "none", borderBottom: "1px solid #222",
            outline: "none", fontSize: 24, color: "#e8e4df",
            padding: "6px 0 18px", marginBottom: 48,
            fontFamily: "system-ui, sans-serif", letterSpacing: "-0.4px",
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 48 }}>
          {CHAMBERS.map(c => {
            const active = chamber === c.id;
            return (
              <button key={c.id} onClick={() => setChamber(c.id)} style={{
                background: active ? "#141210" : "none",
                border: `1px solid ${active ? "#3a3028" : "#1e1e1e"}`,
                borderRadius: 3, padding: "14px 16px",
                cursor: "pointer", textAlign: "left",
                transition: "all 0.1s",
              }}>
                <div style={{ fontSize: 13, color: active ? "#c4b89a" : "#4a4540", marginBottom: 5 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 10, color: "#2e2b28", letterSpacing: 0.3 }}>
                  {c.sub}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button
            onClick={commit}
            disabled={!ready}
            style={{
              background: "none",
              border: `1px solid ${ready ? "#c4b89a" : "#222"}`,
              color: ready ? "#c4b89a" : "#2e2b28",
              fontSize: 11, letterSpacing: 2.5,
              textTransform: "uppercase", padding: "12px 36px",
              cursor: ready ? "pointer" : "default",
              fontFamily: "system-ui, sans-serif",
              borderRadius: 2, transition: "all 0.12s",
            }}
          >
            Entrar
          </button>

          {onDone && (
            <button onClick={onDone} style={{
              background: "none", border: "none",
              color: "#3a3530", fontSize: 11,
              cursor: "pointer", fontFamily: "system-ui, sans-serif",
            }}>
              cancelar
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
