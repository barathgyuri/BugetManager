import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: String,
}, { timestamps: true });

export default mongoose.model("Income", incomeSchema);
