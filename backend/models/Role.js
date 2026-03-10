const mongoose = require("mongoose");

const modulePermSchema = new mongoose.Schema(
  {
    view: { type: Boolean, default: true },
    create: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  { _id: false },
);

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    permissions: {
      dashboard: { type: modulePermSchema, default: () => ({ view: true }) },
      students: { type: modulePermSchema, default: () => ({ view: true }) },
      teachers: { type: modulePermSchema, default: () => ({ view: true }) },
      subjects: { type: modulePermSchema, default: () => ({ view: true }) },
      departments: { type: modulePermSchema, default: () => ({ view: true }) },
      attendance: { type: modulePermSchema, default: () => ({ view: true }) },
      reports: { type: modulePermSchema, default: () => ({ view: true }) },
      settings: { type: modulePermSchema, default: () => ({ view: false }) },
    },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Role", roleSchema);

