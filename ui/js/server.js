/**
 * server.js
 *
 * A simple Express server that connects to MongoDB and provides
 * endpoints to upsert and retrieve valuation form data by reportNumber.
 */

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import FormData from "../models/FormData.js"; // Adjust path if your models folder is in a different location

// Create an Express application
const app = express();

// -------------------------------------
// Configuration
// -------------------------------------

const PORT = process.env.PORT || 5500;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/valuation_forms";

// -------------------------------------
// 1. MIDDLEWARE SETUP
// -------------------------------------

// Allow cross-origin requests from your front-end
app.use(cors());

// Automatically parse JSON bodies on incoming requests
app.use(express.json());

// -------------------------------------
// 2. CONNECT TO MONGODB
// -------------------------------------

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------------------------
// 3. ROUTE: Upsert form data
//    PUT /api/form/:reportNumber
//    - Creates a new document if none exists for this reportNumber
//    - Otherwise updates only the provided fields
// -------------------------------------

app.put("/api/form/:reportNumber", async (req, res) => {
  const { reportNumber } = req.params;
  const { fields } = req.body;

  // ─── Validate inputs ───────────────────────────────────────────────────────
  if (!reportNumber) {
    return res.status(400).json({ error: "Missing reportNumber in URL" });
  }
  if (!fields || typeof fields !== "object") {
    return res
      .status(400)
      .json({ error: 'Request body must include a "fields" object' });
  }

  try {
    // ─── Build the $set payload, skipping any blank or invalid keys ───────────
    const updatePayload = {};
    for (const [key, entry] of Object.entries(fields)) {
      if (typeof key !== "string" || !key.trim()) {
        // skip empty or whitespace-only keys
        continue;
      }
      updatePayload[`fields.${key}`] = entry;
    }

    // If nothing valid to update, bail out
    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: "No valid fields to update." });
    }

    // ─── Perform upsert: insert if not exists, otherwise update ─────────────
    const form = await FormData.findOneAndUpdate(
      { reportNumber },
      {
        $set: updatePayload, // update only these fields
        $setOnInsert: { reportNumber }, // set reportNumber on insert
      },
      {
        new: true, // return the updated document
        upsert: true, // create if not found
      }
    );

    // ─── Success response ────────────────────────────────────────────────────
    return res.json({
      message: "Form data saved successfully",
      id: form._id,
      reportNumber: form.reportNumber,
    });
  } catch (err) {
    console.error("❌ Error saving form data:", err);
    return res
      .status(500)
      .json({ error: "Server error while saving form data" });
  }
});

// -------------------------------------
// 4. ROUTE: Retrieve form data
//    GET /api/form/:reportNumber
//    - Returns the stored fields for the given reportNumber
// -------------------------------------

app.get("/api/form/:reportNumber", async (req, res) => {
  const { reportNumber } = req.params;

  if (!reportNumber) {
    return res.status(400).json({ error: "Missing reportNumber in URL" });
  }

  try {
    const form = await FormData.findOne({ reportNumber });
    if (!form) {
      // No document found for this reportNumber
      return res
        .status(404)
        .json({ error: "Form data not found for this reportNumber" });
    }

    // Return the form’s fields map
    return res.json({
      reportNumber: form.reportNumber,
      fields: form.fields,
    });
  } catch (err) {
    console.error("❌ Error fetching form data:", err);
    return res
      .status(500)
      .json({ error: "Server error while retrieving form data" });
  }
});

// -------------------------------------
// 5. GLOBAL ERROR HANDLER
//    Catches any unhandled errors and sends a generic response.
// -------------------------------------

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// -------------------------------------
// 6. START THE SERVER
// -------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
