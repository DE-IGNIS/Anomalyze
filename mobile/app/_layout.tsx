import { Stack } from "expo-router";
import { StatusBar, View, Text } from "react-native";

function HeaderTitle() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Text style={{ fontSize: 20 }}>🛡</Text>
      <Text
        style={{
          fontWeight: "700",
          fontSize: 26,
          color: "#4edea3",
          letterSpacing: -0.4,
        }}
      >
        Anomalyze
      </Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#091421" />
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: () => <HeaderTitle />,
          headerTitleAlign: "left",
          headerStyle: {
            backgroundColor: "#091421",
          },
          headerShadowVisible: false,
          // bottom border
          headerBottom: () => (
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(255,255,255,0.10)",
              }}
            />
          ),
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
}