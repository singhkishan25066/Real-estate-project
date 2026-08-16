// models/Project.js
import mongoose from 'mongoose';

const PlotSizeSchema = new mongoose.Schema(
  {
    code: { type: String, default: '' }, // e.g. "A", "H" — matches the site plan
    sizeSqft: { type: Number, required: true },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    locality: { type: String, required: true }, // e.g. "Saifabad, Rajgir, Nalanda"
    district: { type: String, required: true }, // e.g. "Nalanda" or "Patna"
    ratePerSqft: { type: Number, required: true },
    plotSizes: { type: [PlotSizeSchema], default: [] },
    infraPoints: { type: [String], default: [] }, // bullet list of nearby infra
    paymentPlan: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
