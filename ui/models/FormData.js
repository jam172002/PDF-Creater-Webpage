// models/FormData.js

import mongoose from "mongoose";

const { Schema, model } = mongoose;

/**
 * Sub-schema for each form field entry.
 * - label: human-readable field name
 * - value: the actual data, which may be string, number, boolean, date, or an object
 */
const FieldEntrySchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

/**
 * Main FormData schema
 */
const FormDataSchema = new Schema(
  {
    // Unique identifier for each report—used to upsert/fetch the right document
    reportNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // A map of fieldKey → { label, value }
    fields: {
      type: Map,
      of: FieldEntrySchema,
      required: true,
      default: {}, // start empty, then upsert will add entries
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default model("FormData", FormDataSchema);
