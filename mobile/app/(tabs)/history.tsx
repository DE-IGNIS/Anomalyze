import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../../components/SearchBar";

const COLORS = {
  background: "#0A0E17",
  surface: "#111722",
  surfaceContainer: "#16202e",
  surfaceContainerHigh: "#1e2a3a",
  surfaceVariant: "#2b3544",
  outlineVariant: "#45464b",
  outline: "#5a6a82",
  outlineSoft: "#8898aa",
  onSurface: "#d9e3f6",
  secondary: "#4edea3",
  onSecondary: "#003824",
  error: "#ed032e",
  tertiary: "#adc6ff",
  white5: "rgba(255,255,255,0.05)",
  white10: "rgba(255,255,255,0.10)",
};

type TxStatus = "ALERT" | "VERIFIED";

interface Transaction {
  id: string | number;
  status: TxStatus;
  merchant_type: string;
  amount: number;
  time?: string;
}

const PAGE_SIZE = 5;

const statusConfig = (status: TxStatus) => {
  switch (status) {
    case "ALERT":
      return {
        bar: COLORS.error,
        badge: "rgba(255,143,163,0.10)",
        text: COLORS.error,
        label: "Alert",
      };
    case "VERIFIED":
    default:
      return {
        bar: COLORS.secondary,
        badge: "rgba(78,222,163,0.10)",
        text: COLORS.secondary,
        label: "Verified",
      };
  }
};

function TableHeader() {
  return (
    <View style={s.tableHeader}>
      <Text style={[s.colLabel, { flex: 1.4 }]}>STATUS</Text>
      <Text style={[s.colLabel, { flex: 2 }]}>TRANSACTION</Text>
      <Text style={[s.colLabel, { flex: 1.2, textAlign: "right" }]}>AMOUNT</Text>
    </View>
  );
}

function TransactionRow({ item }: { item: Transaction }) {
  const cfg = statusConfig(item.status);
  return (
    <TouchableOpacity activeOpacity={0.7} style={s.row}>
      {/* Status */}
      <View style={[s.rowCell, { flex: 1.4 }]}>
        <View style={s.statusCol}>
          <View style={[s.statusBar, { backgroundColor: cfg.bar }]} />
          <View>
            <View style={[s.badge, { backgroundColor: cfg.badge }]}>
              <Text style={[s.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
            </View>
            {/* time of transaction (broken) */}
            {/* <Text style={s.timeText}>{item.time ?? "—"}</Text> */}
          </View>
        </View>
      </View>

      {/* Merchant */}
      <View style={[s.rowCell, { flex: 2 }]}>
        <Text style={s.merchantName} numberOfLines={1}>
          {item.merchant_type}
        </Text>
        <Text style={s.txnId}>{item.id.toString().slice(0, 12).toUpperCase()}</Text>
      </View>

      {/* Amount */}
      <View style={[s.rowCell, { flex: 1.2, alignItems: "flex-end" }]}>
        <Text style={s.amount}>₹{item.amount.toLocaleString("en-IN")}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
}) {
  const getPageWindow = (): (number | "…")[] => {
    const delta = 1;
    const range: (number | "…")[] = [];
    const rangeSet = new Set<number>();

    const add = (n: number) => {
      if (n >= 1 && n <= totalPages) rangeSet.add(n);
    };

    add(1);
    add(totalPages);
    for (let i = page - delta; i <= page + delta; i++) add(i);

    const sorted = Array.from(rangeSet).sort((a, b) => a - b);

    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) range.push("…");
      range.push(sorted[i]);
    }

    return range;
  };

  return (
    <View style={s.paginationBar}>
      <Text style={s.paginationInfo}>
        Page{page}of{totalPages}
      </Text>
      <View style={s.paginationBtns}>
        <TouchableOpacity
          style={s.pageBtn}
          onPress={() => setPage(Math.max(1, page - 1))}
        >
          <Text style={s.pageBtnText}>‹</Text>
        </TouchableOpacity>

        {getPageWindow().map((p, i) =>
          p === "…" ? (
            <View key={`ellipsis-${i}`} style={s.pageBtn}>
              <Text style={s.pageBtnText}>…</Text>
            </View>
          ) : (
            <TouchableOpacity
              key={p}
              style={[s.pageBtn, page === p && s.pageBtnActive]}
              onPress={() => setPage(p)}
            >
              <Text style={[s.pageBtnText, page === p && s.pageBtnTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          )
        )}

        <TouchableOpacity
          style={s.pageBtn}
          onPress={() => setPage(Math.min(totalPages, page + 1))}
        >
          <Text style={s.pageBtnText}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `http://192.168.29.224:3000/api/transactions/getTransactions?page=${page}&limit=${PAGE_SIZE}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (Array.isArray(json)) {
          setTransactions(json);
          setTotalPages(Math.ceil(json.length / PAGE_SIZE) || 1);
        } else {
          setTransactions(json.data ?? []);
          setTotalPages(Math.ceil((json.total ?? json.data?.length ?? 0) / PAGE_SIZE) || 1);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [page]);

  const visibleRows = transactions.slice(0, PAGE_SIZE);

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {loading ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={s.loadingText}>Loading transactions…</Text>
        </View>
      ) : error ? (
        <View style={s.centered}>
          <Text style={[s.loadingText, { color: COLORS.error }]}>
            Error: {error}
          </Text>
        </View>
      ) : (
        <FlatList
          data={[1]}
          keyExtractor={() => "table"}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={() => (
            <View style={s.tablePanel}>
              <TableHeader />
              <View style={s.divider} />
              {visibleRows.map((item, index) => (
                <View key={item.id.toString()}>
                  <TransactionRow item={item} />
                  {index < visibleRows.length - 1 && (
                    <View style={s.divider} />
                  )}
                </View>
              ))}
            </View>
          )}
          ListHeaderComponent={
            <>
              <SearchBar
                placeholder="Search merchant, ID or amount…"
                onPress={() => { }}
                value=""
                onChangeText={() => { }}
              />
              <View style={{ height: 20 }} />
            </>
          }
          ListFooterComponent={
            <>
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
              <View style={{ height: 40 }} />
            </>
          }
        />
      )}
    </SafeAreaView>
  );
}

export default History;

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 0,
  },

  // ── Table
  tablePanel: {
    backgroundColor: "rgba(17,23,34,0.95)",
    borderWidth: 1,
    borderColor: COLORS.white5,
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: "center",
  },
  colLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.8,
    color: COLORS.outline,
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.white5,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white5,
  },
  rowCell: { justifyContent: "center" },

  statusCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  statusBar: {
    width: 2,
    height: 38,
    borderRadius: 2,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  timeText: {
    fontSize: 9,
    color: COLORS.outline,
    marginTop: 3,
    letterSpacing: 0.4,
  },

  merchantName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurface,
  },
  txnId: {
    fontSize: 9,
    color: COLORS.outline,
    marginTop: 2,
    letterSpacing: 0.8,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.onSurface,
  },

  // ── Pagination
  paginationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.white5,
  },
  paginationInfo: {
    fontSize: 10,
    color: COLORS.outline,
    letterSpacing: 0.4,
  },
  paginationBtns: {
    flexDirection: "row",
    gap: 4,
  },
  pageBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnActive: {
    backgroundColor: COLORS.secondary,
  },
  pageBtnText: {
    fontSize: 12,
    color: COLORS.outlineSoft,
    fontWeight: "600",
  },
  pageBtnTextActive: {
    color: COLORS.onSecondary,
    fontWeight: "700",
  },

  // ── States
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.outline,
  },
});