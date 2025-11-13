import express from "express";
import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
const router = express.Router();

// Category breakdown (expenses)
router.get("/expenses/category", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const results = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    res.json(results);
  } catch (err) {
    console.error('Error in /expenses/category:', err);
    res.status(500).json({ message: err.message });
  }
});

// Category breakdown (incomes)
router.get("/incomes/category", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const results = await Income.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    res.json(results);
  } catch (err) {
    console.error('Error in /incomes/category:', err);
    res.status(500).json({ message: err.message });
  }
});

// Trends over time (monthly sums for expenses & incomes)
router.get("/trends/monthly", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    // accept optional from/to query params for period filtering (YYYY-MM-DD)
    const { from, to } = req.query;
    const matchBase = { user: userId };
    if (from || to) {
      matchBase.date = {};
      if (from) matchBase.date.$gte = new Date(from);
      if (to) matchBase.date.$lte = new Date(to);
    }

    const monthsExpenses = await Expense.aggregate([
      { $match: matchBase },
      { $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" }
      }},
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthsIncomes = await Income.aggregate([
      { $match: matchBase },
      { $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" }
      }},
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // normalize into { label: "YYYY-MM", expense: n, income: m }
    const map = new Map();
    const pushToMap = (entry, keyName) => {
      const label = `${entry._id.year}-${String(entry._id.month).padStart(2,"0")}`;
      const existing = map.get(label) || { label, expense: 0, income: 0 };
      existing[keyName] = entry.total;
      map.set(label, existing);
    };

    monthsExpenses.forEach(e => pushToMap(e, "expense"));
    monthsIncomes.forEach(i => pushToMap(i, "income"));

    const result = Array.from(map.values());
    res.json(result);
  } catch (err) {
    console.error('Error in /trends/monthly:', err);
    res.status(500).json({ message: err.message });
  }
});

// Simple totals (totalIncome, totalExpense)
router.get("/summary", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const [expAgg, incAgg] = await Promise.all([
      Expense.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Income.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);
    const totalExpense = expAgg[0] ? expAgg[0].total : 0;
    const totalIncome = incAgg[0] ? incAgg[0].total : 0;
    res.json({ totalExpense, totalIncome, balance: totalIncome - totalExpense });
  } catch (err) {
    console.error('Error in /summary:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
