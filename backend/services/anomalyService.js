export const calculateRisk = ({ amount, device }) => {
  let risk = 0;
  let reason = [];

  if (amount > 50000) {
    risk += 50;
    reason.push("High amount");
  }

  if (device === "new") {
    risk += 30;
    reason.push("New device");
  }

  let status = "VERIFIED";

  if (risk > 70) status = "ALERT";
  else if (risk > 40) status = "WARNING";

  return { risk, status, reason: reason.join(", ") };
};