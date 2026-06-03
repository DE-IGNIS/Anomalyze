/**
 * AlertCard.jsx — React Native (Expo) version
 *
 * Uses only react-native primitives: View, Text, TouchableOpacity, Animated.
 * SVG icons via react-native-svg (expo install react-native-svg).
 */

import { useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
} from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getSeverityColor(score) {
    if (score >= 80) return "#ff4d6d";
    if (score >= 50) return "#f4a261";
    return "#52b788";
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconTransaction() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#f4a261" strokeWidth={2} strokeLinejoin="round" />
            <Path d="M2 17l10 5 10-5" stroke="#f4a261" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M2 12l10 5 10-5" stroke="#f4a261" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function IconLocation({ color = "#4cc9f0" }) {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={10} r={3} stroke={color} strokeWidth={2} />
            <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth={2} />
        </Svg>
    );
}

function IconShield({ color = "#ff4d6d" }) {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
            <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function IconInfo() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke="#52b788" strokeWidth={2} />
            <Path d="M12 8v4M12 16h.01" stroke="#52b788" strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}

function getIcon(type) {
    switch (type) {
        case "transaction": return <IconTransaction />;
        case "location": return <IconLocation />;
        case "brute_force": return <IconShield />;
        default: return <IconInfo />;
    }
}

// ─── RiskBadge ────────────────────────────────────────────────────────────────
function RiskBadge({ score }) {
    const color = getSeverityColor(score);
    return (
        <View style={[s.riskBadge, { borderColor: color + "44" }]}>
            <Text style={s.riskLabel}>RISK</Text>
            <Text style={[s.riskNum, { color }]}>{score}</Text>
            <Text style={s.riskDenom}>/100</Text>
        </View>
    );
}

// ─── DetailChip ───────────────────────────────────────────────────────────────
function DetailChip({ label, value, accent }) {
    return (
        <View style={s.chip}>
            <Text style={s.chipLabel}>{label}</Text>
            <Text style={[s.chipValue, accent ? { color: accent, fontVariant: ["tabular-nums"] } : null]}>
                {value}
            </Text>
        </View>
    );
}

