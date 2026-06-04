import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
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
      /*
      We have alerdy displayed risk score on top right 
      RISK_SCORE: `${t.risk_score}/100`,
      STATUS: String(t.status ?? "unknown").toUpperCase(),
      */
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
  }, []);

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
});