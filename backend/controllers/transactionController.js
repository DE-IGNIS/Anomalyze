import supabase from "../config/supabase.js";
import { calculateRisk } from "../services/anomalyService.js";

export const getTransactions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .range(from, to)
    .order("created_at", { ascending: false });

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
