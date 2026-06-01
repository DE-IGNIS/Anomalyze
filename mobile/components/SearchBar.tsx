import { View, TextInput, StyleSheet } from "react-native";

interface Props {
  placeholder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
}

function SearchBar({ placeholder, onPress, value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onPressIn={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#c6c6cc"
        selectionColor="#3B82F6"
      />
    </View>
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    // Surface Layer (Glass-like feel)
    backgroundColor: "#16202e", // surface-container
    borderRadius: 8, // soft, not pill

    // Layout system (8px grid)
    paddingHorizontal: 16,
    paddingVertical: 12,

    // Glassmorphism subtle border
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  input: {
    flex: 1,

    // Typography
    color: "#d9e3f6",
    fontSize: 14,

    // Slight spacing
    padding: 0,
  },
});