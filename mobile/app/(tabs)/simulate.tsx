// import { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";

// export default function Simulate() {
//   const [transAmount, setTransAmount] = useState("");
//   const [merchantType, setMerchantType] = useState("Select Merchant");
//   const [device, setDevice] = useState("");
//   const [open, setOpen] = useState(false);

//   const merchantOptions = [
//     "E-commerce Terminal",
//     "Demo Terminal 2",
//     "Demo Terminal 3",
//   ];
//   const deviceOptions = [
//     "iPhone 15 Pro(Primary)",
//     "Samsung s25",
//     "Demo Terminal 3",
//   ];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>This is a Simulate page</Text>

//       <Text>Transaction Simulator</Text>
//       <Text>
//         Configure parameters to test the security engine's response to specific
//         transaction patterns
//       </Text>
//       <TextInput
//         style={styles.input}
//         value={transAmount}
//         onChangeText={setTransAmount}
//         keyboardType="numeric"
//         placeholder="Enter amount"
//       />

//       {/* Selecting Merchant type */}
//       <View style={{ padding: 20 }}>
//         <Text>Merchant Type</Text>
//         <TouchableOpacity onPress={() => setOpen(!open)}>
//           <Text>{merchantType}</Text>
//         </TouchableOpacity>

//         {open &&
//           merchantOptions.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={() => {
//                 setMerchantType(item);
//                 setOpen(false);
//               }}
//             >
//               <Text>{item}</Text>
//             </TouchableOpacity>
//           ))}
//       </View>

//       <TextInput
//         style={styles.input}
//         value={merchantType}
//         onChangeText={setMerchantType}
//         placeholder="e.g. Grocery"
//       />

//       <Text>Origin Device</Text>
//       <TextInput
//         style={styles.input}
//         value={device}
//         onChangeText={setDevice}
//         placeholder="e.g. Mobile"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 5,
//   },
// });
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function Simulate() {
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("Select Merchant");
  const [device, setDevice] = useState("Select Device");

  const [openMerchant, setOpenMerchant] = useState(false);
  const [openDevice, setOpenDevice] = useState(false);

  const merchantOptions = [
    "E-commerce Terminal",
    "Point of Sale",
    "ATM Withdrawal",
    "P2P Transfer",
    "Crypto Gateway",
  ];

  const deviceOptions = [
    "iPhone 15 Pro (Primary)",
    "Samsung s25",
    "One Plus Nord5",
    "Vivo V20",
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Transaction Simulator</Text>
      <Text style={styles.subtitle}>
        Test security engine response to transaction patterns
      </Text>

      {/* Glass Card */}
      <View style={styles.card}>
        {/* Amount */}
        <Text style={styles.label}>AMOUNT (INR)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor="#6b7280"
          keyboardType="numeric"
        />

        {/* Merchant */}
        <Text style={styles.label}>MERCHANT TYPE</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setOpenMerchant(!openMerchant);
            setOpenDevice(false);
          }}
        >
          <Text style={styles.dropdownText}>{merchant}</Text>
        </TouchableOpacity>

        {openMerchant &&
          merchantOptions.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.option}
              onPress={() => {
                setMerchant(item);
                setOpenMerchant(false);
              }}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}

        {/* Device */}
        <Text style={styles.label}>ORIGIN DEVICE</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setOpenDevice(!openDevice);
            setOpenMerchant(false);
          }}
        >
          <Text style={styles.dropdownText}>{device}</Text>
        </TouchableOpacity>

        {openDevice &&
          deviceOptions.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.option}
              onPress={() => {
                setDevice(item);
                setOpenDevice(false);
              }}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}

        {/* CTA */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Run Secure Simulation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E17", // base background
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#d9e3f6",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#9aa4b2",
    marginBottom: 24,
  },

  /* Glass Card */
  card: {
    backgroundColor: "rgba(31,41,55,0.6)", // glass feel
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  label: {
    fontSize: 12,
    color: "#c6c6cc",
    marginBottom: 6,
    marginTop: 12,
    letterSpacing: 1,
  },

  input: {
    backgroundColor: "#1F2937",
    borderRadius: 4,
    padding: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#374151",
  },

  dropdown: {
    backgroundColor: "#1F2937",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#374151",
  },

  dropdownText: {
    color: "#e5e7eb",
  },

  option: {
    backgroundColor: "#111827",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },

  optionText: {
    color: "#cbd5e1",
  },

  button: {
    marginTop: 24,
    backgroundColor: "#10B981", // success green
    padding: 14,
    borderRadius: 4,
    alignItems: "center",
  },

  buttonText: {
    color: "#003824",
    fontWeight: "600",
  },
});