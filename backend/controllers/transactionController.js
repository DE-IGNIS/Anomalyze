import supabase from '../config/supabase.js';

export const getTransactions = async (req, res) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error });

  res.json(data);
};

export const addTransaction = async (req, res) => {
  const { user_id, amount, merchant_type, device, location } = req.body;

  const { data, error } = await supabase
    .from('transactions')
    .insert([{ user_id, amount, merchant_type, device, location }])
    .select();

  if (error) return res.status(500).json({ error });

  res.json(data);
};