import { useState } from "react";

export default function App() {
  const [ip, setIp] = useState("8.8.8.8");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    if (!ip.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`http://localhost:8001/api/scan/${ip.trim()}`);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Scan failed");
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not connect to backend on port 8001.");
    } finally {
      setLoading(false);
    }
  };

  const isMalicious = result && result.stats.malicious > 0;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🛡️ Threat Intelligence IP Scanner</h1>
        <p style={styles.subtitle}>
          Enter an IPv4 address to query live VirusTotal reputation and network telemetry.
        </p>

        <form onSubmit={handleScan} style={styles.form}>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="e.g. 8.8.8.8 or 1.1.1.1"
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Scanning..." : "Analyze IP"}
          </button>
        </form>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        {result && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <span style={styles.label}>TARGET IP</span>
                <h2 style={styles.ipText}>{result.ip}</h2>
              </div>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: isMalicious ? "#dc2626" : "#16a34a",
                }}
              >
                {isMalicious ? "FLAGGED / SUSPICIOUS" : "CLEAN / LOW RISK"}
              </span>
            </div>

            <div style={styles.metaGrid}>
              <div style={styles.metaItem}>
                <span style={styles.label}>NETWORK OWNER (ASN)</span>
                <p style={styles.metaValue}>{result.owner}</p>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.label}>COUNTRY</span>
                <p style={styles.metaValue}>{result.country}</p>
              </div>
            </div>

            <span style={styles.label}>ENGINE DETECTION BREAKDOWN</span>
            <div style={styles.statsGrid}>
              <div style={{ ...styles.statBox, borderColor: "#ef4444" }}>
                <span style={styles.statNum}>{result.stats.malicious}</span>
                <span style={styles.statLabel}>Malicious</span>
              </div>
              <div style={{ ...styles.statBox, borderColor: "#f59e0b" }}>
                <span style={styles.statNum}>{result.stats.suspicious}</span>
                <span style={styles.statLabel}>Suspicious</span>
              </div>
              <div style={{ ...styles.statBox, borderColor: "#22c55e" }}>
                <span style={styles.statNum}>{result.stats.harmless}</span>
                <span style={styles.statLabel}>Harmless</span>
              </div>
              <div style={{ ...styles.statBox, borderColor: "#64748b" }}>
                <span style={styles.statNum}>{result.stats.undetected}</span>
                <span style={styles.statLabel}>Undetected</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "40px 20px",
  },
  container: { maxWidth: "680px", margin: "0 auto" },
  title: { fontSize: "28px", marginBottom: "8px" },
  subtitle: { color: "#94a3b8", marginBottom: "24px" },
  form: { display: "flex", gap: "12px", marginBottom: "24px" },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    color: "#fff",
    fontSize: "16px",
  },
  button: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
  },
  errorBox: {
    backgroundColor: "#450a0a",
    border: "1px solid #dc2626",
    color: "#fca5a5",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "24px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  ipText: { margin: "4px 0 0 0", fontSize: "24px" },
  badge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#fff",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "24px",
    padding: "16px",
    backgroundColor: "#0f172a",
    borderRadius: "8px",
  },
  metaValue: { margin: "4px 0 0 0", fontWeight: "600" },
  label: { fontSize: "11px", color: "#94a3b8", letterSpacing: "0.05em" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginTop: "8px",
  },
  statBox: {
    backgroundColor: "#0f172a",
    borderTop: "3px solid",
    borderRadius: "8px",
    padding: "14px",
    textAlign: "center",
  },
  statNum: { display: "block", fontSize: "22px", fontWeight: "700" },
  statLabel: { fontSize: "12px", color: "#94a3b8" },
};
