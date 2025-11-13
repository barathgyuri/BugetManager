import express from "express";
import Expense from "../models/Expense.js";

const router = express.Router();

// List for authenticated user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('Error in GET /expenses:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const newExpense = new Expense({ ...req.body, user: userId });
    await newExpense.save();
    res.json(newExpense);
  } catch (err) {
    console.error('Error in POST /expenses:', err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const updated = await Expense.findOneAndUpdate({ _id: req.params.id, user: userId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found or not allowed" });
    res.json(updated);
  } catch (err) {
    console.error('Error in PUT /expenses/:id:', err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const deleted = await Expense.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!deleted) return res.status(404).json({ message: "Not found or not allowed" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error('Error in DELETE /expenses/:id:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
