import express from 'express';
import {
  getTransactions,
  addTransaction,
  getTransactionCount
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/getTransactions', getTransactions);
router.get('/getTransactionCount', getTransactionCount);
router.post('/addTransactions', addTransaction);

export default router;