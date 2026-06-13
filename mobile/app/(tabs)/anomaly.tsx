import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCard } from "../../components/AlertCard";


function SkeletonCard() {
  return (
    <View style={s.skeletonCard}>
      <View style={s.skeletonRow}>
        <View style={s.skeletonIcon} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={[s.skeletonLine, { width: "70%" }]} />
          <View style={[s.skeletonLine, { width: "50%", height: 10 }]} />
        </View>
        <View style={s.skeletonBadge} />
      </View>
      <View style={s.skeletonBlock} />
      <View style={s.skeletonBtnRow}>
        <View style={[s.skeletonBtn, { backgroundColor: "rgba(82,183,136,0.1)" }]} />
        <View style={[s.skeletonBtn, { backgroundColor: "rgba(255,77,109,0.06)" }]} />
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={s.emptyWrap}>
      <Text style={s.emptyTitle}>All Clear</Text>
      <Text style={s.emptyDesc}>No pending anomalies to review.</Text>
    </View>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <View style={s.errorBanner}>
      <Text style={s.errorText}>{message}</Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={s.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

interface Transaction {
  transaction_id: string | number;
  amount: number;
  device: string;
  location: string;
  ip_address: string;
  risk_score: number;
  status: string;
  merchant_type: string;
  created_at?: string;
}

function toAlertCardShape(t: Transaction) {
  return {
    id: String(t.transaction_id),
    title: t.merchant_type ?? "Unknown Alert",
    subtitle: t.created_at ? `Detected at ${t.created_at}` : "Recently detected",
    type: "transaction" as const,
    risk_score: t.risk_score,
    details: {
      AMOUNT: `Rs.${Number(t.amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      DEVICE: t.device ?? "Unknown",
      IP_ADDRESS: t.ip_address ?? "N/A",
      LOCATION: t.location ?? "Unknown",
    },
    warning: null,
    extra_visual: null,
    location_label: null,
    status: t.status,
  };
}

export default function Anomaly() {
  const [alerts, setAlerts] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [investigate, setInvestigate] = useState(false);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://192.168.29.224:3000/api/transactions/alerts`
      );

      if (!res.ok) throw new Error(`HTTP error! status:${res.status}`);

      const json = await res.json();
      const data = Array.isArray(json) ? json : (json.data ?? []);
      setAlerts(data);
    } catch (err: any) {
      setError(err.message);
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const mappedAlerts = alerts.map(toAlertCardShape);

  const handleInvestigate = useCallback((alert) => {
    console.log("Investigating:", alert.id);

    const originalTxn = alerts.find(
      (t) => String(t.transaction_id) === alert.id
    );

    setSelectedTxn(originalTxn || null);
    setInvestigate(true);
  }, [alerts]);

  const handleDismiss = useCallback((alert) => {
    Alert.alert(
      "Alert Dismissed",
      `Transaction alert #${alert.id} dismissed (demo)`,
      [{ text: "OK" }]
    );
  }, []);

  const pendingCount = mappedAlerts.length;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#070d18" />

      <View style={s.header}>
        <View>
          <View style={s.surveyRow}>
            <View style={s.surveyDot} />
            <Text style={s.surveyLabel}>SURVEILLANCE ACTIVE</Text>
          </View>
          <Text style={s.screenTitle}>Anomaly Feed</Text>
        </View>

        {!loading && pendingCount > 0 && (
          <View style={s.alertBadge}>
            <View style={s.alertBadgeDot} />
            <Text style={s.alertBadgeText}>
              {pendingCount} Critical Alert{pendingCount !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>

      <View style={s.divider} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {error && <ErrorBanner message={error} onRetry={fetchAlerts} />}

        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : mappedAlerts.length === 0 && !error ? (
          <EmptyState />
        ) : (
          mappedAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onInvestigate={handleInvestigate}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </ScrollView>


      {selectedTxn && (
        <>
          <Modal transparent visible={investigate} animationType="fade">
            <View style={s.overlay}>
              <View style={s.modalContainer}>

                {/* Transaction Metadata */}
                <Text style={s.title}>Transaction Metadata</Text>

                <Text style={s.amount}>₹{Number(selectedTxn?.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>

                <View style={s.row}>
                  <View style={s.col}>
                    <Text style={s.label}>MERCHANT</Text>
                    <Text style={s.value}>{selectedTxn?.merchant_type || "Unknown"}</Text>
                  </View>

                  <View style={s.col}>
                    <Text style={s.label}>TIMESTAMP</Text>
                    <Text style={s.value}>{selectedTxn?.created_at || "N/A"}</Text>
                  </View>
                </View>

                <View style={s.row}>
                  <View style={s.col}>
                    <Text style={s.label}>IP ADDRESS</Text>
                    <Text style={s.value}>{selectedTxn?.ip_address || "N/A"}</Text>
                  </View>

                  <View style={s.col}>
                    <Text style={s.label}>DEVICE</Text>
                    <Text style={s.value}>{selectedTxn?.device || "Unknown"}</Text>
                  </View>
                </View>

                <Text style={s.encryption}>
                  🔒 All Data Encrypted: Bank-Grade AES-256
                </Text>

                {/* Divider */}
                <View style={s.divider2} />

                {/* Security Insights */}
                <View style={s.insightHeader}>
                  <Text style={s.insightTitle}>Security Insights</Text>
                  <Text style={s.badge}>AI RECOMMENDATION</Text>
                </View>

                <Text style={s.insightText}>
                  This transaction deviates significantly from the user's historical
                  spend pattern. High probability of session hijacking detected due to
                  abrupt geographic shift within a 15-minute window.
                </Text>

                {/* Actions */}
                <Pressable style={s.btnDanger}>
                  <Text style={s.btnTextDanger}>Escalate Case</Text>
                </Pressable>

                <Pressable style={s.btnSuccess}>
                  <Text style={s.btnTextSuccess}>Verify with User</Text>
                </Pressable>

                <Pressable onPress={() => {
                  setInvestigate(false);
                  setSelectedTxn(null);
                }} style={s.btnGhost}>
                  <Text style={s.btnTextGhost}>Dismiss</Text>
                </Pressable>

              </View>
            </View>
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#070d18",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  surveyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  surveyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#52b788",
  },
  surveyLabel: {
    fontSize: 10,
    color: "#52b788",
    letterSpacing: 2,
    fontWeight: "600",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#e0e8f7",
    letterSpacing: -0.5,
  },
  alertBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 13,
    backgroundColor: "rgba(255,77,109,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,77,109,0.3)",
    borderRadius: 20,
  },
  alertBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#ff4d6d",
  },
  alertBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ff6b87",
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: "rgba(82,183,136,0.3)",
    marginBottom: 4,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "rgba(255,77,109,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,77,109,0.25)",
    borderRadius: 12,
    marginBottom: 4,
  },
  errorText: { color: "#ff6b87", fontSize: 13, flex: 1 },
  retryText: { color: "#52b788", fontSize: 12, fontWeight: "600", marginLeft: 12 },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#c0c8d8",
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: "#8a9bb5",
    lineHeight: 20,
    textAlign: "center",
  },
  skeletonCard: {
    borderRadius: 16,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    borderLeftWidth: 3,
    borderLeftColor: "rgba(255,255,255,0.1)",
    padding: 16,
    marginBottom: 2,
  },
  skeletonRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 12,
  },
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  skeletonLine: {
    height: 13,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 4,
  },
  skeletonBadge: {
    width: 56,
    height: 52,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  skeletonBlock: {
    height: 70,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 10,
    marginBottom: 12,
  },
  skeletonBtnRow: {
    flexDirection: "row",
    gap: 10,
  },
  skeletonBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e2e8f0",
    marginBottom: 12,
  },

  amount: {
    fontSize: 26,
    fontWeight: "700",
    color: "#34d399",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  col: {
    width: "48%",
  },

  label: {
    fontSize: 10,
    color: "#94a3b8",
    marginBottom: 4,
    letterSpacing: 1,
  },

  value: {
    fontSize: 13,
    color: "#e2e8f0",
    fontWeight: "500",
  },

  encryption: {
    fontSize: 12,
    color: "#34d399",
    marginTop: 8,
  },

  divider2: {
    height: 1,
    backgroundColor: "#1e293b",
    marginVertical: 16,
  },

  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  insightTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e2e8f0",
  },

  badge: {
    fontSize: 10,
    color: "#34d399",
    backgroundColor: "#064e3b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },

  insightText: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 10,
    lineHeight: 18,
  },

  btnDanger: {
    backgroundColor: "#fca5a5",
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
  },

  btnTextDanger: {
    color: "#7f1d1d",
    fontWeight: "600",
  },

  btnSuccess: {
    backgroundColor: "#34d399",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  btnTextSuccess: {
    color: "#064e3b",
    fontWeight: "600",
  },

  btnGhost: {
    borderWidth: 1,
    borderColor: "#334155",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  btnTextGhost: {
    color: "#cbd5f5",
    fontWeight: "500",
  },
});