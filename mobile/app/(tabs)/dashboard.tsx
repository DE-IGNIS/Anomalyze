import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import {
  Ionicons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = {
  bg: "#091421",
  surface: "#16202e",
  surfaceHigh: "#212b39",
  surfaceHighest: "#2b3544",
  border: "#2b3544",
  onSurface: "#d9e3f6",
  onSurfaceVariant: "#c6c6cc",
  muted: "#909096",
  green: "#4edea3",
  greenDim: "rgba(78,222,163,0.12)",
  greenBorder: "rgba(78,222,163,0.35)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.12)",
  amber: "#F59E0B",
  amberDim: "rgba(245,158,11,0.12)",
  blue: "#adc6ff",
  navBg: "#050f1c",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type BadgeVariant = "secure" | "moderate" | "critical";
type StatusVariant = "green" | "amber" | "red";

interface Transaction {
  id: string;
  name: string;
  time: string;
  amount: string;
  badge: BadgeVariant;
  status: StatusVariant;
  icon: string;
  iconLib: "ionicons" | "material" | "fa5";
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    name: "Apple Store Infinite Loop",
    time: "TODAY • 14:28:05",
    amount: "$1,249.00",
    badge: "secure",
    status: "green",
    icon: "bag-outline",
    iconLib: "ionicons",
  },
  {
    id: "2",
    name: "External Transfer 0x...F2A",
    time: "TODAY • 12:15:32",
    amount: "$4,500.00",
    badge: "moderate",
    status: "amber",
    icon: "swap-horizontal-outline",
    iconLib: "ionicons",
  },
  {
    id: "3",
    name: "Unrecognized Vendor [SEOUL]",
    time: "TODAY • 09:44:12",
    amount: "$12.50",
    badge: "critical",
    status: "red",
    icon: "globe-outline",
    iconLib: "ionicons",
  },
  {
    id: "4",
    name: "Shell Energy Station",
    time: "YESTERDAY • 18:02:44",
    amount: "$78.30",
    badge: "secure",
    status: "green",
    icon: "car-outline",
    iconLib: "ionicons",
  },
];

const NAV_ITEMS = [
  { label: "Dashboard", icon: "grid-outline" },
  { label: "Anomalies", icon: "alert-circle-outline" },
  { label: "Simulate", icon: "flask-outline" },
  { label: "History", icon: "time-outline" },
];

// ─── Badge Config ──────────────────────────────────────────────────────────────
const BADGE_CONFIG: Record<
  BadgeVariant,
  { bg: string; color: string; label: string }
> = {
  secure: { bg: "rgba(78,222,163,0.12)", color: "#4edea3", label: "SECURE" },
  moderate: {
    bg: "rgba(245,158,11,0.12)",
    color: "#F59E0B",
    label: "MODERATE",
  },
  critical: { bg: "rgba(239,68,68,0.12)", color: "#EF4444", label: "CRITICAL" },
};

const STATUS_COLOR: Record<StatusVariant, string> = {
  green: "#4edea3",
  amber: "#F59E0B",
  red: "#EF4444",
};

// ─── Risk Circle ──────────────────────────────────────────────────────────────
const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const RISK_PERCENT = 26;

function RiskCircle() {
  const offset = CIRCUMFERENCE - (RISK_PERCENT / 100) * CIRCUMFERENCE;
  return (
    <View style={s.riskCircleWrap}>
      <Svg width={140} height={140} viewBox="0 0 140 140">
        {/* Track */}
        <Circle
          cx={70}
          cy={70}
          r={RADIUS}
          fill="none"
          stroke={C.surfaceHigh}
          strokeWidth={10}
        />
        {/* Progress */}
        <G rotation="-90" origin="70,70">
          <Circle
            cx={70}
            cy={70}
            r={RADIUS}
            fill="none"
            stroke={C.green}
            strokeWidth={10}
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={s.riskCenterText} pointerEvents="none">
        <Text style={s.riskPct}>{RISK_PERCENT}%</Text>
        <Text style={s.riskSubLabel}>GLOBAL INDEX</Text>
      </View>
    </View>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  valueColor,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  valueColor: string;
  icon: string;
}) {
  return (
    <View style={s.statCard}>
      <Ionicons
        name={icon as any}
        size={14}
        color={C.muted}
        style={{ marginBottom: 6 }}
      />
      <Text style={s.statLabel}>{label}</Text>
      <Text style={[s.statValue, { color: valueColor }]}>{value}</Text>
      {sub ? <Text style={s.statSub}>{sub}</Text> : null}
    </View>
  );
}

// ─── Transaction Row ──────────────────────────────────────────────────────────
function TxnRow({ item }: { item: Transaction }) {
  const badge = BADGE_CONFIG[item.badge];
  const statusColor = STATUS_COLOR[item.status];

  return (
    <View style={s.txnRow}>
      {/* Left status bar */}
      <View style={[s.txnStatusBar, { backgroundColor: statusColor }]} />

      {/* Icon */}
      <View style={s.txnIcon}>
        <Ionicons
          name={item.icon as any}
          size={16}
          color={C.onSurfaceVariant}
        />
      </View>

      {/* Info */}
      <View style={s.txnInfo}>
        <Text style={s.txnName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={s.txnTime}>{item.time}</Text>
      </View>

      {/* Amount + Badge */}
      <View style={s.txnRight}>
        <Text style={s.txnAmount}>{item.amount}</Text>
        <View style={[s.txnBadge, { backgroundColor: badge.bg }]}>
          <Text style={[s.txnBadgeText, { color: badge.color }]}>
            {badge.label}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.brand}>
            <View style={s.brandIcon}>
              <View style={s.brandDot} />
            </View>
            <Text style={s.brandName}>SafeTransact</Text>
          </View>
        </View>

        {/* ── Stats (STACKED) ── */}
        <View style={s.statsColumn}>
          <StatCard
            label="TOTAL TXNS"
            value="1,284"
            valueColor={C.onSurface}
            icon="card-outline"
          />
          <StatCard
            label="AVG RISK"
            value="12.4"
            sub="LOW RISK"
            valueColor={C.green}
            icon="shield-checkmark-outline"
          />
          <StatCard
            label="ALERTS"
            value="03"
            valueColor={C.red}
            icon="warning-outline"
          />
        </View>

        {/* ── Real-time Risk ── */}
        <View style={s.riskCard}>
          <Text style={s.riskTitle}>Real-time Risk</Text>
          <RiskCircle />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandIcon: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: C.green,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  brandDot: {
    width: 8,
    height: 8,
    backgroundColor: C.green,
    borderRadius: 2,
  },
  brandName: {
    fontSize: 17,
    fontWeight: "700",
    color: C.green,
    letterSpacing: -0.3,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },

  // Stats
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "500",
    letterSpacing: 0.8,
    color: C.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "JetBrainsMono_700Bold" as any,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24,
  },
  statSub: {
    fontSize: 9,
    color: C.green,
    fontWeight: "500",
    marginTop: 3,
    letterSpacing: 0.4,
  },

  // Risk Card
  riskCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: C.surface,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 8,
    padding: 16,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.onSurface,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  riskCircleWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
  },
  riskCenterText: {
    position: "absolute",
    alignItems: "center",
  },
  riskPct: {
    fontFamily: "JetBrainsMono_700Bold" as any,
    fontSize: 24,
    fontWeight: "700",
    color: C.onSurface,
    lineHeight: 28,
  },
  riskSubLabel: {
    fontSize: 9,
    color: C.muted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: 2,
  },
  riskMetrics: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: C.border,
    paddingTop: 12,
  },
  riskMetric: {
    flex: 1,
    alignItems: "center",
  },
  riskMetricBordered: {
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: C.border,
  },
  riskMetricLabel: {
    fontSize: 10,
    color: C.muted,
    marginBottom: 4,
  },
  riskMetricValue: {
    fontFamily: "JetBrainsMono_500Medium" as any,
    fontSize: 13,
    fontWeight: "500",
  },

  // Encrypted Banner
  encBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    height: 100,
    backgroundColor: "#0a1520",
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 12,
  },
  gridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: "rgba(78,222,163,0.12)",
  },
  gridLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 0.5,
    backgroundColor: "rgba(78,222,163,0.12)",
  },
  encGlow: {
    position: "absolute",
    bottom: -20,
    alignSelf: "center",
    width: 160,
    height: 80,
    borderRadius: 80,
    backgroundColor: "rgba(78,222,163,0.1)",
  },
  encChip: {
    alignSelf: "flex-start",
    backgroundColor: C.greenDim,
    borderWidth: 0.5,
    borderColor: C.greenBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  encChipText: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 1,
    color: C.green,
    textTransform: "uppercase",
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.onSurface,
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: "600",
    color: C.green,
    letterSpacing: 0.6,
  },

  // Transaction List
  txnList: {
    paddingHorizontal: 16,
    gap: 6,
  },
  txnRow: {
    backgroundColor: C.surface,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingRight: 12,
    paddingLeft: 14,
    overflow: "hidden",
    gap: 10,
    marginBottom: 6,
  },
  txnStatusBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  txnIcon: {
    width: 34,
    height: 34,
    backgroundColor: C.surfaceHigh,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  txnInfo: {
    flex: 1,
    minWidth: 0,
  },
  txnName: {
    fontSize: 13,
    fontWeight: "500",
    color: C.onSurface,
  },
  txnTime: {
    fontFamily: "JetBrainsMono_400Regular" as any,
    fontSize: 10,
    color: C.muted,
    marginTop: 2,
  },
  txnRight: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  txnAmount: {
    fontFamily: "JetBrainsMono_700Bold" as any,
    fontSize: 13,
    fontWeight: "700",
    color: C.onSurface,
  },
  txnBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 3,
  },
  txnBadgeText: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 72,
    right: 16,
    width: 44,
    height: 44,
    backgroundColor: C.green,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    backgroundColor: C.navBg,
    borderTopWidth: 0.5,
    borderTopColor: C.surface,
    paddingTop: 10,
    paddingBottom: 14,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    color: C.muted,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  statsColumn: {
    paddingHorizontal: 16,
    gap: 12, // spacing between cards
    marginBottom: 16,
  },

  statCard: {
    width: "100%", // full width (rectangle)
    backgroundColor: C.surface,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 10,
    padding: 14,
  },
});
