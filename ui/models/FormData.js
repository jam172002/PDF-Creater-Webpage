// models/FormData.js
import mongoose from 'mongoose';

const FormDataSchema = new mongoose.Schema({
  fields: {
    type: Object, // stores all fieldName -> { label, value }
    required: true
  }
}, { timestamps: true });

export default mongoose.model('FormData', FormDataSchema);
