export const calculateRisk = ({
  amount,
  device,
  locationChanged = false,
  transactionTime = 12, // 24-hr format (e.g., 14 = 2PM)
  transactionCountInLastHour = 0
}) => {
  let risk = 0;
  const reasons = [];

  // 1. AMOUNT FACTOR (RBI high-value transaction rules)
  if (amount > 100000) {
    risk += 60;
    reasons.push("Very high amount (₹>1L)");
  } else if (amount > 50000) {
    risk += 30;
    reasons.push("High amount (₹50k-1L)");
  }

  // 2. DEVICE FACTOR (RBI device security guidelines)
  if (device === "unrecognized") {
    risk += 40;
    reasons.push("Unrecognized device");
  } else if (device === "new") {
    risk += 25;
    reasons.push("New device");
  }

  // 3. LOCATION ANOMALY (RBI location verification norms)
  if (locationChanged) {
    risk += 20;
    reasons.push("Location changed");
  }

  // 4. TIME-BASED RISK (RBI's high-risk time window)
  const hour = Math.floor(transactionTime);
  if (hour >= 0 && hour < 5) {
    risk += 30;
    reasons.push("Midnight transaction (11PM-5AM)");
  } else if (hour >= 20 && hour < 23) {
    risk += 15;
    reasons.push("Late-night transaction (8PM-11PM)");
  }

  // 5. TRANSACTION FREQUENCY (RBI suspicious activity monitoring)
  if (transactionCountInLastHour > 6) {
    risk += 45;
    reasons.push("Excessive transactions (>6/hour)");
  } else if (transactionCountInLastHour > 3) {
    risk += 25;
    reasons.push("High frequency (4-6/hour)");
  }

  let status = "VERIFIED";
  if (risk > 55) status = "ALERT"; // Manual review needed

  return {
    risk,
    status,
    // reason: reasons.join(", ") || "Low risk",
    confidence: Math.max(0, 100 - risk) // 0-100% confidence score
  };
};
