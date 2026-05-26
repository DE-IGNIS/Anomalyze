// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";

// import { StyleSheet } from "react-native";

// // Define the Transaction type
// interface Transaction {
//   id: string | number;
//   status: "FLAGGED" | "WARNING" | "APPROVED";
//   merchant_type: string;
//   amount: number;
// }

// // Create status style function outside of styles object
// const statusStyle = (status: "FLAGGED" | "WARNING" | "APPROVED") => ({
//   fontWeight: "bold" as const,
//   color:
//     status === "FLAGGED" ? "red" :
//     status === "WARNING" ? "orange" :
//     "green"
// });

// function History() {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // fetching paginated transactions from backend
//         const res = await fetch(
//           `http://192.168.29.224:3000/api/getTransactions?page=${page}`,
//         );

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const data = await res.json();

//         // setting fetched data
//         setTransactions(data);
//       } catch (err: any) {
//         setError(err.message);
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();

//     // ❗ IMPORTANT: page added as dependency so data refetches on page change
//   }, [page]);

//   // loading state UI
//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading transactions...</Text>
//       </View>
//     );
//   }

//   // error state UI
//   if (error) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Error: {error}</Text>
//       </View>
//     );
//   }

//   // ❌ this was incorrectly placed outside styles, moved inside StyleSheet
//   /*
//   status: (status) => ({
//     color:
//       status === "FLAGGED" ? "red" :
//       status === "WARNING" ? "orange" :
//       "green"
//   })
//   */

//   return (
//     <View style={{ flex: 1 }}>
//       <Text>This is the history page</Text>

//       {/* ❌ ScrollView not needed with FlatList (causes performance issues) */}
//       {/* Keeping it commented as requested */}
//       {/*
//       <ScrollView>
//       */}

//       {/* OLD IMPLEMENTATION (kept as requested) */}
//       {/*
//       <FlatList
//         data={transactions}
//         renderItem={({ item }) => <ItemCard {...item} />}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={1}
//         scrollEnabled={false}
//         ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//       />
//       */}

//       {/* NEW TABLE-LIKE LIST */}
//       <FlatList
//         data={transactions}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }: { item: Transaction }) => (
//           <View style={styles.row}>

//             {/* STATUS COLUMN */}
//             <Text style={statusStyle(item.status)}>
//               {item.status}
//             </Text>

//             {/* TRANSACTION COLUMN */}
//             <View>
//               <Text style={styles.merchant}>{item.merchant_type}</Text>

//               {/* showing shortened transaction id */}
//               <Text style={styles.txnId}>
//                 {item.id.toString().slice(0, 8)}
//               </Text>
//             </View>

//             {/* AMOUNT COLUMN */}
//             <Text style={styles.amount}>
//               Rs {item.amount}
//             </Text>

//           </View>
//         )}
//       />

//       {/* </ScrollView> */}

//       {/* PAGINATION */}
//       <View style={styles.pagination}>
//         {[1,2,3,4,5].map(p => (
//           <TouchableOpacity
//             key={p}
//             onPress={() => setPage(p)}
//             style={[
//               styles.pageButton,
//               page === p && styles.activePage
//             ]}
//           >
//             <Text style={styles.pageText}>{p}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//     </View>
//   );
// }

// export default History;

// // ✅ STYLES
// const styles = StyleSheet.create({
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: "#ddd"
//   },

//   merchant: {
//     fontSize: 16,
//     fontWeight: "600"
//   },

//   txnId: {
//     fontSize: 12,
//     color: "gray"
//   },

//   amount: {
//     fontSize: 16,
//     fontWeight: "bold"
//   },

//   pagination: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginVertical: 10
//   },

//   pageButton: {
//     padding: 8,
//     marginHorizontal: 4,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5
//   },

//   activePage: {
//     backgroundColor: "#4CAF50"
//   },

//   pageText: {
//     fontSize: 14
//   }
// });

import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";

