import express from "express";
import Income from "../models/Income.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const incomes = await Income.find({ user: userId }).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    console.error('Error in GET /incomes:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const newIncome = new Income({ ...req.body, user: userId });
    await newIncome.save();
    res.json(newIncome);
  } catch (err) {
    console.error('Error in POST /incomes:', err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const updated = await Income.findOneAndUpdate({ _id: req.params.id, user: userId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found or not allowed" });
    res.json(updated);
  } catch (err) {
    console.error('Error in PUT /incomes/:id:', err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const deleted = await Income.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!deleted) return res.status(404).json({ message: "Not found or not allowed" });
    res.json({ message: "Income deleted" });
  } catch (err) {
    console.error('Error in DELETE /incomes/:id:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
