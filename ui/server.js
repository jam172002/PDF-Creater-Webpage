// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import FormData from "./models/FormData.js"; // Optional Mongoose model

const app = express();
const PORT = 5000;

// =====================
// 1. MIDDLEWARE SETUP
// =====================
app.use(cors());
app.use(express.json());

// =====================
// 2. CONNECT TO MONGODB
// =====================
mongoose
  .connect("mongodb://127.0.0.1:27017/valuation_forms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const db = mongoose.connection;

// =====================
// 3. SAVE SECTION 1 DATA
// =====================
app.post("/save-section1", async (req, res) => {
  const { reportNumber, section1Data } = req.body;

  if (!reportNumber || !section1Data) {
    return res.status(400).json({
      success: false,
      message: "Missing report number or Section 1 data",
    });
  }

  try {
    const result = await db
      .collection("formdatas")
      .updateOne(
        { reportNumber },
        { $set: { section1: section1Data } },
        { upsert: true }
      );

    res.json({ success: true, updatedCount: result.modifiedCount });
  } catch (error) {
    console.error("❌ Error saving Section 1:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error saving Section 1" });
  }
});

// =====================
// 4. SAVE SECTION 2 DATA INTO SAME DOCUMENT
// =====================
app.post("/save-section2", async (req, res) => {
  const { reportNumber, section2Data } = req.body;
  if (!reportNumber || !section2Data) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    const result = await db.collection("formdatas").updateOne(
      { reportNumber }, // Find by reportNumber
      { $set: { section2: section2Data } }, // Set section2 field
      { upsert: true } // Insert if not exists
    );

    res.json({ success: true, updatedCount: result.modifiedCount });
  } catch (err) {
    console.error("❌ Error saving Section 2:", err);
    res.status(500).json({ success: false, message: "DB error" });
  }
});
// =====================
// 5. GET SECTION 2 DATA
// =====================
app.get("/get-section2/:reportNumber", async (req, res) => {
  try {
    const report = await db
      .collection("formdatas")
      .findOne(
        { reportNumber: req.params.reportNumber },
        { projection: { section2: 1, _id: 0 } }
      );

    if (!report || !report.section2) {
      return res.status(404).json(null);
    }

    res.json(report.section2);
  } catch (err) {
    console.error("❌ Error fetching Section 2:", err);
    res
      .status(500)
      .json({ message: "Internal server error fetching Section 2" });
  }
});

// =====================
// 6. UNIVERSAL SAVE FORM (OPTIONAL MONGOOSE SCHEMA)
// =====================
app.post("/api/saveForm", async (req, res) => {
  try {
    const { fields } = req.body;
    const reportNumber = fields?.reportNumber?.value;

    if (!reportNumber) {
      return res.status(400).json({ error: "Missing report number" });
    }

    const flattenedFields = {};
    for (const [key, val] of Object.entries(fields)) {
      if (key && typeof key === "string" && key.trim()) {
        flattenedFields[`fields.${key}`] = val;
      }
    }

    if (Object.keys(flattenedFields).length === 0) {
      return res.status(400).json({ error: "No valid fields to update." });
    }

    const existing = await FormData.findOne({
      "fields.reportNumber.value": reportNumber,
    });

    if (existing) {
      const updated = await FormData.findByIdAndUpdate(
        existing._id,
        { $set: flattenedFields },
        { new: true }
      );
      return res.json({ message: "Form updated", id: updated._id });
    }

    const newForm = new FormData({ fields });
    await newForm.save();
    return res.status(201).json({ message: "Form created", id: newForm._id });
  } catch (error) {
    console.error("❌ Save Error:", error);
    res.status(500).json({ error: "Server error during save" });
  }
});

// =====================
// 7. GET LATEST FORM
// =====================
app.get("/api/getLatestForm", async (req, res) => {
  try {
    const latestForm = await FormData.findOne().sort({ createdAt: -1 });
    if (!latestForm) {
      return res.status(404).json({ message: "No form data found" });
    }
    res.json(latestForm);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ error: "Server Error: Cannot fetch form" });
  }
});

// =====================
// 8. START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
