import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type ItemCardProps = {
  user_id: string;
  amount: string;
  merchant_type: string;
  device: string;
  location: string;
};

export default function ItemCard({
  user_id,
  amount,
  merchant_type,
  device,
  location,
}: ItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <MaterialIcons name="inventory" size={24} color="#737972" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{merchant_type}</Text>
        <Text style={styles.cardDetail}>Amount: {amount}</Text>
        <Text style={styles.cardDetail}>Location: {location}</Text>
        <Text style={styles.cardDetail}>Device: {device}</Text>
        <Text style={styles.userId}>User: {user_id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#c2c8c0",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    marginVertical: 4,
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#efeeea",
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    marginLeft: 16,
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1c1a",
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 14,
    color: "#424842",
    marginBottom: 2,
  },
  userId: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    fontStyle: "italic",
  },
});
