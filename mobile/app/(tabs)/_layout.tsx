import React from "react";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import Svg, { Path, Circle, Rect, Line, Polyline } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Dashboard icon — 4 grid squares
const DashboardIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={1.8} />
    <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={1.8} />
    <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={1.8} />
    <Rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={1.8} />
  </Svg>
);

// Anomalies icon — warning triangle with exclamation
const AnomaliesIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx="12" cy="17" r="0.5" fill={color} stroke={color} strokeWidth={1.5} />
  </Svg>
);

// Simulate icon — science/flask beaker
const SimulateIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 3h6M9 3v7L4.5 17A2 2 0 006 20h12a2 2 0 001.5-3L15 10V3"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="9" y1="3" x2="15" y2="3" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx="9" cy="16" r="1" fill={color} />
    <Circle cx="13" cy="14" r="0.7" fill={color} />
  </Svg>
);

// History icon — clock with arrow
const HistoryIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12a9 9 0 1018 0A9 9 0 003 12z"
      stroke={color}
      strokeWidth={1.8}
    />
    <Polyline
      points="3,12 6,9 3,6"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 7v5l3 3"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Colors matching SafeTransact dark theme
// secondary = #4edea3 (active), outline = #909096 (inactive)
const ACTIVE_COLOR = "#4edea3";
const INACTIVE_COLOR = "#909096";

const TabIcon = ({
  focused,
  icon: Icon,
  title,
  // isCenter,
}: {
  focused: boolean;
  icon: React.ComponentType<{ color: string }>;
  title: string;
  // isCenter?: boolean;
}) => {
  // if (isCenter) {
  //   // Simulate tab: highlighted pill container like the HTML version
  //   return (
  //     <View
  //       style={{
  //         alignItems: "center",
  //         justifyContent: "center",
  //         backgroundColor: focused
  //           ? "rgba(0, 165, 114, 0.3)"
  //           : "rgba(0, 165, 114, 0.12)",
  //         borderRadius: 12,
  //         paddingHorizontal: 16,
  //         paddingVertical: 6,
  //         height: 44,
  //       }}
  //     >
  //       <Icon color={focused ? ACTIVE_COLOR : ACTIVE_COLOR} />
  //       <Text
  //         numberOfLines={1}
  //         style={{
  //           fontSize: moderateScale(9),
  //           color: ACTIVE_COLOR,
  //           fontWeight: focused ? "600" : "400",
  //           marginTop: 2,
  //           letterSpacing: 0.05 * moderateScale(9),
  //         }}
  //       >
  //         {title}
  //       </Text>
  //     </View>
  //   );
  // }

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: 44,
        width: 60,
      }}
    >
      <Icon color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
      <Text
        numberOfLines={1}
        style={{
          fontSize: moderateScale(9),
          color: focused ? ACTIVE_COLOR : INACTIVE_COLOR,
          fontWeight: focused ? "600" : "400",
          marginTop: 2,
          letterSpacing: 0.05 * moderateScale(9),
        }}
      >
        {title}
      </Text>
    </View>
  );
};

const _Layout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 0,
        },
        tabBarStyle: {
          backgroundColor: "rgba(9, 20, 33, 0.85)", // surface/80 = #091421 at 80% opacity
          borderTopWidth: 1,
          borderTopColor: "rgba(255, 255, 255, 0.1)",
          height: moderateScale(52) + insets.bottom,
          paddingBottom: insets.bottom,
          // Rounded top corners matching rounded-t-xl
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          // Shadow matching shadow-[0_-4px_12px_rgba(0,0,0,0.5)]
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 16,
        },
      }}
    >
      <Tabs.Screen
        name="simulate"
        options={{
          title: "Simulate",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={SimulateIcon} title="Simulate" />
          ),
        }}
      />
      <Tabs.Screen
        name="anomaly"
        options={{
          title: "Anomalies",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={AnomaliesIcon} title="Anomalies" />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={DashboardIcon}
              title="Dashboard"
              // isCenter
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={HistoryIcon} title="History" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;