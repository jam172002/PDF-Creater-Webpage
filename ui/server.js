// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import FormData from './models/FormData.js'; 

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/valuation_forms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// API to Save Form
app.post('/api/saveForm', async (req, res) => {
  try {
    const newForm = new FormData({
      fields: req.body.fields
    });
    await newForm.save();
    res.status(201).json({ message: 'Form saved successfully' });
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({ error: 'Server Error: Cannot save form' });
  }
});

// API to Get Latest Form
app.get('/api/getLatestForm', async (req, res) => {
  try {
    const latestForm = await FormData.findOne().sort({ createdAt: -1 });
    if (!latestForm) {
      return res.status(404).json({ message: 'No form data found' });
    }
    res.json(latestForm);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: 'Server Error: Cannot fetch form' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
