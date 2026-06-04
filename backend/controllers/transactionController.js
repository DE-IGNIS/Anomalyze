import supabase from "../config/supabase.js";
import { calculateRisk } from "../services/anomalyService.js";
import { generateTransactionID, formatTimestamp } from "../services/transactionIDService.js"

export const getTransactions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json({ data, total: count });
};

export const getTransactionCount = async (req, res) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*");
  // const { count, error } = await supabase
  // .select("*", { count: "exact", head: true }); // head:true fetches no rows, just count
  // res.json({ total: count });

  if (error) return res.status(500).json({ error });
  res.json(data);
};

export const addTransaction = async (req, res) => {
  const { user_id, amount, merchant_type, device, location } = req.body;

  const { risk, status, reason } = calculateRisk({
    amount,
    device,
  });

  const { data, error } = await supabase
    .from("transactions")
    .insert([
      {
        user_id,
        amount,
        merchant_type,
        device,
        location,
        status,
        risk_score: risk,
      },
    ])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data);
};

export const getAlertTransactions = async (req, res) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("id, amount, merchant_type, device, location, status, created_at, risk_score, ip_address")
    .eq("status", "ALERT"); // filter only alerts

  if (error) return res.status(500).json({ error });

  // formatTimestamp()

  const transformedData = data.map(txn => ({
    transaction_id: generateTransactionID(txn.id),
    amount: txn.amount,
    device: txn.device,
    location: txn.location,
    risk_score: txn.risk_score,
    created_at: formatTimestamp(txn.created_at),
    merchant_type: txn.merchant_type,
    ip_address: txn.ip_address,
  }));

  /*
  Print data while debugging
  console.log(transformedData);
  */
  res.json({ data: transformedData });
};



