// ─── GlobeVisual ──────────────────────────────────────────────────────────────
function GlobeVisual({ locationLabel }) {
    // Static grid lines rendered with react-native-svg
    const hLines = [0, 25, 50, 75, 100];
    const vLines = [0, 14.28, 28.56, 42.84, 57.12, 71.4, 85.68, 100];

    return (
        <View style={s.globe}>
            {/* Grid */}
            <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
                {hLines.map((y, i) => (
                    <Line key={`h${i}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#52b788" strokeWidth={0.5} opacity={0.18} />
                ))}
                {vLines.map((x, i) => (
                    <Line key={`v${i}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%" stroke="#52b788" strokeWidth={0.5} opacity={0.18} />
                ))}
            </Svg>

            {/* Location pill */}
            <View style={s.globePill}>
                <IconLocation color="#4cc9f0" />
                <Text style={s.globeText}>{locationLabel || "Unknown Location"}</Text>
            </View>

            {/* Pulse dot (static — use Animated if you want the pulse effect) */}
            <View style={s.pulseDot} />
        </View>
    );
}

// ─── WarningBanner ────────────────────────────────────────────────────────────
function WarningBanner({ label, description }) {
    return (
        <View style={s.warning}>
            <IconShield color="#ff4d6d" />
            <View style={s.warningText}>
                <Text style={s.warningLabel}>{label}</Text>
                <Text style={s.warningDesc}>{description}</Text>
            </View>
        </View>
    );
}

// ─── AlertCard ────────────────────────────────────────────────────────────────
/**
 * Props:
 *   alert: {
 *     id: string,
 *     title: string,
 *     subtitle: string,
 *     type: "transaction" | "location" | "brute_force" | "default",
 *     risk_score: number,          // 0–100
 *     details: Record<string, string>,
 *     warning?: { label: string; description: string },
 *     extra_visual?: "globe",
 *     location_label?: string,
 *   }
 *   onInvestigate: (alert) => void
 *   onDismiss: (alert) => void
 */
export function AlertCard({ alert, onInvestigate, onDismiss }) {
    const [dismissed, setDismissed] = useState(false);
    const [investigating, setInvest] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    if (dismissed) return null;

    const borderColor = getSeverityColor(alert.risk_score);
    const detailPairs = alert.details ? Object.entries(alert.details) : [];

    const handleInvestigate = () => {
        setInvest(true);
        onInvestigate?.(alert);
        setTimeout(() => setInvest(false), 600);
    };

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss?.(alert);
    };

    const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
    const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    return (
        <Animated.View style={[s.card, { borderLeftColor: borderColor, transform: [{ scale: scaleAnim }] }]}>

            {/* ── Header ── */}
            <View style={s.header}>
                <View style={s.iconWrap}>{getIcon(alert.type)}</View>
                <View style={s.titleWrap}>
                    <Text style={s.title}>{alert.title}</Text>
                    <Text style={s.subtitle}>{alert.subtitle}</Text>
                </View>
                <RiskBadge score={alert.risk_score} />
            </View>

            {/* ── Detail chips ── */}
            {detailPairs.length > 0 && (
                <View style={s.detailGrid}>
                    {detailPairs.map(([k, v]) => (
                        <DetailChip
                            key={k}
                            label={k}
                            value={v}
                            accent={k === "AMOUNT" ? "#52b788" : k === "IP ADDR" ? "#4cc9f0" : undefined}
                        />
                    ))}
                </View>
            )}

            {/* ── Globe visual ── */}
            {alert.extra_visual === "globe" && (
                <GlobeVisual locationLabel={alert.location_label} />
            )}

            {/* ── Warning banner ── */}
            {alert.warning && (
                <WarningBanner label={alert.warning.label} description={alert.warning.description} />
            )}

            {/* ── Action buttons ── */}
            <View style={s.btnRow}>
                <TouchableOpacity
                    style={[s.btnInvestigate, investigating && { backgroundColor: "#3dd68c" }]}
                    onPress={handleInvestigate}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    activeOpacity={0.85}
                >
                    <Text style={s.btnInvestigateText}>
                        {investigating ? "Opening…" : "Investigate"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={s.btnDismiss}
                    onPress={handleDismiss}
                    activeOpacity={0.7}
                >
                    <Text style={s.btnDismissText}>Dismiss</Text>
                </TouchableOpacity>
            </View>

        </Animated.View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    card: {
        borderRadius: 16,
        backgroundColor: "#111827",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.07)",
        borderLeftWidth: 3,
        overflow: "hidden",
    },

    // Header
    header: {
        padding: 16,
        paddingBottom: 12,
        flexDirection: "row",
        gap: 12,
        alignItems: "flex-start",
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },
    titleWrap: { flex: 1 },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#e0e8f7",
        lineHeight: 22,
        marginBottom: 3,
    },
    subtitle: {
        fontSize: 11,
        color: "#8a9bb5",
        lineHeight: 16,
    },

    // Risk badge
    riskBadge: {
        minWidth: 56,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },
    riskLabel: {
        fontSize: 8,
        color: "#8a9bb5",
        letterSpacing: 1,
        marginBottom: 1,
    },
    riskNum: {
        fontSize: 18,
        fontWeight: "800",
        lineHeight: 20,
    },
    riskDenom: {
        fontSize: 8,
        color: "#8a9bb5",
    },

    // Detail grid
    detailGrid: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    chip: {
        width: "45%",
    },
    chipLabel: {
        fontSize: 8,
        color: "#8a9bb5",
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 2,
    },
    chipValue: {
        fontSize: 13,
        fontWeight: "600",
        color: "#e0e8f7",
    },

    // Globe
    globe: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 10,
        overflow: "hidden",
        height: 100,
        backgroundColor: "#050e1a",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(82,183,136,0.15)",
    },
    globePill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(10,20,35,0.85)",
        paddingVertical: 5,
        paddingHorizontal: 11,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(76,201,240,0.3)",
    },
    globeText: {
        fontSize: 12,
        color: "#c8e6f7",
        fontWeight: "500",
    },
    pulseDot: {
        position: "absolute",
        right: 20,
        top: 14,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#ff4d6d",
    },

    // Warning
    warning: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 10,
        backgroundColor: "rgba(255,77,109,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,77,109,0.2)",
        borderRadius: 10,
        flexDirection: "row",
        gap: 8,
        alignItems: "flex-start",
    },
    warningText: { flex: 1 },
    warningLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#ff6b87",
        marginBottom: 3,
    },
    warningDesc: {
        fontSize: 11,
        color: "#c0c8d8",
        lineHeight: 17,
    },

    // Buttons
    btnRow: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        flexDirection: "row",
        gap: 10,
    },
    btnInvestigate: {
        flex: 1,
        paddingVertical: 11,
        backgroundColor: "#52b788",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    btnInvestigateText: {
        color: "#0a1a0f",
        fontWeight: "700",
        fontSize: 13,
        letterSpacing: 0.3,
    },
    btnDismiss: {
        flex: 1,
        paddingVertical: 11,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(255,77,109,0.4)",
        alignItems: "center",
        justifyContent: "center",
    },
    btnDismissText: {
        color: "#ff6b87",
        fontWeight: "700",
        fontSize: 13,
        letterSpacing: 0.3,
    },
});

export default AlertCard;