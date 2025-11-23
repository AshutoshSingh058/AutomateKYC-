const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  file_name: String,
  original_name: String,
  upload_time: String,
  
  quality: Object,
  ocr_raw_text: String,
  ocr_fields: Object,

  ai_document_type: String,
  ai_parsed_fields: Object,
  ai_issues: Array,

  status: { type: String, default: "PENDING" }
});

module.exports = mongoose.model("Document", DocumentSchema);