// ─── Theme ────────────────────────────────────────────────────────────────────
const COLORS = {
  background: "#091421",
  surface: "#091421",
  surfaceContainer: "#16202e",
  surfaceContainerHigh: "#212b39",
  surfaceVariant: "#2b3544",
  outlineVariant: "#45464b",
  outline: "#909096",
  onSurface: "#d9e3f6",
  onSurfaceVariant: "#c6c6cc",
  secondary: "#4edea3",
  secondaryContainer: "#00a572",
  onSecondary: "#003824",
  error: "#ffb4ab",
  tertiary: "#adc6ff",
  white5: "rgba(255,255,255,0.05)",
  white10: "rgba(255,255,255,0.10)",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type TxStatus = "FLAGGED" | "WARNING" | "APPROVED";

interface Transaction {
  id: string | number;
  status: TxStatus;
  merchant_type: string;
  amount: number;
  time?: string;
  ip?: string;
  location?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig = (status: TxStatus) => {
  switch (status) {
    case "FLAGGED":
      return {
        bar: COLORS.error,
        badge: "rgba(255,180,171,0.10)",
        text: COLORS.error,
        label: "Flagged",
      };
    case "WARNING":
      return {
        bar: COLORS.tertiary,
        badge: "rgba(173,198,255,0.10)",
        text: COLORS.tertiary,
        label: "Warning",
      };
    case "APPROVED":
    default:
      return {
        bar: COLORS.secondary,
        badge: "rgba(78,222,163,0.10)",
        text: COLORS.secondary,
        label: "Verified",
      };
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Header() {
  return (
    <View style={s.header}>
      <View style={s.headerLeft}>
        {/* shield icon approximated with a simple box */}
        <View style={s.iconBox}>
          <Text style={s.iconText}>🛡</Text>
        </View>
        <Text style={s.appName}>SafeTransact</Text>
      </View>
      <View style={s.headerRight}>
        <TouchableOpacity style={s.iconBtn}>
          <Text style={s.iconBtnText}>⌕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.iconBtn}>
          <Text style={s.iconBtnText}>◯</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SearchBar() {
  const [query, setQuery] = useState("");
  return (
    <View style={s.searchSection}>
      {/* Search input */}
      <View style={s.searchRow}>
        <View style={s.searchInputWrapper}>
          <Text style={s.searchIcon}>⌕</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search Transaction ID, Merchant, or IP..."
            placeholderTextColor={COLORS.outline}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        {/* Filter Button  */}
        {/* <TouchableOpacity style={s.filterBtn}>
          <Text style={s.filterBtnText}>⊟ Filter</Text>
        </TouchableOpacity> */}
      </View>

      {/* Active filter chips */}
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.chipRow}
      > */}
        {/* <View style={[s.chip, s.chipActive]}>
          <Text style={[s.chipText, { color: COLORS.secondary }]}>
            RISK: HIGH ✕
          </Text>
        </View> */}
        {/* <View style={[s.chip, s.chipMuted]}>
          <Text style={[s.chipText, { color: COLORS.onSurfaceVariant }]}>
            TYPE: EXTERNAL ✕
          </Text>
        </View> */}
      {/* </ScrollView> */}
    </View>
  );
}

function TableHeader() {
  return (
    <View style={s.tableHeader}>
      <Text style={[s.colLabel, { flex: 1.4 }]}>STATUS</Text>
      <Text style={[s.colLabel, { flex: 2 }]}>TRANSACTION</Text>
      <Text style={[s.colLabel, { flex: 1.2, textAlign: "right" }]}>
        AMOUNT
      </Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

function TransactionRow({ item }: { item: Transaction }) {
  const cfg = statusConfig(item.status);
  return (
    <TouchableOpacity activeOpacity={0.7} style={s.row}>
      {/* Status column */}
      <View style={[s.rowCell, { flex: 1.4 }]}>
        <View style={s.statusCol}>
          <View style={[s.statusBar, { backgroundColor: cfg.bar }]} />
          <View>
            <View style={[s.badge, { backgroundColor: cfg.badge }]}>
              <Text style={[s.badgeText, { color: cfg.text }]}>
                {cfg.label}
              </Text>
            </View>
            <Text style={s.timeText}>{item.time ?? "—"}</Text>
          </View>
        </View>
      </View>

      {/* Merchant column */}
      <View style={[s.rowCell, { flex: 2 }]}>
        <Text style={s.merchantName} numberOfLines={1}>
          {item.merchant_type}
        </Text>
        <Text style={s.txnId}>
          {item.id.toString().slice(0, 12).toUpperCase()}
        </Text>
      </View>

      {/* Amount column */}
      <View style={[s.rowCell, { flex: 1.2, alignItems: "flex-end" }]}>
        <Text style={s.amount}>₹{item.amount.toLocaleString("en-IN")}</Text>
      </View>

      {/* Arrow */}
      <View style={{ width: 24, alignItems: "center" }}>
        <Text style={s.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

function Pagination({
  page,
  setPage,
}: {
  page: number;
  setPage: (p: number) => void;
}) {
  return (
    <View style={s.paginationBar}>
      <Text style={s.paginationInfo}>Showing page {page}</Text>
      <View style={s.paginationBtns}>
        <TouchableOpacity
          style={s.pageBtn}
          onPress={() => setPage(Math.max(1, page - 1))}
        >
          <Text style={s.pageBtnText}>‹</Text>
        </TouchableOpacity>
        {[1, 2, 3, 4, 5].map((p) => (
          <TouchableOpacity
            key={p}
            style={[s.pageBtn, page === p && s.pageBtnActive]}
            onPress={() => setPage(p)}
          >
            <Text style={[s.pageBtnText, page === p && s.pageBtnTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={s.pageBtn} onPress={() => setPage(page + 1)}>
          <Text style={s.pageBtnText}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InsightCard() {
  return (
    <View style={s.insightRow}>
      {/* Analytics card */}
      <View style={[s.glassPanel, s.analyticsCard]}>
        <Text style={s.analyticsTitle}>Security Analytics</Text>
        <Text style={s.analyticsBody}>
          Unusual activity detected from 3 new IP addresses in the South East
          Asia region. Immediate verification recommended.
        </Text>
        <TouchableOpacity style={s.analyticsBtn}>
          <Text style={s.analyticsBtnText}>View Threat Map</Text>
        </TouchableOpacity>
      </View>

      {/* Network health card */}
      <View style={[s.glassPanel, s.healthCard]}>
        <Text style={s.healthIcon}>✔</Text>
        <Text style={s.healthLabel}>NETWORK HEALTH</Text>
        <Text style={s.healthValue}>99.98%</Text>
        <View style={s.healthBarBg}>
          <View style={s.healthBarFill} />
        </View>
      </View>
    </View>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav() {
  const items = [
    { icon: "⊞", label: "Dashboard" },
    { icon: "⚠", label: "Anomalies" },
    { icon: "⚗", label: "Simulate" },
    { icon: "⏱", label: "History", active: true },
  ];
  return (
    <View style={s.bottomNav}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[s.navItem, item.active && s.navItemActive]}
        >
          <Text style={[s.navIcon, item.active && { color: COLORS.secondary }]}>
            {item.icon}
          </Text>
          <Text
            style={[s.navLabel, item.active && { color: COLORS.secondary }]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `http://192.168.29.224:3000/api/getTransactions?page=${page}`,
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [page]);

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* <Header /> */}

      {loading ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={s.loadingText}>Loading transactions...</Text>
        </View>
      ) : error ? (
        <View style={s.centered}>
          <Text style={[s.loadingText, { color: COLORS.error }]}>
            Error: {error}
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <SearchBar />
              {/* Transaction table */}
              <View style={s.glassPanel}>
                <TableHeader />
                <View style={s.divider} />
              </View>
            </>
          }
          renderItem={({ item, index }) => (
            <View
              style={[
                s.glassPanel,
                {
                  marginTop: index === 0 ? 0 : 0,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: COLORS.white5,
                },
              ]}
            >
              <TransactionRow item={item} />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
          ListFooterComponent={
            <>
              <Pagination page={page} setPage={setPage} />
              {/* <InsightCard /> */}
              <View style={{ height: 90 }} />
            </>
          }
        />
      )}

      {/* <BottomNav /> */}
    </SafeAreaView>
  );
}

export default History;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: COLORS.background,
    backgroundColor: "#0A0E17",
  },

  // ── Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(9,20,33,0.85)",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBox: { marginRight: 4 },
  iconText: { fontSize: 18 },
  appName: {
    fontFamily: "System",
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.secondary,
    letterSpacing: -0.4,
  },
  headerRight: { flexDirection: "row", gap: 4 },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
  },
  iconBtnText: { fontSize: 20, color: COLORS.onSurface },

  // ── Search
  searchSection: { paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  searchRow: { flexDirection: "row", gap: 8 },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 18, color: COLORS.outline },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.onSurface,
    fontFamily: "System",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterBtnText: { fontSize: 13, color: COLORS.onSurface },
  chipRow: { flexDirection: "row", marginTop: 2 },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: "rgba(78,222,163,0.08)",
    borderColor: "rgba(78,222,163,0.2)",
  },
  chipMuted: {
    backgroundColor: COLORS.surfaceVariant,
    borderColor: "transparent",
  },
  chipText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    fontFamily: "System",
  },

  // ── Table / List
  listContent: { paddingHorizontal: 16, paddingTop: 16, gap: 0 },
  glassPanel: {
    backgroundColor: "rgba(43,53,68,0.40)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(33,43,57,0.5)",
    alignItems: "center",
  },
  colLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: COLORS.outline,
    textTransform: "uppercase",
  },
  divider: { height: 1, backgroundColor: COLORS.white5 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white5,
  },
  rowCell: { justifyContent: "center" },

  statusCol: { flexDirection: "row", alignItems: "center", gap: 10 },
  statusBar: {
    width: 3,
    height: 42,
    borderRadius: 4,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  timeText: {
    fontSize: 10,
    color: COLORS.outline,
    marginTop: 3,
    letterSpacing: 0.5,
  },

  merchantName: { fontSize: 15, fontWeight: "600", color: COLORS.onSurface },
  txnId: {
    fontSize: 10,
    color: COLORS.outline,
    marginTop: 2,
    letterSpacing: 0.8,
    fontFamily: "System",
  },
  amount: { fontSize: 16, fontWeight: "700", color: COLORS.onSurface },
  arrow: { fontSize: 18, color: COLORS.outline },

  // ── Pagination
  paginationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(33,43,57,0.3)",
    borderRadius: 12,
    marginTop: 0,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  paginationInfo: { fontSize: 10, color: COLORS.outline, letterSpacing: 0.5 },
  paginationBtns: { flexDirection: "row", gap: 4 },
  pageBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnActive: { backgroundColor: COLORS.secondary },
  pageBtnText: { fontSize: 12, color: COLORS.outline },
  pageBtnTextActive: { color: COLORS.onSecondary, fontWeight: "700" },

  // ── Insight cards
  insightRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  analyticsCard: {
    flex: 2,
    padding: 16,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.onSurface,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  analyticsBody: {
    fontSize: 13,
    color: COLORS.outline,
    lineHeight: 18,
    marginBottom: 14,
  },
  analyticsBtn: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  analyticsBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.onSecondary,
  },
  healthCard: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  healthIcon: { fontSize: 22, color: COLORS.secondary },
  healthLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: COLORS.outline,
    textTransform: "uppercase",
    marginTop: 4,
  },
  healthValue: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.onSurface,
    marginTop: 4,
  },
  healthBarBg: {
    height: 6,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 4,
    marginTop: 10,
    overflow: "hidden",
  },
  healthBarFill: {
    height: "100%",
    width: "99.98%",
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },

  // ── Bottom nav ***
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    paddingBottom: 20,
    backgroundColor: "rgba(9,20,33,0.85)",
    borderTopWidth: 1,
    borderTopColor: COLORS.white10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: "rgba(0,165,114,0.15)",
  },
  navIcon: { fontSize: 20, color: COLORS.outline },
  navLabel: {
    fontSize: 10,
    color: COLORS.outline,
    marginTop: 3,
    letterSpacing: 0.5,
    fontWeight: "500",
  },

  // ── States
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: { fontSize: 14, color: COLORS.outline },
});
