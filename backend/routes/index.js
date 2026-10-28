import { Router } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import asyncHandler from '../utils/asyncHandler.js';
import authRoutes from './authRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import goalRoutes from './goalRoutes.js';
import receiptRoutes from './receiptRoutes.js';
import reportRoutes from './reportRoutes.js';
import salaryRoutes from './salaryRoutes.js';
import transactionRoutes from './transactionRoutes.js';

const router = Router();
router.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Temporary diagnostics: only exists while DEBUG_ERRORS=1. Tests a real DB read AND write.
if (env.debugErrors) {
  router.get('/debug/db', asyncHandler(async (_req, res) => {
    const col = mongoose.connection.db.collection('_healthcheck');
    const { insertedId } = await col.insertOne({ at: new Date() });
    await col.deleteOne({ _id: insertedId });
    res.json({ status: 'ok', db: mongoose.connection.name, readyState: mongoose.connection.readyState, write: 'ok' });
  }));
}
router.use('/auth', authRoutes);
router.use('/salary', salaryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/receipts', receiptRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/budgets', budgetRoutes);
router.use('/reports', reportRoutes);
router.use('/savings-goals', goalRoutes);
export default router;
