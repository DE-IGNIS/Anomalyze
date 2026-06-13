import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const C = {
  bg: "#091421",
  surface: "#16202e",
  surfaceHigh: "#212b39",
  border: "#2b3544",
  onSurface: "#d9e3f6",
  muted: "#909096",
  green: "#4edea3",
  red: "#EF4444",
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const RISK_PERCENT = 26;


function RiskCircle({ riskPercent }) {
  const offset = CIRCUMFERENCE - (riskPercent / 100) * CIRCUMFERENCE;
  return (
    <View style={s.riskCircleWrap}>
      <Svg width={140} height={140}>
        <Circle
          cx={70}
          cy={70}
          r={RADIUS}
          fill="none"
          stroke={C.surfaceHigh}
          strokeWidth={10}
        />
        <G rotation="-90" origin="70,70">
          <Circle
            cx={70}
            cy={70}
            r={RADIUS}
            fill="none"
            stroke={C.green}
            strokeWidth={10}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={s.riskCenterText}>
        <Text style={s.riskPct}>{Math.round(riskPercent)}%</Text>
        <Text style={s.riskSub}>GLOBAL INDEX</Text>
      </View>
    </View>
  );
}

function StatCard({ label, value, valueColor, icon }) {
  return (
    <View style={s.statCard}>
      <Ionicons name={icon} size={16} color={C.muted} />
      <Text style={s.statLabel}>{label}</Text>
      <Text style={[s.statValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

export default function Dashboard() {
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [riskPercent, setRiskPercent] = useState(0);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.29.224:3000/api/transactions/getTransactionCount"
        );
        const transactions = response.data;
        const alertCount = transactions.filter(
          t => t.status?.toLowerCase() === "alert"
        ).length;

        setTotalTransactions(transactions.length);
        setTotalAlerts(alertCount);

        const index =
          transactions.length > 0
            ? (alertCount / transactions.length) * 100 : 0;
        setRiskPercent(index);

        console.info(
          `Processed | Total: ${transactions.length} | Alerts: ${alertCount}`
        );
      } catch (err) {
        console.error("FETCH FAILED", err);
      }
    };
    fetchTransactionData();
  }, []);

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E17" />

      <ScrollView
        contentContainerStyle={s.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={s.statsColumn}>
          <StatCard
            label="TOTAL TXNS"
            value={totalTransactions}
            valueColor={C.onSurface}
            icon="card-outline"
          />
          <StatCard
            label="AVG RISK"
            value={0}
            valueColor={C.green}
            icon="shield-checkmark-outline"
          />
          <StatCard
            label="ALERTS"
            value={totalAlerts}
            valueColor={C.red}
            icon="warning-outline"
          />
        </View>

        {/* Risk */}
        <View style={s.riskCard}>
          <Text style={s.riskTitle}>Global Risk Score</Text>
          {/* Pass risk percent prop */}
          <RiskCircle riskPercent={riskPercent} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0E17",
  },

  container: {
    paddingVertical: 16,
    paddingBottom: 100,
  },

  // Stats
  statsColumn: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 18,
  },

  statCard: {
    backgroundColor: C.surface,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },

  statLabel: {
    fontSize: 10,
    color: C.muted,
    letterSpacing: 0.8,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "700",
  },

  statSub: {
    fontSize: 10,
    color: C.green,
  },

  // Risk
  riskCard: {
    marginHorizontal: 16,
    backgroundColor: C.surface,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },

  riskTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.onSurface,
    marginBottom: 12,
  },

  riskCircleWrap: {
    justifyContent: "center",
    alignItems: "center",
  },

  riskCenterText: {
    position: "absolute",
    alignItems: "center",
  },

  riskPct: {
    fontSize: 26,
    fontWeight: "700",
    color: C.onSurface,
  },

  riskSub: {
    fontSize: 10,
    color: C.muted,
    marginTop: 2,
  },
});