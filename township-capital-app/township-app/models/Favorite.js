// models/Favorite.js
// Lets a logged-in user bookmark projects, shown on their dashboard.
import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: true }
);

// A user can only favorite a given project once.
FavoriteSchema.index({ user: 1, project: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
