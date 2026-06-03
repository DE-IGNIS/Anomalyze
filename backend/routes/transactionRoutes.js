import express from 'express';
import {
  getTransactions,
  addTransaction,
  getTransactionCount,
  getAlertTransactions
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/getTransactions', getTransactions);
router.get('/getTransactionCount', getTransactionCount);
router.post('/addTransactions', addTransaction);
router.get('/alerts', getAlertTransactions)

export default router;