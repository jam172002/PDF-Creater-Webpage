// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import FormData from "./models/FormData.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/valuation_forms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// API to Save Form
app.post("/api/saveForm", async (req, res) => {
  try {
    const { fields } = req.body;
    const reportNumber = fields?.reportNumber?.value;

    if (!reportNumber) {
      return res.status(400).json({ error: "Missing report number" });
    }

    let existing = await FormData.findOne({
      "fields.reportNumber.value": reportNumber,
    });

    const flattenedFields = {}; // ✅ define once outside

    for (const [key, val] of Object.entries(fields)) {
      if (!key || typeof key !== "string" || key.trim() === "") {
        console.warn("⚠️ Skipping empty or invalid key:", key);
        continue;
      }
      flattenedFields[`fields.${key}`] = val;
    }

    if (Object.keys(flattenedFields).length === 0) {
      return res.status(400).json({ error: "No valid fields to update." });
    }

    if (existing) {
      const updated = await FormData.findByIdAndUpdate(
        existing._id,
        { $set: flattenedFields },
        { new: true }
      );

      return res.json({ message: "Form updated", id: updated._id });
    }

    // New form
    const newForm = new FormData({ fields });
    await newForm.save();
    return res.status(201).json({ message: "Form created", id: newForm._id });
  } catch (error) {
    console.error("❌ Save Error:", error);
    res.status(500).json({ error: "Server error during save" });
  }
});

// API to Get Latest Form
app.get("/api/getLatestForm", async (req, res) => {
  try {
    const latestForm = await FormData.findOne().sort({ createdAt: -1 });
    if (!latestForm) {
      return res.status(404).json({ message: "No form data found" });
    }
    res.json(latestForm);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Server Error: Cannot fetch form" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
