import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenses.js";
import incomeRoutes from "./routes/incomes.js";
import analyticsRoutes from "./routes/analytics.js";
import { authMiddleware } from "./middleware/auth.js";
import path from "path";

dotenv.config();
const app = express();
app.use(express.json());

const __dirname = path.resolve();

const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'https://bugetmanager.onrender.com'],
  credentials: true
}));

// Mongoose configuration
// Starting with Mongoose 6+, the default parser and topology options are used and
// passing useNewUrlParser/useUnifiedTopology is no longer necessary. We set
// strictQuery explicitly to avoid deprecation warnings and to be explicit about
// query filtering behavior.
mongoose.set('strictQuery', false);

// Connect to MongoDB using async/await and handle errors cleanly.
async function startServer() {
  console.log('Connection started');
  try {
    // Some .env files may include surrounding quotes around the URI. Trim them.
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not set in environment');
    }
    mongoUri = mongoUri.replace(/^"|"$/g, '').replace(/^'|'$/g, '');

    console.log(`Attempting MongoDB connection to ${mongoUri.startsWith('mongodb+srv') ? 'Atlas cluster (mongodb+srv)' : mongoUri}`);
    // Set a reasonable server selection timeout so failures surface quickly.
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Exit the process if we can't connect to the database. This avoids running
    // the server in a broken state.
    process.exit(1);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

// Connection event handlers for better diagnostics and graceful shutdown
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error (connection event):', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Ensure mongoose connection is closed on process termination signals
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error while closing MongoDB connection', err);
    process.exit(1);
  }
});

app.use("/api/auth", authRoutes);

// Debug endpoint to inspect incoming requests
app.get("/api/debug", (req, res) => {
  res.json({
    headers: req.headers,
    authHeader: req.headers.authorization,
    message: "Debug endpoint"
  });
});

// Protect the finance routes with auth middleware
app.use("/api/expenses", authMiddleware, expenseRoutes);
app.use("/api/incomes",  authMiddleware, incomeRoutes);
app.use("/api/analytics", authMiddleware, analyticsRoutes);

app.get("/", (req, res) => res.send("Finance Tracker API"));


app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
})

// Start the server only after a successful MongoDB connection
startServer();
